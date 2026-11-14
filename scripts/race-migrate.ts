import pg from "pg";
import { migrate } from "../src/schema.js";

const pool = new pg.Pool({ database: "bolt_test", max: 10 });

// Start from an empty database every run
await pool.query("DROP SCHEMA IF EXISTS bolt CASCADE");

// Start 10 migrations at the same moment
const results = await Promise.allSettled(Array.from({ length: 10 }, () => migrate(pool)));

const failures = results.filter((r) => r.status === "rejected");
console.log(`${10 - failures.length} succeeded, ${failures.length} failed`);
for (const f of failures) {
  console.log("  ", (f as PromiseRejectedResult).reason.message);
}

await pool.end();
