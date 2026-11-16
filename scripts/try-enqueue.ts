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

await pool.end();
