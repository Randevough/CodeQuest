import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/health/route';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}));

vi.mock('@/lib/redis', () => ({
  redis: {
    ping: vi.fn(),
  },
}));

describe('GET /api/health', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (redis) {
      vi.mocked(redis.ping).mockResolvedValue('PONG' as never);
    }
  });

  it('returns HTTP 200 with ok status and database up when healthy', async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([{ '?column?': 1 }] as never);
    if (redis) {
      vi.mocked(redis.ping).mockResolvedValueOnce('PONG' as never);
    }

    const response = await GET();
    const body = (await response.json()) as {
      status: string;
      timestamp: string;
      uptime: number;
      services: {
        database: { status: string; latencyMs: number };
        redis: { status: string };
      };
      memory: { rss: string; heapUsed: string };
    };

    expect(response.status).toBe(200);
    expect(body.status).toBe('ok');
    expect(body.services.database.status).toBe('up');
    expect(typeof body.services.database.latencyMs).toBe('number');
    expect(body.services.redis.status).toBe('up');
    expect(typeof body.uptime).toBe('number');
    expect(body.memory.rss).toMatch(/^\d+MB$/);
    expect(body.memory.heapUsed).toMatch(/^\d+MB$/);
  });

  it('returns HTTP 503 with error status and database down when prisma fails', async () => {
    vi.mocked(prisma.$queryRaw).mockRejectedValueOnce(new Error('Connection failure'));

    const response = await GET();
    const body = (await response.json()) as {
      status: string;
      timestamp: string;
      services: {
        database: { status: string; error: string };
      };
    };

    expect(response.status).toBe(503);
    expect(body.status).toBe('error');
    expect(body.services.database.status).toBe('down');
    expect(body.services.database.error).toBe('Connection failure');
  });
});
