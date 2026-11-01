import { beforeAll, beforeEach, afterAll, vi } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'

// Provide default test environment variables if unset to pass src/env.ts schema validation
process.env.DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_URL_TEST || 'postgresql://mock:mock@localhost:5432/mock'
process.env.DIRECT_URL = process.env.DIRECT_URL || process.env.DATABASE_URL_TEST || 'postgresql://mock:mock@localhost:5432/mock'
process.env.AUTH_SECRET = process.env.AUTH_SECRET || 'mock-secret-key-for-test-isolation-min-32-chars'
process.env.UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL || 'https://mock.upstash.io'
process.env.UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || 'mock-token'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

vi.mock('next/server', () => ({
  NextResponse: { json: vi.fn() },
  NextRequest: vi.fn(),
}))

vi.mock('next-auth', () => {
    class AuthError extends Error {
        type?: string;
        constructor(message?: string) {
            super(message);
        }
    }
    class CredentialsSignin extends AuthError {
        code?: string;
    }
    return {
        AuthError,
        CredentialsSignin,
        default: function () {
            return {
                handlers: {},
                auth: vi.fn(),
                signIn: vi.fn(),
                signOut: vi.fn()
            }
        }
    }
})

// We will use a separate Prisma client for tests pointing to the test DB
const mockPrismaHandler: ProxyHandler<object> = {
  get(_target, prop) {
    if (prop === '$disconnect' || prop === '$connect') {
      return () => Promise.resolve()
    }
    if (prop === '$transaction') {
      return (cb: unknown) => (typeof cb === 'function' ? cb(prisma) : Promise.resolve([]))
    }
    if (prop === '$queryRaw' || prop === '$executeRaw' || prop === '$executeRawUnsafe') {
      return () => Promise.resolve([])
    }
    return new Proxy({}, {
      get: () => () => Promise.resolve(null)
    })
  }
}

const prisma: PrismaClient = process.env.DATABASE_URL_TEST
  ? new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL_TEST
        }
      }
    })
  : (new Proxy({}, mockPrismaHandler) as unknown as PrismaClient)

// Also attach to globalThis so src/lib/db.ts reuses testPrisma
;(globalThis as unknown as { prisma: PrismaClient }).prisma = prisma

beforeAll(async () => {
  // Push the schema to the test database
  if (process.env.DATABASE_URL_TEST) {
    execSync('npx prisma db push --skip-generate', { env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL_TEST } })
  }
})

beforeEach(async () => {
  if (!process.env.DATABASE_URL_TEST) return
  
  // Truncate all tables before each test
  const tableNames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`

  const tables = tableNames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ')

  if (tables !== '') {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
  }
})

afterAll(async () => {
  if (process.env.DATABASE_URL_TEST) {
    await prisma.$disconnect()
  }
})

export { prisma as testPrisma }
