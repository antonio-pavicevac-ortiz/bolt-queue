import pg from "pg";
import { enqueue } from "../src/queue.js";

const pool = new pg.Pool({ database: "bolt_dev" });

const job = await enqueue(pool, "emails", { to: "sam@example.com" });
console.log(job);

const sneaky = await enqueue(pool, "x'); DROP TABLE bolt.jobs; --", { evil: true });
console.log(sneaky);

try {
  await enqueue(pool, "   ", { oops: true });
} catch (err) {
  console.log("Caught:", (err as Error).message);
}

const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
const later = await enqueue(pool, "emails", { to: "kim@example.com" }, { runAt: tomorrow });
console.log("Runs at:", later.run_at);

await pool.end();
