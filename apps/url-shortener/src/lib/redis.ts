import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  redis = new Redis({ url, token });
  return redis;
}

interface CachedUrl {
  url: string;
  expiresAt: string | null;
}

export async function getCachedUrl(
  slug: string
): Promise<CachedUrl | null> {
  const client = getRedis();
  if (!client) return null;

  try {
    const data = await client.get<CachedUrl>(`short:${slug}`);
    return data;
  } catch {
    return null;
  }
}

export async function setCachedUrl(
  slug: string,
  url: string,
  expiresAt: string | null
): Promise<void> {
  const client = getRedis();
  if (!client) return;

  try {
    await client.set(
      `short:${slug}`,
      { url, expiresAt } satisfies CachedUrl,
      { ex: 3600 }
    );
  } catch {
    // Graceful fail
  }
}

export async function deleteCachedUrl(slug: string): Promise<void> {
  const client = getRedis();
  if (!client) return;

  try {
    await client.del(`short:${slug}`);
  } catch {
    // Graceful fail
  }
}
