# CodeQuest Production Release Checklist

## 1. Pre-Deployment Verifications
- [ ] Working tree clean and milestone commits recorded on integration branch.
- [ ] Automated quality gates pass:
  ```bash
  npm run type-check
  npm run lint
  npm run test
  npm run build
  ```
- [ ] Database migrations tested against disposable PostgreSQL instance:
  ```bash
  npx prisma migrate status
  ```
- [ ] No hardcoded secrets, test credentials, or internal URLs in git history.
- [ ] Health check endpoint verified:
  ```bash
  curl -i http://localhost:3000/api/health
  # Response: HTTP 200 {"status":"healthy", ...}
  ```

## 2. Infrastructure & Environment Readiness
- [ ] Primary database provisioned (PostgreSQL 15+).
- [ ] Connection pooler (PgBouncer/Supabase/Neon) active for serverless/Next.js runtime (`DATABASE_URL`).
- [ ] Direct session-mode connection configured for schema migrations (`DIRECT_URL`).
- [ ] Distributed key-value cache configured (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`).
- [ ] Authentication secret generated (`AUTH_SECRET` minimum 32 chars).
- [ ] Static asset storage configured (`BLOB_READ_WRITE_TOKEN`).

## 3. Deployment Execution Steps
1. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```
2. Build production artifact:
   ```bash
   npm run build
   ```
3. Start production server:
   ```bash
   npm run start
   ```
4. Verify `/api/health` returns `200 OK`.

## 4. Rollback Plan
- If migration fails before data mutation: Revert to previous release tag and restart.
- If runtime error occurs after migration: Rollback application container/bundle to previous SHA; schema additions are non-destructive and backward compatible.
- Rollback execution documented in `docs/DEPLOYMENT_GUIDE.md`.
