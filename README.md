# bolt-queue

A background job queue for Node.js, built on Postgres.

> 🚧 Early work in progress. Not ready for use yet.

## Why

If your app already uses Postgres, you can run background jobs
(emails, image resizing, reports) without adding Redis or another service.

## Status

- [x] Milestone 1: `bolt.jobs` table, `migrate()`, schema versioning
- [x] Milestone 2: `enqueue()` with `runAt`, `priority`, `maxAttempts`, and transactional `client`
- [ ] Workers (`queue.work`)
- [ ] Retries
- [ ] Events (LISTEN/NOTIFY)

## Requirements

- Node.js
- PostgreSQL
