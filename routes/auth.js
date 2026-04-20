import express from "express";
import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Resend } from "resend";

const router = express.Router();

// 🔥 RESEND SETUP
const resend = new Resend(process.env.RESEND_API_KEY);


// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1,$2,$3)
       RETURNING id, name, email`,
      [name, email, hashedPassword]
    );

    res.json({
      success: true,
      user: result.rows[0],
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      "secret123",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


// 🔥 SEND OTP (NEW)
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    // 🔥 GENERATE OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // 🔥 SAVE OTP
    await pool.query(
      `INSERT INTO otp_codes (email, otp)
       VALUES ($1, $2)
       ON CONFLICT (email)
       DO UPDATE SET otp = $2, created_at = NOW()`,
      [email, otp]
    );

    // 🔥 SEND EMAIL
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Your OTP Code",
      html: `<h2>Your OTP is: ${otp}</h2><p>Valid for 5 minutes</p>`,
    });

    res.json({ success: true });

  } catch (error) {
    console.error("OTP ERROR:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});


// 🔥 VERIFY OTP + RESET PASSWORD (NEW)
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM otp_codes WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "OTP not found" });
    }

    const record = result.rows[0];

    if (parseInt(otp) !== record.otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // 🔥 HASH NEW PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "UPDATE users SET password = $1 WHERE email = $2",
      [hashedPassword, email]
    );

    // 🔥 DELETE OTP AFTER USE
    await pool.query("DELETE FROM otp_codes WHERE email = $1", [email]);

    res.json({ success: true });

  } catch (error) {
    console.error("RESET ERROR:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});


export default router;