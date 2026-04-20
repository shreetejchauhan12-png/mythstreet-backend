import pkg from "pg";
const { Pool } = pkg;

// 🔍 Debug (safe log)
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is MISSING");
} else {
  console.log("✅ DATABASE_URL loaded");
}

// 🚀 Create single pool instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // 🔥 REQUIRED for Render PostgreSQL
  ssl: {
    rejectUnauthorized: false,
  },

  // optional but good
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// ✅ Test connection once (no leak)
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL Connected");
    client.release();
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
  }
})();

export default pool;