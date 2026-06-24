import express from 'express'; 
import pool from '../dbConnection/db.js';

const router = express.Router();

// The master static configurations mapped by Tamil Day -> Time -> Places array
const categoryMap = {
  "திங்கள்": [
    { time: "இரவு 7.00", place: ["கரீம் காம்பவுண்ட்", "லுக்மான் மெடிக்கல்"] }
  ],
  "செவ்வாய்": [
    { time: "காலை 11.00", place: ["அஸ்தம்பட்டி"] }
  ],
  "புதன்": [
    { time: "காலை 11.00", place: ["அஷ்ரப் பாய் வீடு"] },
    { time: "இரவு 7.00", place: ["லுக்மான் மெடிக்கல்"] }
  ],
  "வியாழன்": [
    { time: "காலை 11.00", place: ["சிட்டி ஹோட்டல் எதிரில்"] }
  ],
  "வெள்ளி": [
    { time: "மாலை 5.00", place: ["ஆஷிப் பாய் வீடு", "திப்பு நகர்"] }
  ],
  "சனி": [
    { time: "காலை 11.00", place: ["ஜங்ஷன்"] },
    { time: "மாலை 5.00", place: ["திப்பு இஸ்லாமியா"] }
  ],
  "ஞாயிறு": [
    { time: "மாலை 4.00", place: ["மணியனூர்"] }
  ]
};

// 🗓️ Endpoint 1: Get list of available day string identifiers
router.get('/days', (req, res) => {
  res.json(Object.keys(categoryMap));
});

// ⏳ Endpoint 2: Get specific time slots & locations for a selected Tamil day
router.get('/slots/:day', (req, res) => {
  const { day } = req.params;
  const dayData = categoryMap[day] || [];
  res.json(dayData);
});

// 📝 Endpoint 3: Save Form Submission right into the fresh Relational Database Schema
router.post('/save-schedule', async (req, res) => {
  const { speakerId, speakerNameTa, speakerNameEng, bayanDay, bayanPlace, bayanTime, scheduleDate } = req.body;

  try {
    // 1. Strict input payload verification checks
    if (!speakerId || !speakerNameTa || !bayanDay || !bayanPlace || !bayanTime || !scheduleDate) {
      return res.status(400).json({ success: false, message: "All input fields are required to save." });
    }

    // 2. Structured SQL execution block incorporating the double-quoted "status" column identifier
    const queryText = `
      INSERT INTO bayan_schedule (
        speaker_id, 
        speakerna_ta, 
        speakerna_eng, 
        bayan_day, 
        bayan_place, 
        bayan_time, 
        schedule_date, 
        "status", 
        created_by, 
        created_at
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) 
      RETURNING schedule_id;
    `;

    const values = [
      speakerId,
      speakerNameTa,
      speakerNameEng || null,
      bayanDay,
      bayanPlace,
      bayanTime,
      scheduleDate,
      'Scheduled', // Matches the default status structural rate
      'Admin'      // Fallback baseline user context tracker
    ];

    const result = await pool.query(queryText, values);

    res.status(201).json({
      success: true,
      message: "Bayan Schedule saved successfully into PostgreSQL!",
      scheduleId: result.rows[0].schedule_id
    });

  } catch (error) {
    console.error("❌ BACKEND ROUTE INSERTION FAILURE:", error);
    res.status(500).json({ success: false, message: "Internal server database failure while processing schedule." });
  }
});

// 📊 Endpoint 4: Get range reports matching your database configuration projections
router.get('/weekly-report', async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Start and End dates are required." });
    }

    // Projections target your new relational fields, sequentially ordered by calendar date
    const queryText = `
      SELECT 
        schedule_id,
        speaker_id,
        speakerna_ta,
        speakerna_eng,
        bayan_day,
        bayan_time,
        bayan_place,
        "status",
        TO_CHAR(schedule_date, 'YYYY-MM-DD') as formatted_date
      FROM bayan_schedule
      WHERE schedule_date >= $1 AND schedule_date <= $2
      ORDER BY schedule_date ASC, bayan_time DESC;
    `;

    const reportData = await pool.query(queryText, [startDate, endDate]);
    res.status(200).json({ success: true, data: reportData.rows });

  } catch (error) {
    console.error("❌ REPORT METRIC COMPILATION CRASH:", error);
    res.status(500).json({ success: false, message: "Internal database report retrieval failure." });
  }
});

export default router;