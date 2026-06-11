import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = Redis.fromEnv();
}

export { redis };

async function getCacheVersion(): Promise<number> {
  if (!redis) return 0;
  try {
    const version = await redis.get<number>("shop:cache:version");
    return version ?? 0;
  } catch {
    return 0;
  }
}

export async function getCached<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  if (!redis) return fetcher();

  try {
    const version = await getCacheVersion();
    const versionedKey = `${key}:v${version}`;
    const cached = await redis.get<T>(versionedKey);
    if (cached !== null && cached !== undefined) return cached;

    const fresh = await fetcher();
    await redis.set(versionedKey, fresh, { ex: ttlSeconds });
    return fresh;
  } catch {
    return fetcher();
  }
}

export async function invalidateCache(): Promise<void> {
  if (!redis) return;
  try {
    await redis.incr("shop:cache:version");
  } catch {
    // graceful fallback
  }
}
