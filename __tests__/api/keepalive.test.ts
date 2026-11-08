import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET, dynamic } from '@/app/api/cron/keepalive/route';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({ prisma: { $queryRaw: vi.fn() } }));

const request = (authorization?: string) => new Request('https://example.com/api/cron/keepalive', {
  headers: authorization ? { Authorization: authorization } : {},
});

describe('GET /api/cron/keepalive', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv('CRON_SECRET', 'test-cron-secret');
  });

  afterEach(() => vi.unstubAllEnvs());

  it.each([
    [undefined, 'Bearer undefined'],
    ['', 'Bearer '],
    ['test-cron-secret', undefined],
    ['test-cron-secret', 'Bearer wrong-secret'],
    ['test-cron-secret', 'test-cron-secret'],
    ['test-cron-secret', 'Basic test-cron-secret'],
  ])('denies secret %s with authorization %s before querying DB', async (secret, authorization) => {
    vi.stubEnv('CRON_SECRET', secret);

    const response = await GET(request(authorization));

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'Unauthorized' });
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(prisma.$queryRaw).not.toHaveBeenCalled();
  });

  it('runs only static SELECT 1 and returns minimal uncached success', async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([{ '?column?': 1 }]);

    const response = await GET(request('Bearer test-cron-secret'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(prisma.$queryRaw).toHaveBeenCalledExactlyOnceWith(['SELECT 1']);
  });

  it('returns generic uncached 503 when DB fails without exposing details', async () => {
    vi.mocked(prisma.$queryRaw).mockRejectedValueOnce(new Error('postgresql://private:secret@db test-cron-secret'));

    const response = await GET(request('Bearer test-cron-secret'));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'Service unavailable' });
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(prisma.$queryRaw).toHaveBeenCalledExactlyOnceWith(['SELECT 1']);
  });

  it('disables route caching', () => {
    expect(dynamic).toBe('force-dynamic');
  });
});
