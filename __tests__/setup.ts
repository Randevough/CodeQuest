import { beforeAll, beforeEach, afterAll, vi } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

vi.mock('next/server', () => ({
  NextResponse: { json: vi.fn() },
  NextRequest: vi.fn(),
}))

vi.mock('next-auth', () => ({
    AuthError: class AuthError extends Error {
        type?: string;
        constructor(message?: string) {
            super(message);
        }
    },
    default: function () {
        return {
            handlers: {},
            auth: vi.fn(),
            signIn: vi.fn(),
            signOut: vi.fn()
        }
    }
}))

// We will use a separate Prisma client for tests pointing to the test DB
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TEST
    }
  }
})

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
  await prisma.$disconnect()
})

export { prisma as testPrisma }
