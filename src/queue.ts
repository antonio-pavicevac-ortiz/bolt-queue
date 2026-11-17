import type { Pool, PoolClient } from "pg";

export async function enqueue(
  pool: Pool,
  queue: string,
  payload: object,
  options: { runAt?: Date; priority?: number; maxAttempts?: number; client?: PoolClient } = {}
) {
  if (typeof queue !== "string" || queue.trim() === "") {
    throw new Error("enqueue(): queue name must be a non-empty string");
  }
  const db = options.client ?? pool;
  const result = await db.query(
    `INSERT INTO bolt.jobs (queue, payload, run_at, priority, max_attempts)
     VALUES ($1, $2, COALESCE($3, now()), COALESCE($4, 0), COALESCE($5, 5))
     RETURNING *`,
    [queue, payload, options.runAt ?? null, options.priority ?? null, options.maxAttempts ?? null]
  );
  return result.rows[0];
}
