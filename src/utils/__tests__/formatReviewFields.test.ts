import { describe, expect, it } from "vitest";
import { formatFieldValue, getFieldLabel } from "../formatReviewFields";

describe("formatFieldValue", () => {
  describe("boolean fields", () => {
    it("formats true as 'Yes'", () => {
      expect(formatFieldValue("isCurrentlyUnhoused", true)).toBe("Yes");
    });

    it("formats false as 'No'", () => {
      expect(formatFieldValue("isCurrentlyUnhoused", false)).toBe("No");
    });

    it("treats undefined as false and formats as 'No'", () => {
      expect(formatFieldValue("isCurrentlyUnhoused", undefined)).toBe("No");
    });

    it("treats null as false and formats as 'No'", () => {
      expect(formatFieldValue("isCurrentlyUnhoused", null)).toBe("No");
    });
  });

  describe("string fields", () => {
    it("formats string values", () => {
      expect(formatFieldValue("oldFirstName", "John")).toBe("John");
    });

    it("returns undefined for empty string", () => {
      expect(formatFieldValue("oldFirstName", "")).toBeUndefined();
    });

    it("returns undefined for undefined", () => {
      expect(formatFieldValue("oldFirstName", undefined)).toBeUndefined();
    });

    it("returns undefined for null", () => {
      expect(formatFieldValue("oldFirstName", null)).toBeUndefined();
    });
  });

  describe("string[] fields", () => {
    it("formats array of strings", () => {
      expect(formatFieldValue("pronouns", ["they/them", "she/her"])).toBe(
        "they/them, she/her",
      );
    });

    it("returns undefined for empty array", () => {
      expect(formatFieldValue("pronouns", [])).toBeUndefined();
    });

    it("returns undefined for undefined", () => {
      expect(formatFieldValue("pronouns", undefined)).toBeUndefined();
    });

    it("returns undefined for null", () => {
      expect(formatFieldValue("pronouns", null)).toBeUndefined();
    });
  });

  describe("phone number formatting", () => {
    it("formats phone number", () => {
      expect(formatFieldValue("phoneNumber", "(123) 456-7890")).toBe(
        "(123) 456-7890",
      );
    });

    it("returns undefined for empty phone number", () => {
      expect(formatFieldValue("phoneNumber", "")).toBeUndefined();
    });
  });

  describe("date formatting", () => {
    it("formats ISO date string", () => {
      const result = formatFieldValue("dateOfBirth", "1990-01-15");
      expect(result).toBe("January 15, 1990");
    });

    it("returns undefined for empty date", () => {
      expect(formatFieldValue("dateOfBirth", "")).toBeUndefined();
    });
  });
});

describe("getFieldLabel", () => {
  it("returns the label for a known field", () => {
    expect(getFieldLabel("isCurrentlyUnhoused")).toBe("Currently unhoused?");
  });

  it("returns the label for another field", () => {
    expect(getFieldLabel("oldFirstName")).toBe("Old first name");
  });

  it("returns the field name if not found", () => {
    // @ts-expect-error - testing with invalid field name
    expect(getFieldLabel("unknownField")).toBe("unknownField");
  });
});

