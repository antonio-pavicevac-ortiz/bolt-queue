import assert from "node:assert/strict";
import { test } from "node:test";
import pg from "pg";
import { enqueue } from "../src/queue.js";
import { migrate } from "../src/schema.js";

const pool = new pg.Pool({ database: "bolt_test" });
await migrate(pool);

test("enqueue() adds a pending job", async () => {
  const job = await enqueue(pool, "emails", { to: "sam@example.com" });

  assert.equal(job.queue, "emails");
  assert.equal(job.status, "pending");
});

test.after(() => pool.end());
