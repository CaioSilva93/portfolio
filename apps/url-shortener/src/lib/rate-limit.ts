import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let shortenLimiter: Ratelimit | null = null;
let apiLimiter: Ratelimit | null = null;

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function getShortenRateLimit(): Ratelimit | null {
  if (shortenLimiter) return shortenLimiter;
  const redis = getRedis();
  if (!redis) return null;
  shortenLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 h"),
    prefix: "ratelimit:shorten",
  });
  return shortenLimiter;
}

export function getApiRateLimit(): Ratelimit | null {
  if (apiLimiter) return apiLimiter;
  const redis = getRedis();
  if (!redis) return null;
  apiLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 h"),
    prefix: "ratelimit:api",
  });
  return apiLimiter;
}
