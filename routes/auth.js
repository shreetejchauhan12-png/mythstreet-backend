import express from "express";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();


// 🔥 SEND OTP (PHONE)
router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Phone required" });
    }

    // 🔥 GENERATE OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // 🔥 SAVE / UPDATE USER
    await pool.query(
      `
      INSERT INTO users (phone, otp, otp_expiry)
      VALUES ($1, $2, NOW() + INTERVAL '5 minutes')
      ON CONFLICT (phone)
      DO UPDATE SET otp = $2, otp_expiry = NOW() + INTERVAL '5 minutes'
      `,
      [phone, otp]
    );

    console.log("🔥 OTP for", phone, "is:", otp);

    res.json({ success: true });

  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


// 🔥 VERIFY OTP (LOGIN)
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ error: "Phone & OTP required" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE phone = $1",
      [phone]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];

    // ❌ INVALID OTP
    // 🔥 SAFE OTP COMPARISON
if (String(otp) !== String(user.otp)) {
  return res.status(400).json({ error: "Invalid OTP" });
}

    // ❌ EXPIRED OTP
    if (!user.otp_expiry || new Date() > user.otp_expiry) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // 🔥 CLEAR OTP COMPLETELY
    await pool.query(
      `UPDATE users 
       SET otp = NULL, otp_expiry = NULL 
       WHERE phone = $1`,
      [phone]
    );

    // 🔥 GENERATE TOKEN
    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      "secret123",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
      },
    });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


export default router;