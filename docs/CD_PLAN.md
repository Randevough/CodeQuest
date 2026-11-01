# Continuous Delivery & Deployment Plan (CodeQuest)

## 1. Environments & Promotion Pipeline
- **Local Development**: Node 20+, SQLite/mock or local PostgreSQL via docker-compose.
- **Preview / Staging**: Deployed automatically upon PR approval. Isolated staging PostgreSQL and Upstash Redis.
- **Production**: Deployed upon merge into `master`/`main` with gated manual approval.

## 2. Secrets & Configuration Management
- Secrets must never be committed to Git.
- Required production environment variables:
  - `DATABASE_URL` / `DIRECT_URL`: Managed PostgreSQL connection string (Supabase/Neon/AWS RDS).
  - `AUTH_SECRET`: Random 32+ byte string generated via `openssl rand -base64 32`.
  - `AUTH_URL`: Canonical site URL (e.g. `https://codequest.dev`).
  - `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN`: Upstash rate limiting credentials.
  - `ADMIN_INVITE_SECRET`: For initial admin bootstrapping.

## 3. Database Migration Strategy
- Use Prisma additive migrations (`npx prisma migrate deploy`).
- Destructive schema alterations (dropping columns/tables) must follow expand-and-contract:
  1. Add new columns / models nullable.
  2. Deploy application code supporting both schema versions.
  3. Backfill data.
  4. Deploy application code relying solely on new schema.
  5. Remove deprecated columns in a separate migration.

## 4. Rollback Runbook
- Application rollback: Revert commit or redeploy prior immutable container image / Vercel deployment.
- Database rollback: If a migration must be reverted, apply a forward corrective migration (`prisma migrate resolve` / new corrective migration) rather than running downward commands against live production data.
