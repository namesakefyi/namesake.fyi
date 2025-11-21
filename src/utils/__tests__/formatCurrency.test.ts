import { describe, expect, it } from "vitest";
import { formatCurrency } from "../formatCurrency";

describe("formatCurrency", () => {
  it("should format basic numbers as USD currency", () => {
    expect(formatCurrency(100)).toBe("$100");
    expect(formatCurrency(50)).toBe("$50");
    expect(formatCurrency(1)).toBe("$1");
  });

  it("should format large numbers with commas", () => {
    expect(formatCurrency(1000)).toBe("$1,000");
    expect(formatCurrency(10000)).toBe("$10,000");
    expect(formatCurrency(1000000)).toBe("$1,000,000");
  });

  it("should round decimal values to the nearest dollar", () => {
    expect(formatCurrency(99.99)).toBe("$100");
    expect(formatCurrency(99.49)).toBe("$99");
    expect(formatCurrency(50.5)).toBe("$51");
    expect(formatCurrency(50.4)).toBe("$50");
  });

  it("should handle zero", () => {
    expect(formatCurrency(0)).toBe("$0");
  });
});
