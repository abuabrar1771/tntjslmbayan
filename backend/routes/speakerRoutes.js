import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../dbConnection/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_jwt_secret_key';

// 📱 HELPER: Phone number sanitizer to enforce single canonical '+91' format
const normalizePhoneNumber = (phone) => {
  if (!phone) return '';
  let digitsOnly = phone.replace(/\D/g, ''); // strip spaces/letters
  if (digitsOnly.startsWith('91') && digitsOnly.length > 10) {
    digitsOnly = digitsOnly.substring(2); // drop country code block if doubled
  }
  return `+91${digitsOnly}`;
};

// 👥 ENDPOINT 1: Fetch all speakers for the dropdown selection
router.get('/', async (req, res) => {
  try {
    const queryText = `
      SELECT speaker_id, speakerna_eng, speakerna_ta, address, role_name, phone_number 
      FROM speaker_master 
      ORDER BY speakerna_eng ASC;
    `;
    const result = await pool.query(queryText);
    res.status(200).json(result.rows); // Returns direct clean array to the frontend
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

    // 👑 A. Admin Verification Bypass Match
    if (normalizedPhone === process.env.ADMIN_MOBILENUM && password === process.env.ADMIN_PASSWORD) {
      const adminToken = jwt.sign({ id: 0, role: 'Admin' }, JWT_SECRET, { expiresIn: '24h' });
      return res.status(200).json({
        success: true,
        message: "Welcome Admin!",
        token: adminToken,
        speaker: { id: 0, nameEng: "ADMIN", nameTa: "நிர்வாகி", phoneNumber: normalizedPhone, role: "Admin" }
      });
    }

    // 👥 B. Speaker Registry Search Match
    const queryText = `SELECT * FROM speaker_master WHERE phone_number = $1`;
    const result = await pool.query(queryText, [normalizedPhone]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid phone number or password." });
    }

    const speaker = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, speaker.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid phone number or password." });
    }

    const token = jwt.sign({ id: speaker.speaker_id, role: speaker.role_name }, JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({
      success: true,
      message: "Authorized & Dashboard Initialized successfully!",
      token,
      speaker: {
        id: speaker.speaker_id,
        nameEng: speaker.speakerna_eng,
        nameTa: speaker.speakerna_ta,
        phoneNumber: speaker.phone_number,
        role: speaker.role_name
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

    const checkQuery = `SELECT 1 FROM speaker_master WHERE phone_number = $1`;
    const checkResult = await pool.query(checkQuery, [normalizedPhone]);
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ success: false, message: "User phone registry already verified." });
    }

    const hashedCryptoKey = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO speaker_master (speakerna_eng, speakerna_ta, address, role_name, phone_number, password_hash) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING speaker_id;
    `;
    const values = [
      nameEng.toUpperCase().trim(),
      nameTa.trim(),
      address ? address.toUpperCase().trim() : null,
      roleName || 'Speaker',
      normalizedPhone,
      hashedCryptoKey
    ];

    const result = await pool.query(insertQuery, values);
    const newId = result.rows[0].speaker_id;

    const token = jwt.sign({ id: newId, role: roleName || 'Speaker' }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      success: true,
      message: "Commit Registration Profile completed successfully!",
      token,
      speaker: { id: newId, nameEng: nameEng.toUpperCase(), nameTa, phoneNumber: normalizedPhone, role: roleName || 'Speaker' }
    });
  } catch (error) {
    console.error("❌ SIGNUP ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Registration processing failure." });
  }
});

export default router;