import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function createRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token || url.includes('dummy') || token.includes('dummy')) {
    console.warn('⚠️ Upstash Redis not configured — rate limiting disabled');
    return null;
  }

  return new Redis({ url, token });
}

const redis = createRedisClient();

export async function rateLimit(key: string, limit: number = 5, windowMs: number = 60000): Promise<boolean> {
    if (!redis) return true; // fail open when Redis unavailable

    try {
        const windowSeconds = Math.max(1, Math.floor(windowMs / 1000));
        const ratelimit = new Ratelimit({
            redis: redis,
            limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
            analytics: true,
        });

        const { success } = await ratelimit.limit(key);
        return success;
    } catch (error) {
        console.error('Rate limit check failed, allowing request:', error);
        return true; // fail open — never block auth due to Redis errors
    }
}
