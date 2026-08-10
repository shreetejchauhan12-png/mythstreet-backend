import fs from "fs";
import path from "path";

async function ensureHistoryTable(pool) {

  await pool.query(`
    CREATE TABLE IF NOT EXISTS script_history (

      id SERIAL PRIMARY KEY,

      script_type VARCHAR(50) NOT NULL,

      file_name VARCHAR(255) NOT NULL,

      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      UNIQUE(script_type, file_name)

    );
  `);

}

export async function runSqlFiles({
  pool,
  folderPath,
  scriptType,
  actionName,
}) {

  await ensureHistoryTable(pool);

  const files = fs
    .readdirSync(folderPath)
    .filter(file => file.endsWith(".sql"))
    .sort();

  if (files.length === 0) {

    console.log(`⚠️ No ${actionName} files found.`);

    return;

  }

  for (const file of files) {

    const exists = await pool.query(
      `
      SELECT 1
      FROM script_history
      WHERE script_type = $1
      AND file_name = $2
      `,
      [scriptType, file]
    );

    if (exists.rowCount > 0) {

      console.log(`⏭️ Skipping ${file}`);

      continue;

    }

    console.log(`🚀 Running ${file}`);

    const sql = fs.readFileSync(
      path.join(folderPath, file),
      "utf8"
    );

    await pool.query("BEGIN");

    try {

      await pool.query(sql);

      await pool.query(
        `
        INSERT INTO script_history
        (
          script_type,
          file_name
        )
        VALUES
        (
          $1,
          $2
        )
        `,
        [
          scriptType,
          file
        ]
      );

      await pool.query("COMMIT");

      console.log(`✅ ${file} completed`);

    } catch (error) {

      await pool.query("ROLLBACK");

      throw error;

    }

  }

}