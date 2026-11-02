import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { checkRateLimit, rateLimit, resetRateLimitStore } from '@/lib/rate-limit';
import { Ratelimit } from '@upstash/ratelimit';

let mockRedisInstance: { evalsha: unknown; get: unknown; set: unknown } | null = {
  evalsha: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
};

vi.mock('@/lib/redis', () => ({
  get redis() {
    return mockRedisInstance;
  },
}));

vi.mock('@upstash/ratelimit', () => {
  const MockRatelimit = vi.fn().mockImplementation(function () {
    return {
      limit: vi.fn(),
    };
  });
  (MockRatelimit as unknown as { slidingWindow: unknown }).slidingWindow = vi.fn().mockReturnValue('mock-algorithm');
  return {
    Ratelimit: MockRatelimit,
  };
});

describe('rate-limit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    resetRateLimitStore();
    vi.clearAllMocks();
    mockRedisInstance = {
      evalsha: vi.fn(),
      get: vi.fn(),
      set: vi.fn(),
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('checkRateLimit with in-memory fallback (when redis throws)', () => {
    beforeEach(() => {
      (Ratelimit as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
        return {
          limit: vi.fn().mockRejectedValue(new Error('Redis connection failed')),
        };
      });
    });

    it('allows requests within limit', async () => {
      const id = 'test-user-within-limit';
      const limit = 3;
      const windowMs = 1000;

      const first = await checkRateLimit(id, limit, windowMs);
      expect(first.success).toBe(true);
      expect(first.remaining).toBe(2);
      expect(first.limit).toBe(3);

      const second = await checkRateLimit(id, limit, windowMs);
      expect(second.success).toBe(true);
      expect(second.remaining).toBe(1);

      const third = await checkRateLimit(id, limit, windowMs);
      expect(third.success).toBe(true);
      expect(third.remaining).toBe(0);
    });

    it('blocks requests once threshold is exceeded', async () => {
      const id = 'test-user-exceeded';
      const limit = 2;
      const windowMs = 1000;

      await checkRateLimit(id, limit, windowMs);
      await checkRateLimit(id, limit, windowMs);

      const blocked = await checkRateLimit(id, limit, windowMs);
      expect(blocked.success).toBe(false);
      expect(blocked.remaining).toBe(0);
      expect(blocked.limit).toBe(2);
    });

    it('resets after window expires', async () => {
      const id = 'test-user-reset';
      const limit = 2;
      const windowMs = 1000;

      await checkRateLimit(id, limit, windowMs);
      await checkRateLimit(id, limit, windowMs);

      const blocked = await checkRateLimit(id, limit, windowMs);
      expect(blocked.success).toBe(false);

      vi.advanceTimersByTime(1001);

      const afterExpiry = await checkRateLimit(id, limit, windowMs);
      expect(afterExpiry.success).toBe(true);
      expect(afterExpiry.remaining).toBe(1);
    });

    it('slides window as older timestamps age out', async () => {
      const id = 'test-user-sliding-window';
      const limit = 2;
      const windowMs = 1000;

      // First hit at t = 0
      const res1 = await checkRateLimit(id, limit, windowMs);
      expect(res1.success).toBe(true);

      // Advance by 600ms
      vi.advanceTimersByTime(600);
      // Second hit at t = 600
      const res2 = await checkRateLimit(id, limit, windowMs);
      expect(res2.success).toBe(true);

      // Advance by 200ms -> t = 800ms
      vi.advanceTimersByTime(200);
      const res3 = await checkRateLimit(id, limit, windowMs);
      expect(res3.success).toBe(false);

      // Advance by 250ms -> t = 1050ms (first request expired at 1000ms, second expires at 1600ms)
      vi.advanceTimersByTime(250);
      const res4 = await checkRateLimit(id, limit, windowMs);
      expect(res4.success).toBe(true);
    });
  });

  describe('checkRateLimit when redis is null', () => {
    beforeEach(() => {
      mockRedisInstance = null;
    });

    it('operates directly in-memory', async () => {
      const id = 'null-redis-user';
      const limit = 1;
      const windowMs = 500;

      const first = await checkRateLimit(id, limit, windowMs);
      expect(first.success).toBe(true);

      const second = await checkRateLimit(id, limit, windowMs);
      expect(second.success).toBe(false);

      vi.advanceTimersByTime(501);
      const third = await checkRateLimit(id, limit, windowMs);
      expect(third.success).toBe(true);
    });
  });

  describe('rateLimit backwards-compatible wrapper', () => {
    beforeEach(() => {
      mockRedisInstance = null;
    });

    it('returns boolean indicating whether request is within limit', async () => {
      const key = 'legacy-key';
      const limit = 2;
      const windowMs = 1000;

      expect(await rateLimit(key, limit, windowMs)).toBe(true);
      expect(await rateLimit(key, limit, windowMs)).toBe(true);
      expect(await rateLimit(key, limit, windowMs)).toBe(false);

      vi.advanceTimersByTime(1001);
      expect(await rateLimit(key, limit, windowMs)).toBe(true);
    });
  });

  describe('checkRateLimit with working Upstash Redis', () => {
    it('uses Ratelimit when Redis succeeds', async () => {
      const mockLimitFn = vi.fn().mockResolvedValue({
        success: true,
        limit: 5,
        remaining: 4,
        reset: 1767225660000,
        pending: Promise.resolve(),
      });

      (Ratelimit as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
        return {
          limit: mockLimitFn,
        };
      });

      const result = await checkRateLimit('redis-user', 5, 60000);
      expect(mockLimitFn).toHaveBeenCalledWith('redis-user');
      expect(result).toEqual({
        success: true,
        limit: 5,
        remaining: 4,
        reset: 1767225660000,
      });
    });
  });
});
