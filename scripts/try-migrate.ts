import pg from "pg";
import { migrate } from "../src/schema.js";

const pool = new pg.Pool({
  database: "bolt_test",
});

await migrate(pool);
console.log("migrate() completed successfully.");

await pool.end();
