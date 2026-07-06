import "dotenv/config";

import express from "express";
import cors from "cors";
import pool from "./config/db.js";

import productsRoutes from "./routes/products.routes.js";
import designsRoutes from "./routes/designs.routes.js";
import collectionsRoutes from "./routes/collections.routes.js";
import orderRoutes from "./routes/order.js";
import authRoutes from "./routes/auth.js";
import lookupsRoutes from "./routes/lookups.routes.js";
import homepageRoutes from "./routes/homepage.routes.js";

import { sendEmail } from "./utils/sendEmail.js";

const app = express();

// ==============================
// ENV CHECK
// ==============================

console.log(
  "DATABASE_URL:",
  process.env.DATABASE_URL ? "FOUND ✅" : "MISSING ❌"
);

console.log(
  "RAZORPAY_KEY_ID:",
  process.env.RAZORPAY_KEY_ID ? "FOUND ✅" : "MISSING ❌"
);

console.log(
  "RESEND_API_KEY:",
  process.env.RESEND_API_KEY ? "FOUND ✅" : "MISSING ❌"
);

if (!process.env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY is missing in .env");
}

// ==============================
// MIDDLEWARE
// ==============================

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

// ==============================
// ROUTES
// ==============================

app.use("/api/products", productsRoutes);
app.use("/api/designs", designsRoutes);
app.use("/api/collections", collectionsRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/lookups", lookupsRoutes);
app.use("/api/homepage", homepageRoutes);

// ==============================
// HEALTH CHECK
// ==============================

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ==============================
// DATABASE TEST
// ==============================

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      time: result.rows[0],
    });
  } catch (error) {
    console.error("DB ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// ==============================
// EMAIL TEST
// ==============================

app.get("/test-email", async (req, res) => {
  try {
    await sendEmail({
      subject: "🔥 Test Email - MythStreet",
      text: "If you received this, email is working perfectly ✅",
    });

    res.send("✅ Email sent");
  } catch (err) {
    console.error("EMAIL ERROR:", err);

    res.send("❌ Email failed");
  }
});

// ==============================
// GLOBAL ERROR HANDLER
// ==============================

app.use((err, req, res, next) => {
  console.error("❌ GLOBAL ERROR:", err);

  res.status(500).json({
    error: "Internal Server Error",
    details: err.message,
  });
});

// ==============================
// START SERVER
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});