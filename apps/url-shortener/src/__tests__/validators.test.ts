import { describe, it, expect } from "vitest";
import { shortenUrlSchema } from "@/lib/validators";

describe("shortenUrlSchema", () => {
  it("accepts valid HTTPS URLs", () => {
    const result = shortenUrlSchema.safeParse({ url: "https://example.com" });
    expect(result.success).toBe(true);
  });

  it("accepts valid HTTP URLs", () => {
    const result = shortenUrlSchema.safeParse({ url: "http://example.com" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid URLs", () => {
    const result = shortenUrlSchema.safeParse({ url: "not-a-url" });
    expect(result.success).toBe(false);
  });

  it("rejects javascript: protocol", () => {
    const result = shortenUrlSchema.safeParse({ url: "javascript:alert(1)" });
    expect(result.success).toBe(false);
  });

  it("rejects data: protocol", () => {
    const result = shortenUrlSchema.safeParse({ url: "data:text/html,<h1>hi</h1>" });
    expect(result.success).toBe(false);
  });

  it("rejects URLs over 2048 characters", () => {
    const longUrl = "https://example.com/" + "a".repeat(2030);
    const result = shortenUrlSchema.safeParse({ url: longUrl });
    expect(result.success).toBe(false);
  });

  it("accepts optional custom slug", () => {
    const result = shortenUrlSchema.safeParse({
      url: "https://example.com",
      customSlug: "my-link",
    });
    expect(result.success).toBe(true);
  });

  it("rejects custom slugs with uppercase", () => {
    const result = shortenUrlSchema.safeParse({
      url: "https://example.com",
      customSlug: "MyLink",
    });
    expect(result.success).toBe(false);
  });

  it("rejects custom slugs shorter than 3 chars", () => {
    const result = shortenUrlSchema.safeParse({
      url: "https://example.com",
      customSlug: "ab",
    });
    expect(result.success).toBe(false);
  });
});
