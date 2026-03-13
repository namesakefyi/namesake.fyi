import { describe, expect, it } from "vitest";
import { evaluateRule, type VisibilityRule } from "../visibilityRules";

describe("evaluateRule", () => {
  describe("undefined (no rule = always visible)", () => {
    it("returns true when rule is undefined", () => {
      expect(evaluateRule(undefined, {})).toBe(true);
      expect(evaluateRule(undefined, { oldFirstName: "Jane" })).toBe(true);
    });
  });

  describe("equals", () => {
    it.each<[VisibilityRule, Record<string, unknown>, boolean]>([
      [
        { field: "hasUsedOtherNameOrAlias", equals: true },
        { hasUsedOtherNameOrAlias: true },
        true,
      ],
      [
        { field: "birthplaceCountry", equals: "US" },
        { birthplaceCountry: "US" },
        true,
      ],
      [
        { field: "hasUsedOtherNameOrAlias", equals: true },
        { hasUsedOtherNameOrAlias: false },
        false,
      ],
      [
        { field: "birthplaceCountry", equals: "US" },
        { birthplaceCountry: "CA" },
        false,
      ],
      [{ field: "hasUsedOtherNameOrAlias", equals: true }, {}, false],
    ])("evaluates %s with %o -> %s", (rule, data, expected) => {
      expect(evaluateRule(rule, data)).toBe(expected);
    });
  });

  describe("notEquals", () => {
    it.each<[VisibilityRule, Record<string, unknown>, boolean]>([
      [
        { field: "isCurrentlyUnhoused", notEquals: true },
        { isCurrentlyUnhoused: false },
        true,
      ],
      [
        { field: "isCurrentlyUnhoused", notEquals: true },
        { isCurrentlyUnhoused: undefined },
        true,
      ],
      [
        { field: "isCurrentlyUnhoused", notEquals: true },
        { isCurrentlyUnhoused: true },
        false,
      ],
    ])("evaluates %s with %o -> %s", (rule, data, expected) => {
      expect(evaluateRule(rule, data)).toBe(expected);
    });
  });

  describe("includes", () => {
    it.each<[VisibilityRule, Record<string, unknown>, boolean]>([
      [
        { field: "pronouns", includes: "other" },
        { pronouns: ["they/them", "other"] },
        true,
      ],
      [
        { field: "pronouns", includes: "other" },
        { pronouns: ["they/them", "she/her"] },
        false,
      ],
      [{ field: "pronouns", includes: "other" }, {}, false],
    ])("evaluates %s with %o -> %s", (rule, data, expected) => {
      expect(evaluateRule(rule, data)).toBe(expected);
    });
  });

  describe("and", () => {
    it.each<[VisibilityRule, Record<string, unknown>, boolean]>([
      [
        {
          and: [
            { field: "isCurrentlyUnhoused", notEquals: true },
            { field: "isMailingAddressDifferentFromResidence", equals: true },
          ],
        },
        {
          isCurrentlyUnhoused: false,
          isMailingAddressDifferentFromResidence: true,
        },
        true,
      ],
      [
        {
          and: [
            { field: "isCurrentlyUnhoused", notEquals: true },
            { field: "isMailingAddressDifferentFromResidence", equals: true },
          ],
        },
        {
          isCurrentlyUnhoused: true,
          isMailingAddressDifferentFromResidence: true,
        },
        false,
      ],
    ])("evaluates %s with %o -> %s", (rule, data, expected) => {
      expect(evaluateRule(rule, data)).toBe(expected);
    });
  });

  describe("or", () => {
    it.each<[VisibilityRule, Record<string, unknown>, boolean]>([
      [
        {
          or: [
            { field: "hasUsedOtherNameOrAlias", equals: true },
            { field: "hasPreviousNameChange", equals: true },
          ],
        },
        { hasUsedOtherNameOrAlias: false, hasPreviousNameChange: true },
        true,
      ],
      [
        {
          or: [
            { field: "hasUsedOtherNameOrAlias", equals: true },
            { field: "hasPreviousNameChange", equals: true },
          ],
        },
        { hasUsedOtherNameOrAlias: false, hasPreviousNameChange: false },
        false,
      ],
    ])("evaluates %s with %o -> %s", (rule, data, expected) => {
      expect(evaluateRule(rule, data)).toBe(expected);
    });
  });
});
