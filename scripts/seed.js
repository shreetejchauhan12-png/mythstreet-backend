import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

import pool from "../config/db.js";
import { runSqlFiles } from "./helpers/migration-runner.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedsPath = path.join(
  __dirname,
  "../database/seeds"
);

async function runSeeds() {

  try {

    await runSqlFiles({

      pool,

      folderPath: seedsPath,

      scriptType: "seed",

      actionName: "seed",

    });

    console.log("\n🎉 All seeds completed.");

    process.exit(0);

  } catch (error) {

    console.error("\n❌ Seed failed:");

    console.error(error);

    process.exit(1);

  }

}

runSeeds();