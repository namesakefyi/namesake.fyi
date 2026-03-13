import { describe, expect, it } from "vitest";
import type { VisibilityRule } from "@/forms/formVisibility";
import { findNextStepIndex, findPrevStepIndex } from "@/forms/formVisibility";
import { makeStep } from "./testHelpers";

const hidden = { or: [] } satisfies VisibilityRule;
const whenFeeWaiver = {
  field: "shouldApplyForFeeWaiver",
  equals: true,
} satisfies VisibilityRule;

const unguarded = [
  makeStep("a"),
  makeStep("b"),
  makeStep("c"),
];
const allVisible = ["a", "b", "c"];

describe("findNextStepIndex", () => {
  it("returns the immediate next index when all steps visible", () => {
    expect(findNextStepIndex(unguarded, 0, allVisible)).toBe(1);
    expect(findNextStepIndex(unguarded, 1, allVisible)).toBe(2);
  });

  it("returns -1 when already at the last step", () => {
    expect(findNextStepIndex(unguarded, 2, allVisible)).toBe(-1);
  });

  it("skips steps not in visibleStepIds", () => {
    const flow = [
      makeStep("a"),
      makeStep("b", [], hidden),
      makeStep("c"),
    ];
    const visibleStepIds = ["a", "c"];
    expect(findNextStepIndex(flow, 0, visibleStepIds)).toBe(2);
  });

  it("returns -1 when all remaining steps are not visible", () => {
    const flow = [
      makeStep("a"),
      makeStep("b", [], hidden),
      makeStep("c", [], hidden),
    ];
    const visibleStepIds = ["a"];
    expect(findNextStepIndex(flow, 0, visibleStepIds)).toBe(-1);
  });

  it("works with visibleStepIds from resolveFormVisibility", () => {
    const flow = [makeStep("a"), makeStep("b", [], whenFeeWaiver)];
    const visibleWhenFeeWaiver = ["a", "b"];
    const visibleWithoutFeeWaiver = ["a"];
    expect(findNextStepIndex(flow, 0, visibleWhenFeeWaiver)).toBe(1);
    expect(findNextStepIndex(flow, 0, visibleWithoutFeeWaiver)).toBe(-1);
  });
});

describe("findPrevStepIndex", () => {
  it("returns the immediate previous index when all steps visible", () => {
    expect(findPrevStepIndex(unguarded, 2, allVisible)).toBe(1);
    expect(findPrevStepIndex(unguarded, 1, allVisible)).toBe(0);
  });

  it("returns -1 when already at the first step", () => {
    expect(findPrevStepIndex(unguarded, 0, allVisible)).toBe(-1);
  });

  it("skips steps not in visibleStepIds", () => {
    const flow = [
      makeStep("a"),
      makeStep("b", [], hidden),
      makeStep("c"),
    ];
    const visibleStepIds = ["a", "c"];
    expect(findPrevStepIndex(flow, 2, visibleStepIds)).toBe(0);
  });

  it("returns -1 when all preceding steps are not visible", () => {
    const flow = [
      makeStep("a", [], hidden),
      makeStep("b", [], hidden),
      makeStep("c"),
    ];
    const visibleStepIds = ["c"];
    expect(findPrevStepIndex(flow, 2, visibleStepIds)).toBe(-1);
  });

  it("works with visibleStepIds from resolveFormVisibility", () => {
    const flow = [makeStep("a", [], whenFeeWaiver), makeStep("b")];
    const visibleWhenFeeWaiver = ["a", "b"];
    const visibleWithoutFeeWaiver = ["b"];
    expect(findPrevStepIndex(flow, 1, visibleWhenFeeWaiver)).toBe(0);
    expect(findPrevStepIndex(flow, 1, visibleWithoutFeeWaiver)).toBe(-1);
  });
});
