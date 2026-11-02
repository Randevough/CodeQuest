import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err: unknown) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        services: {
          database: {
            status: 'down',
            error: err instanceof Error ? err.message : 'Unknown error',
          },
        },
      },
      { status: 503 }
    );
  }

  const duration = Date.now() - startTime;

  let redisStatus = 'unconfigured';
  if (redis) {
    try {
      await redis.ping();
      redisStatus = 'up';
    } catch {
      redisStatus = 'down';
    }
  }

  const mem = process.memoryUsage();

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: {
        status: 'up',
        latencyMs: duration,
      },
      redis: {
        status: redisStatus,
      },
    },
    memory: {
      rss: `${Math.round(mem.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)}MB`,
    },
  });
}
