router.post("/verify-msg91", async (req, res) => {
  try {
    console.log("🔥 /verify-msg91 HIT");

    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token required" });
    }

    // 🔥 VERIFY WITH MSG91 (ONLY ONCE)
    const response = await axios.post(
      "https://control.msg91.com/api/v5/widget/verifyAccessToken",
      {
        authkey: process.env.MSG91_AUTH_KEY,
        "access-token": token,
      }
    );

    console.log("📡 MSG91 VERIFY RESPONSE:", response.data);

    // ✅ GET PHONE DIRECTLY
    const phone = response.data?.data?.mobile;

    if (!phone) {
      return res.status(400).json({ error: "Invalid token" });
    }

    // 🔥 CREATE / UPDATE USER
    const result = await pool.query(
      `
      INSERT INTO users (phone)
      VALUES ($1)
      ON CONFLICT (phone)
      DO UPDATE SET phone = EXCLUDED.phone
      RETURNING *
      `,
      [phone]
    );

    const user = result.rows[0];

    // 🔥 JWT (30 DAYS LOGIN)
    const jwtToken = jwt.sign(
      { id: user.id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user.id,
        phone: user.phone,
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