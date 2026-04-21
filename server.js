import "dotenv/config"; // ✅ MUST be first

import express from "express";
import cors from "cors";
import pool from "./config/db.js";

import productsRoutes from "./routes/products.js";
import orderRoutes from "./routes/order.js";
import authRoutes from "./routes/auth.js";

const app = express();

// 🔥 ENV DEBUG (VERY IMPORTANT)
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

// ❗ HARD FAIL IF RESEND MISSING (so you don’t debug blindly)
if (!process.env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY is missing in .env");
}

// ✅ MIDDLEWARE
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

// 🔥 ROUTES
app.use("/api/products", productsRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/auth", authRoutes);

// ✅ HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ DB TEST
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      time: result.rows[0],
    });
  } catch (error) {
    console.error("DB ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ❌ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("❌ GLOBAL ERROR:", err);
  res.status(500).json({
    error: "Internal Server Error",
    details: err.message,
  });
});

const PORT = process.env.PORT || 5000;

// ✅ START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});