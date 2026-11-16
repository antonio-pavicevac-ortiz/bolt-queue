import type { Pool } from "pg";

export async function enqueue(
  pool: Pool,
  queue: string,
  payload: object,
  options: { runAt?: Date } = {}
) {
  if (typeof queue !== "string" || queue.trim() === "") {
    throw new Error("enqueue(): queue name must be a non-empty string");
  }

  const result = await pool.query(
    `INSERT INTO bolt.jobs (queue, payload, run_at)
     VALUES ($1, $2, COALESCE($3, now()))
     RETURNING *`,
    [queue, payload, options.runAt ?? null]
  );
  return result.rows[0];
}
