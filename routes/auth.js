import express from "express";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import axios from "axios";

const router = express.Router();


// ============================================
// 🔥 NEW SYSTEM — MSG91 TOKEN LOGIN (FINAL)
// ============================================
router.post("/verify-msg91", async (req, res) => {
  try {
    console.log("🔥 /verify-msg91 HIT");

    const { token, name, email } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token required" });
    }
    // 🔥 VERIFY WITH MSG91
const response = await axios.post(
  "https://control.msg91.com/api/v5/widget/verifyAccessToken",
  {
    authkey: process.env.MSG91_AUTH_KEY,
    "access-token": token,
  }
);

    // 🔥 VERIFY WITH MSG91

    console.log("📡 MSG91 VERIFY RESPONSE:", response.data);

    // ✅ GET PHONE
    // STEP 1: get access token (JWT)
const phone = response.data?.message;

if (!phone) {
  return res.status(400).json({ error: "Invalid token" });
}

    // 🔥 CREATE / UPDATE USER

const result = await pool.query(
  `
  INSERT INTO users (phone, name, email)
VALUES ($1, $2, $3)

  ON CONFLICT (phone)
  DO UPDATE SET
    phone = EXCLUDED.phone,
    name = EXCLUDED.name,
    email = EXCLUDED.email

  RETURNING *
  `,
  [phone, name, email]
);

    const user = result.rows[0];

    // 🔥 JWT (30 DAYS LOGIN)
    const jwtToken = jwt.sign(
  {
    id: user.id,
    phone: user.phone,
    name: user.name,
    email: user.email,
    role: user.phone === "919021943839" ? "admin" : "user",
  },
  process.env.JWT_SECRET,
  { expiresIn: "30d" }
);

    return res.json({
  success: true,
  token: jwtToken,
  user: {
    id: user.id,
    phone: user.phone,
    name: user.name,
    email: user.email,
  },
});

  } catch (error) {
    console.error(
      "❌ MSG91 VERIFY ERROR:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      error: "Verification failed",
      details: error.response?.data || error.message,
    });
  }
});


// ============================================
// ⚠️ BACKUP OTP SYSTEM (OPTIONAL)
// ============================================

// 🔥 SEND OTP (TEST MODE)
router.post("/send-otp", async (req, res) => {
  try {
    console.log("🔥 /send-otp HIT");

    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Phone required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await pool.query(
      `
      INSERT INTO users (phone, otp, otp_expiry)
      VALUES ($1, $2, NOW() + INTERVAL '5 minutes')
      ON CONFLICT (phone)
      DO UPDATE SET otp = $2, otp_expiry = NOW() + INTERVAL '5 minutes'
      `,
      [phone, otp]
    );

    return res.json({
      success: true,
      otp,
    });

  } catch (error) {
    console.error("❌ SEND OTP ERROR:", error);

    return res.status(500).json({
      error: "Failed to send OTP",
    });
  }
});


// 🔥 VERIFY OTP (OLD)
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE phone = $1",
      [phone]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];

    if (String(otp) !== String(user.otp)) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (!user.otp_expiry || new Date() > user.otp_expiry) {
      return res.status(400).json({ error: "OTP expired" });
    }

    await pool.query(
      `UPDATE users SET otp = NULL, otp_expiry = NULL WHERE phone = $1`,
      [phone]
    );

    const token = jwt.sign(
  {
    id: user.id,
    phone: user.phone,
    role: user.phone === "919021943839" ? "admin" : "user",
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
      },
    });

  } catch (error) {
    console.error("❌ VERIFY OTP ERROR:", error);

    return res.status(500).json({
      error: "Failed to verify OTP",
    });
  }
});


// 🔥 LOGOUT
router.post("/logout", (req, res) => {
  res.json({ success: true });
});

router.post("/update-name", async (req, res) => {
  try {
    const { name } = req.body;

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      "UPDATE users SET name = $1 WHERE id = $2 RETURNING *",
      [name, decoded.id]
    );

    return res.json({
      success: true,
      user: result.rows[0],
    });

  } catch (error) {
    console.error("❌ UPDATE NAME ERROR:", error);
    return res.status(500).json({ error: "Failed to update name" });
  }
});
export default router;