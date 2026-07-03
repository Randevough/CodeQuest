import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function rateLimit(key: string, limit: number = 5, windowMs: number = 60000): Promise<boolean> {
    const windowSeconds = Math.max(1, Math.floor(windowMs / 1000));
    const ratelimit = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
        analytics: true,
    });

    const { success } = await ratelimit.limit(key);
    return success;
}
