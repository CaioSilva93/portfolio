import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = Redis.fromEnv();
}

export { redis };

export async function getPlanCache(workspaceId: string): Promise<string | null> {
  if (!redis) return null;
  try {
    return await redis.get<string>(`saas:plan:${workspaceId}`);
  } catch {
    return null;
  }
}

export async function setPlanCache(workspaceId: string, plan: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(`saas:plan:${workspaceId}`, plan, { ex: 3600 });
  } catch {}
}

export async function invalidatePlanCache(workspaceId: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(`saas:plan:${workspaceId}`);
  } catch {}
}
