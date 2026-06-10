import { customAlphabet } from "nanoid";

const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const generateId = customAlphabet(ALPHABET, 6);

const RESERVED_SLUGS = [
  "api",
  "admin",
  "dashboard",
  "docs",
  "auth",
  "s",
  "login",
  "signup",
  "health",
];

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug.toLowerCase());
}

export async function generateUniqueSlug(
  checkExists: (slug: string) => Promise<boolean>,
  maxRetries = 3
): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    const slug = generateId();
    if (!isReservedSlug(slug) && !(await checkExists(slug))) {
      return slug;
    }
  }
  throw new Error("Failed to generate unique slug after retries");
}

const CUSTOM_SLUG_REGEX = /^[a-z0-9-]+$/;

export function validateCustomSlug(slug: string): string | null {
  if (slug.length < 3 || slug.length > 30) {
    return "Custom slug must be 3-30 characters";
  }
  if (!CUSTOM_SLUG_REGEX.test(slug)) {
    return "Only lowercase letters, numbers, and hyphens allowed";
  }
  if (isReservedSlug(slug)) {
    return "This slug is reserved";
  }
  return null;
}
