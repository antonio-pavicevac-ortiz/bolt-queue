import type { Pool } from "pg";

const SCHEMA_SQL = `
  CREATE SCHEMA IF NOT EXISTS bolt;

  CREATE TABLE IF NOT EXISTS bolt.jobs (
    id           bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    queue        text        NOT NULL,
    payload      jsonb       NOT NULL DEFAULT '{}',
    status       text        NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    priority     integer     NOT NULL DEFAULT 0,
    run_at       timestamptz NOT NULL DEFAULT now(),
    attempts     integer     NOT NULL DEFAULT 0,
    max_attempts integer     NOT NULL DEFAULT 5,
    last_error   text,
    locked_at    timestamptz,
    locked_by    text,
    created_at   timestamptz NOT NULL DEFAULT now()
  );

  CREATE INDEX IF NOT EXISTS jobs_pending_idx
    ON bolt.jobs (queue, priority, run_at)
    WHERE status = 'pending';
`;

export async function migrate(pool: Pool): Promise<void> {
  await pool.query(SCHEMA_SQL);
}
