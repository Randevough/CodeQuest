const rateLimitStore = new Map<string, { count: number, resetTime: number }>();

export async function rateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (record) {
        if (now > record.resetTime) {
            rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
            return true;
        }

        if (record.count >= limit) {
            return false;
        }

        record.count++;
        return true;
    }

    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
}
