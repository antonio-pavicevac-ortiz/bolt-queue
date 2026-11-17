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

test("enqueue() can schedule a job for later", async () => {
  const runAt = new Date(Date.now() + 60 * 60 * 1000);
  const job = await enqueue(pool, "emails", { to: "sam@example.com" }, { runAt });

  assert.equal(job.run_at.getTime(), runAt.getTime());
});

test("enqueue() saves the priority", async () => {
  const job = await enqueue(pool, "emails", { to: "sam@example.com" }, { priority: 5 });

  assert.equal(job.priority, 5);
});

test("enqueue() saves maxAttempts", async () => {
  const job = await enqueue(pool, "emails", { to: "sam@example.com" }, { maxAttempts: 3 });

  assert.equal(job.max_attempts, 3);
});

test.after(() => pool.end());
