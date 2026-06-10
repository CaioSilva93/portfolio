import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function getRedis(): Redis | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

let generateLimiter: Ratelimit | null = null;

export function getGenerateRateLimit(): Ratelimit | null {
  if (generateLimiter) return generateLimiter;
  const redis = getRedis();
  if (!redis) return null;
  generateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 h"),
    prefix: "ratelimit:ai:generate",
  });
  return generateLimiter;
}
