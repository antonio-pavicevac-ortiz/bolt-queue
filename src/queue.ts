import type { Pool } from "pg";

export async function enqueue(pool: Pool, queue: string, payload: object) {
  if (typeof queue !== "string" || queue.trim() === "") {
    throw new Error("enqueue(): queue name must be a non-empty string");
  }

  const result = await pool.query(
    "INSERT INTO bolt.jobs (queue, payload) VALUES ($1, $2) RETURNING *",
    [queue, payload]
  );
  return result.rows[0];
}
