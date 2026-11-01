# CodeQuest Deployment & Operations Guide

## 1. System Overview
CodeQuest is a Next.js (App Router) full-stack web application with PostgreSQL (Prisma ORM), NextAuth (Auth.js v5), and Upstash Redis for rate limiting and cache management.

## 2. Environment Variables Specification
| Variable | Required | Description | Example / Format |
|---|---|---|---|
| `DATABASE_URL` | Yes | Pooled connection string for queries | `postgresql://user:pass@pooler.region.postgres:6543/db?pgbouncer=true` |
| `DIRECT_URL` | Yes | Direct connection string for Prisma migrations | `postgresql://user:pass@host.region.postgres:5432/db` |
| `AUTH_SECRET` | Yes | Secret used to hash and encrypt NextAuth session tokens | 32+ random characters (`openssl rand -base64 32`) |
| `UPSTASH_REDIS_REST_URL` | Yes | REST endpoint for Upstash Redis | `https://xxxx.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | Bearer token for Upstash Redis | `AXXX...` |
| `BLOB_READ_WRITE_TOKEN` | Optional | Vercel Blob token for profile avatar uploads | `vercel_blob_rw_...` |
| `EMAIL_MODE` | Optional | Email service mode for verification links | `mock` / `smtp` |

## 3. Database Migration Protocol
1. **Zero-downtime guidelines**:
   - Column additions must be nullable or have database-level defaults.
   - Never rename or drop columns without a multi-phase migration.
2. **Execute migrations**:
   ```bash
   npx prisma migrate deploy
   ```
3. **Verify status**:
   ```bash
   npx prisma migrate status
   ```

## 4. Health Checks & Monitoring
- **Endpoint**: `GET /api/health`
- **Response Format**:
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-11-02T00:15:00.000Z",
    "uptimeSeconds": 1234,
    "checks": {
      "database": {
        "status": "connected",
        "latencyMs": 14
      },
      "environment": "production"
    },
    "durationMs": 15
  }
  ```
- Configure uptime monitors (e.g., BetterStack, UptimeRobot) to probe `/api/health` every 60 seconds and trigger alerts on status code != 200.

## 5. Rollback Strategy
In the event of an unrecoverable runtime regression:
1. Re-deploy the previously verified container/build artifact.
2. Database schema migrations maintain backward compatibility with N-1 release.
3. In case of unexpected database corruption, restore from point-in-time recovery (PITR) snapshot.
