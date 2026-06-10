import { describe, it, expect } from "vitest";
import { isReservedSlug, validateCustomSlug, generateUniqueSlug } from "@/lib/slug";

describe("isReservedSlug", () => {
  it("flags reserved slugs", () => {
    expect(isReservedSlug("api")).toBe(true);
    expect(isReservedSlug("dashboard")).toBe(true);
    expect(isReservedSlug("admin")).toBe(true);
  });

  it("allows non-reserved slugs", () => {
    expect(isReservedSlug("my-link")).toBe(false);
    expect(isReservedSlug("abc123")).toBe(false);
  });

  it("is case-insensitive", () => {
    expect(isReservedSlug("API")).toBe(true);
    expect(isReservedSlug("Dashboard")).toBe(true);
  });
});

describe("validateCustomSlug", () => {
  it("returns null for valid slugs", () => {
    expect(validateCustomSlug("my-link")).toBeNull();
    expect(validateCustomSlug("abc123")).toBeNull();
  });

  it("rejects short slugs", () => {
    expect(validateCustomSlug("ab")).not.toBeNull();
  });

  it("rejects long slugs", () => {
    expect(validateCustomSlug("a".repeat(31))).not.toBeNull();
  });

  it("rejects uppercase", () => {
    expect(validateCustomSlug("MyLink")).not.toBeNull();
  });

  it("rejects reserved slugs", () => {
    expect(validateCustomSlug("api")).not.toBeNull();
  });
});

describe("generateUniqueSlug", () => {
  it("generates a 6-character slug", async () => {
    const slug = await generateUniqueSlug(async () => false);
    expect(slug).toHaveLength(6);
    expect(slug).toMatch(/^[a-zA-Z0-9]+$/);
  });

  it("retries on collision", async () => {
    let callCount = 0;
    const slug = await generateUniqueSlug(async () => {
      callCount++;
      return callCount < 3;
    });
    expect(slug).toHaveLength(6);
    expect(callCount).toBe(3);
  });

  it("throws after max retries", async () => {
    await expect(
      generateUniqueSlug(async () => true, 3)
    ).rejects.toThrow("Failed to generate unique slug");
  });
});
