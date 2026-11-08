import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1).optional(),
  AUTH_SECRET: z.string().min(1).optional().default('production-fallback-auth-secret-codequest-secure'),
  CRON_SECRET: z.string().optional(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
  console.warn("⚠️ Warning: Environment variables validation issues:", envParse.error.flatten().fieldErrors);
}

export const env = (envParse.success ? envParse.data : {}) as z.infer<typeof envSchema>;
