import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

import pool from "../config/db.js";
import { runSqlFiles } from "./helpers/migration-runner.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsPath = path.join(
  __dirname,
  "../database/migrations"
);

async function runMigrations() {

  try {

    await runSqlFiles({

      pool,

      folderPath: migrationsPath,

      scriptType: "migration",

      actionName: "migration",

    });

    console.log("\n🎉 All migrations completed.");

    process.exit(0);

  } catch (error) {

    console.error("\n❌ Migration failed:");

    console.error(error);

    process.exit(1);

  }

}

runMigrations();