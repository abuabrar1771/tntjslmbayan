import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../dbConnection/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_jwt_secret_key';

// 📱 Robust Phone Normalizer: Guarantees exact +91XXXXXXXXXX string format
const normalizePhoneNumber = (phone) => {
  if (!phone) return '';
  const digitsOnly = phone.replace(/\D/g, ''); // Extract digits only
  const tenDigitBase = digitsOnly.slice(-10);   // Always extract the last 10 digits
  return `+91${tenDigitBase}`;
};

// 👥 ENDPOINT 1: Fetch all speakers for dropdown selection
router.get('/', async (req, res) => {
  try {
    const queryText = `
      SELECT speaker_id, speakerna_eng, speakerna_ta, address, role_name, phone_number 
      FROM speaker_master 
      ORDER BY speakerna_eng ASC;
    `;
    const result = await pool.query(queryText);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ ERROR FETCHING SPEAKERS:", error);
    res.status(500).json({ success: false, message: "Database failure fetching speakers list." });
  }
});

// 🔐 ENDPOINT 2: Normalized Speaker & Admin Login Handler
router.post('/login', async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    if (!phoneNumber || !password) {
      return res.status(400).json({ success: false, message: "Phone number and password are required." });
    }

    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    const tenDigitBase = normalizedPhone.slice(-10);
    const cleanPassword = password ? password.trim() : '';

    // 🔍 Fetch Admin credentials from .env
    const envAdminPhone = process.env.ADMIN_MOBILENUM ? process.env.ADMIN_MOBILENUM.trim() : '';
    const envAdminPass = process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD.trim() : '';

    // 👑 A. Admin Verification Check
    if (normalizedPhone === envAdminPhone && cleanPassword === envAdminPass) {
      console.log("🟢 ADMIN LOGIN SUCCESSFUL");
      const adminToken = jwt.sign({ id: 0, role: 'Admin' }, JWT_SECRET, { expiresIn: '24h' });
      return res.status(200).json({
        success: true,
        message: "Welcome Admin!",
        token: adminToken,
        speaker: { 
          id: 0, 
          nameEng: "ADMIN", 
          nameTa: "நிர்வாகி", 
          phoneNumber: normalizedPhone, 
          role: "Admin" 
        }
      });
    }

    // 👥 B. Speaker Registry Search Match (Matches on the last 10 digits in Postgres)
    const queryText = `
      SELECT * FROM speaker_master 
      WHERE RIGHT(phone_number, 10) = $1
    `;
    const result = await pool.query(queryText, [tenDigitBase]);

    if (result.rows.length === 0) {
      console.log(`❌ LOGIN FAIL: No user found in database matching phone ending in: ${tenDigitBase}`);
      return res.status(401).json({ success: false, message: "Invalid phone number or password." });
    }

    const speaker = result.rows[0];

    // Password Check against bcrypt hash in Postgres
    const isPasswordValid = await bcrypt.compare(cleanPassword, speaker.password_hash);
    
    if (!isPasswordValid) {
      console.log(`❌ LOGIN FAIL: Password mismatch for user ${speaker.speakerna_eng} (ID: ${speaker.speaker_id})`);
      return res.status(401).json({ success: false, message: "Invalid phone number or password." });
    }

    console.log(`🟢 SPEAKER LOGIN SUCCESSFUL: ${speaker.speakerna_eng}`);

    const userRole = speaker.role_name || 'Speaker';
    const token = jwt.sign({ id: speaker.speaker_id, role: userRole }, JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({
      success: true,
      message: "Authorized & Dashboard Initialized successfully!",
      token,
      speaker: {
        id: speaker.speaker_id,
        nameEng: speaker.speakerna_eng,
        nameTa: speaker.speakerna_ta,
        phoneNumber: speaker.phone_number,
        role: userRole
      }
    });
  } catch (error) {
    console.error("❌ LOGIN ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Internal server authentication barrier." });
  }
});

// 📝 ENDPOINT 3: Speaker / User Signup Registry Handler
router.post('/signup', async (req, res) => {
  const { nameEng, nameTa, phoneNumber, password, address, roleName } = req.body;

  try {
    if (!nameEng || !nameTa || !phoneNumber || !password) {
      return res.status(400).json({ success: false, message: "Required fields are missing." });
    }

    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    const tenDigitBase = normalizedPhone.slice(-10);

    // Resilient check to see if phone already exists
    const checkQuery = `
      SELECT 1 FROM speaker_master 
      WHERE RIGHT(phone_number, 10) = $1
    `;
    const checkResult = await pool.query(checkQuery, [tenDigitBase]);
    
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ success: false, message: "User phone registry already verified." });
    }

    const hashedCryptoKey = await bcrypt.hash(password.trim(), 10);
    const assignedRole = roleName || 'Speaker';

    const insertQuery = `
      INSERT INTO speaker_master (speakerna_eng, speakerna_ta, address, role_name, phone_number, password_hash) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING speaker_id;
    `;
    const values = [
      nameEng.toUpperCase().trim(),
      nameTa.trim(),
      address ? address.toUpperCase().trim() : null,
      assignedRole,
      normalizedPhone,
      hashedCryptoKey
    ];

    const result = await pool.query(insertQuery, values);
    const newId = result.rows[0].speaker_id;

    console.log(`🟢 NEW SPEAKER REGISTERED: ${nameEng.toUpperCase()} (ID: ${newId})`);

    const token = jwt.sign({ id: newId, role: assignedRole }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      success: true,
      message: "Commit Registration Profile completed successfully!",
      token,
      speaker: { 
        id: newId, 
        nameEng: nameEng.toUpperCase().trim(), 
        nameTa: nameTa.trim(), 
        phoneNumber: normalizedPhone, 
        role: assignedRole 
      }
    });
  } catch (error) {
    console.error("❌ SIGNUP ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Registration processing failure." });
  }
});

export default router;