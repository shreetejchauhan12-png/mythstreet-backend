import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ecommerce_db",
  password: "postgres123",
  port: 5432,
});

export default pool;