import { Ratelimit, type Duration } from '@upstash/ratelimit';
import { redis } from '@/lib/redis';

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

const memoryStore = new Map<string, number[]>();
const redisLimiters = new Map<string, Ratelimit>();

export function resetRateLimitStore(): void {
  memoryStore.clear();
  redisLimiters.clear();
}

function checkMemoryRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;
  const timestamps = (memoryStore.get(identifier) ?? []).filter((timestamp) => timestamp > windowStart);

  if (timestamps.length >= limit) {
    const reset = (timestamps[0] ?? now) + windowMs;
    memoryStore.set(identifier, timestamps);
    return {
      success: false,
      limit,
      remaining: 0,
      reset,
    };
  }

  timestamps.push(now);
  memoryStore.set(identifier, timestamps);

  return {
    success: true,
    limit,
    remaining: Math.max(0, limit - timestamps.length),
    reset: (timestamps[0] ?? now) + windowMs,
  };
}

function getRedisLimiter(limit: number, windowMs: number): Ratelimit {
  const cacheKey = `${limit}:${windowMs}`;
  let limiter = redisLimiters.get(cacheKey);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms` as Duration),
    });
    redisLimiters.set(cacheKey, limiter);
  }
  return limiter;
}

export async function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): Promise<RateLimitResult> {
  if (redis) {
    try {
      const limiter = getRedisLimiter(limit, windowMs);
      const res = await limiter.limit(identifier);
      return {
        success: res.success,
        limit: res.limit,
        remaining: res.remaining,
        reset: res.reset,
      };
    } catch {
      return checkMemoryRateLimit(identifier, limit, windowMs);
    }
  }

  return checkMemoryRateLimit(identifier, limit, windowMs);
}

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<boolean> {
  const result = await checkRateLimit(key, limit, windowMs);
  return result.success;
}
