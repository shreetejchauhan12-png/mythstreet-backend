import pkg from "pg";
const { Pool } = pkg;

// 🔍 Debug (will print in Render logs)
console.log("DB URL:", process.env.DATABASE_URL ? "FOUND ✅" : "MISSING ❌");

// 🚀 Create Pool using Render DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Render Postgres
  },
});

// ✅ Optional: test connection on startup
pool.connect()
  .then(() => console.log("✅ PostgreSQL Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

export default pool;