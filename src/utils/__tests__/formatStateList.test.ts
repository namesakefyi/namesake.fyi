import { describe, expect, it } from "vitest";
import { formatStateList } from "../formatStateList";

describe("formatStateList", () => {
  it("should return empty string for empty array", () => {
    expect(formatStateList([])).toBe("");
  });

  it("should format a single state name with strong tags", () => {
    expect(formatStateList(["California"])).toBe("<strong>California</strong>");
    expect(formatStateList(["Texas"])).toBe("<strong>Texas</strong>");
  });

  it("should format two state names with 'and' conjunction", () => {
    expect(formatStateList(["California", "Texas"])).toBe(
      "<strong>California</strong> and <strong>Texas</strong>",
    );
    expect(formatStateList(["New York", "Florida"])).toBe(
      "<strong>New York</strong> and <strong>Florida</strong>",
    );
  });

  it("should format three state names with commas and 'and'", () => {
    expect(formatStateList(["California", "Texas", "Florida"])).toBe(
      "<strong>California</strong>, <strong>Texas</strong>, and <strong>Florida</strong>",
    );
  });

  it("should format four or more state names with commas and 'and'", () => {
    expect(
      formatStateList(["California", "Texas", "Florida", "New York"]),
    ).toBe(
      "<strong>California</strong>, <strong>Texas</strong>, <strong>Florida</strong>, and <strong>New York</strong>",
    );
  });

  it("should handle state names with multiple words", () => {
    expect(formatStateList(["New York", "New Jersey"])).toBe(
      "<strong>New York</strong> and <strong>New Jersey</strong>",
    );
    expect(formatStateList(["New York", "New Jersey", "New Mexico"])).toBe(
      "<strong>New York</strong>, <strong>New Jersey</strong>, and <strong>New Mexico</strong>",
    );
  });

  it("should format long lists correctly", () => {
    const states = [
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
    ];
    expect(formatStateList(states)).toBe(
      "<strong>Alabama</strong>, <strong>Alaska</strong>, <strong>Arizona</strong>, <strong>Arkansas</strong>, <strong>California</strong>, and <strong>Colorado</strong>",
    );
  });
});
