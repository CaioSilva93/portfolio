import { z } from "zod";

const BLOCKED_PROTOCOLS = ["javascript:", "data:", "file:", "vbscript:"];
const MAX_URL_LENGTH = 2048;

export const shortenUrlSchema = z.object({
  url: z
    .string()
    .url("Invalid URL format")
    .max(MAX_URL_LENGTH, "URL too long (max 2048 characters)")
    .refine(
      (url) => url.startsWith("http://") || url.startsWith("https://"),
      "Only HTTP and HTTPS URLs are allowed"
    )
    .refine(
      (url) =>
        !BLOCKED_PROTOCOLS.some((p) => url.toLowerCase().startsWith(p)),
      "This URL protocol is not allowed"
    )
    .refine((url) => {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
      return !appUrl || !url.startsWith(appUrl);
    }, "Cannot shorten URLs from this domain"),
  customSlug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens")
    .min(3, "Minimum 3 characters")
    .max(30, "Maximum 30 characters")
    .optional(),
});

export type ShortenUrlInput = z.infer<typeof shortenUrlSchema>;
