import { afterEach, describe, expect, it, vi } from "vitest";
import { deriveCurrentAge } from "../deriveCurrentAge";

describe("deriveCurrentAge", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns age as year difference from today", () => {
    vi.setSystemTime(new Date(2025, 2, 8)); // Mar 8, 2025 (local)
    expect(deriveCurrentAge(new Date(2015, 2, 8))).toBe(10);
  });

  it("returns 0 when birth year equals current year", () => {
    vi.setSystemTime(new Date(2025, 5, 15)); // Jun 15, 2025 (local)
    expect(deriveCurrentAge(new Date(2025, 0, 1))).toBe(0);
  });

  it("accepts date-like input (converted via Date constructor)", () => {
    vi.setSystemTime(new Date(2025, 2, 8));
    expect(deriveCurrentAge(new Date(2000, 0, 1))).toBe(25);
  });

  it("uses year difference only (ignores month and day)", () => {
    vi.setSystemTime(new Date(2025, 0, 1)); // Jan 1, 2025
    // Born Dec 31, 2024 — not yet 1 year old by calendar, but year diff is 1
    expect(deriveCurrentAge(new Date(2024, 11, 31))).toBe(1);
  });
});
