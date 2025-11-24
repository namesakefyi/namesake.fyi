import { describe, expect, it } from "vitest";
import { formatTimeEstimate } from "../formatTimeEstimate";

describe("formatTimeEstimate", () => {
  it("formats time estimate range with default values", () => {
    expect(formatTimeEstimate(5)).toBe("1–5 minutes"); // 5*0.2=1 to 5*1=5
    expect(formatTimeEstimate(3)).toBe("1–3 minutes"); // 3*0.2=0.6→1 to 3*1=3
  });

  it("formats time estimate for a single step", () => {
    expect(formatTimeEstimate(1)).toBe("1 minute"); // 1*0.2=0.2→1, 1*1=1, same so single value
  });

  it("shows single value when min equals max", () => {
    expect(formatTimeEstimate(5, 2, 2)).toBe("10 minutes");
    expect(formatTimeEstimate(1, 1, 1)).toBe("1 minute");
    expect(formatTimeEstimate(3, 1.5, 1.5)).toBe("5 minutes"); // 3 * 1.5 = 4.5, rounds up to 5
  });

  it("uses singular 'minute' for exactly one minute when min equals max", () => {
    expect(formatTimeEstimate(1, 0.5, 0.5)).toBe("1 minute");
    expect(formatTimeEstimate(2, 0.4, 0.4)).toBe("1 minute"); // 2 * 0.4 = 0.8, rounds up to 1
  });

  it("rounds up fractional minutes for both min and max", () => {
    expect(formatTimeEstimate(3, 1.1, 2.1)).toBe("4–7 minutes"); // 3*1.1=3.3→4, 3*2.1=6.3→7
    expect(formatTimeEstimate(5, 0.5, 1.5)).toBe("3–8 minutes"); // 5*0.5=2.5→3, 5*1.5=7.5→8
  });

  it("accepts custom min and max minutes per step", () => {
    expect(formatTimeEstimate(5, 1, 3)).toBe("5–15 minutes");
    expect(formatTimeEstimate(10, 0.5, 1)).toBe("5–10 minutes");
    expect(formatTimeEstimate(4, 2, 4)).toBe("8–16 minutes");
  });

  it("handles zero steps", () => {
    expect(formatTimeEstimate(0)).toBe("0 minutes"); // 0*0.2=0, 0*1=0, same so single value
  });

  it("handles large numbers of steps", () => {
    expect(formatTimeEstimate(20)).toBe("4–20 minutes"); // 20*0.2=4, 20*1=20
    expect(formatTimeEstimate(50, 1, 2)).toBe("50–100 minutes");
  });

  it("handles cases where rounding makes min equal max", () => {
    // Edge case: if both round to the same value, show single value
    expect(formatTimeEstimate(1, 1.4, 1.5)).toBe("2 minutes"); // 1.4→2, 1.5→2
  });

  it("uses en dash (not hyphen) in range", () => {
    const result = formatTimeEstimate(5, 1, 2);
    expect(result).toContain("–"); // en dash
    expect(result).not.toContain("-"); // hyphen (at least not in the range part)
  });
});
