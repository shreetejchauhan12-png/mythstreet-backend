import pkg from "pg";

const { Pool } = pkg;


// =====================================
// DATABASE URL CHECK
// =====================================

if (!process.env.DATABASE_URL) {

  console.error(
    "❌ DATABASE_URL is MISSING"
  );

} else {

  console.log(
    "✅ DATABASE_URL loaded"
  );

}


// =====================================
// POSTGRESQL POOL
// =====================================

const pool = new Pool({

  connectionString:
    process.env.DATABASE_URL,

  // Required for Render PostgreSQL
  ssl: {
    rejectUnauthorized: false,
  },

  // Connection pool
  max: 10,

  // Keep idle connections alive
  idleTimeoutMillis: 30000,

  // Give Render PostgreSQL more time
  // to wake up / establish connection
  connectionTimeoutMillis: 15000,

});


// =====================================
// DATABASE CONNECTION TEST
// =====================================

(async () => {

  try {

    const client =
      await pool.connect();

    console.log(
      "✅ PostgreSQL Connected"
    );

    client.release();

  } catch (err) {

    console.error(
      "❌ DB Connection Error:",
      err.message
    );

  }

})();


// =====================================
// EXPORT
// =====================================

export default pool;