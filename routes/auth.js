import express from "express";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import axios from "axios";

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

    // 🔥 SEND OTP VIA MSG91 FLOW API
    const response = await axios.post(
      "https://control.msg91.com/api/v5/flow/",
      {
        template_id: "69e762869a0c34f9580785b9",
        mobile: "91" + phone,
        OTP: otp, // must match ##OTP## in template
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("📲 OTP sent to", phone);
    console.log("MSG91 RESPONSE:", response.data);

    res.json({ success: true });

  } catch (error) {
    console.error(
      "SEND OTP ERROR:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Failed to send OTP",
      details: error.response?.data || error.message,
    });
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
    if (String(otp) !== String(user.otp)) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // ❌ EXPIRED OTP
    if (!user.otp_expiry || new Date() > user.otp_expiry) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // 🔥 CLEAR OTP
    await pool.query(
      `
      UPDATE users 
      SET otp = NULL, otp_expiry = NULL 
      WHERE phone = $1
      `,
      [phone]
    );

    // 🔥 GENERATE TOKEN
    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      process.env.JWT_SECRET,
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
    res.status(500).json({ error: "Failed to verify OTP" });
  }
});

export default router;