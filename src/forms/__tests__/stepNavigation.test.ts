import { describe, expect, it } from "vitest";
import { step } from "@/forms/defineFormConfig";
import {
  findNextStepIndex,
  findPrevStepIndex,
  getVisibleStepIds,
} from "@/forms/stepNavigation";
import { makeStep } from "./testHelpers";

describe("findNextStepIndex", () => {
  const unguarded = [
    step(makeStep("a")),
    step(makeStep("b")),
    step(makeStep("c")),
  ];

  it("returns the immediate next index when no guards", () => {
    expect(findNextStepIndex(unguarded, 0, {})).toBe(1);
    expect(findNextStepIndex(unguarded, 1, {})).toBe(2);
  });

  it("returns -1 when already at the last step", () => {
    expect(findNextStepIndex(unguarded, 2, {})).toBe(-1);
  });

  it("skips steps whose guard returns false", () => {
    const flow = [
      step(makeStep("a")),
      step(makeStep("b", [], () => false)),
      step(makeStep("c")),
    ];
    expect(findNextStepIndex(flow, 0, {})).toBe(2);
  });

  it("returns -1 when all remaining steps are guarded out", () => {
    const flow = [
      step(makeStep("a")),
      step(makeStep("b", [], () => false)),
      step(makeStep("c", [], () => false)),
    ];
    expect(findNextStepIndex(flow, 0, {})).toBe(-1);
  });

  it("passes formData to the guard function", () => {
    const flow = [
      step(makeStep("a")),
      step(makeStep("b", [], (data) => data.shouldApplyForFeeWaiver === true)),
    ];
    expect(findNextStepIndex(flow, 0, { shouldApplyForFeeWaiver: true })).toBe(
      1,
    );
    expect(findNextStepIndex(flow, 0, { shouldApplyForFeeWaiver: false })).toBe(
      -1,
    );
  });
});

describe("findPrevStepIndex", () => {
  const unguarded = [
    step(makeStep("a")),
    step(makeStep("b")),
    step(makeStep("c")),
  ];

  it("returns the immediate previous index when no guards", () => {
    expect(findPrevStepIndex(unguarded, 2, {})).toBe(1);
    expect(findPrevStepIndex(unguarded, 1, {})).toBe(0);
  });

  it("returns -1 when already at the first step", () => {
    expect(findPrevStepIndex(unguarded, 0, {})).toBe(-1);
  });

  it("skips steps whose guard returns false", () => {
    const flow = [
      step(makeStep("a")),
      step(makeStep("b", [], () => false)),
      step(makeStep("c")),
    ];
    expect(findPrevStepIndex(flow, 2, {})).toBe(0);
  });

  it("returns -1 when all preceding steps are guarded out", () => {
    const flow = [
      step(makeStep("a", [], () => false)),
      step(makeStep("b", [], () => false)),
      step(makeStep("c")),
    ];
    expect(findPrevStepIndex(flow, 2, {})).toBe(-1);
  });

  it("passes formData to the guard function", () => {
    const flow = [
      step(makeStep("a", [], (data) => data.shouldApplyForFeeWaiver === true)),
      step(makeStep("b")),
    ];
    expect(findPrevStepIndex(flow, 1, { shouldApplyForFeeWaiver: true })).toBe(
      0,
    );
    expect(findPrevStepIndex(flow, 1, { shouldApplyForFeeWaiver: false })).toBe(
      -1,
    );
  });
});

describe("getVisibleStepIds", () => {
  it("returns all step IDs when no guards", () => {
    const flow = [step(makeStep("a")), step(makeStep("b"))];
    expect(getVisibleStepIds(flow, {})).toEqual(["a", "b"]);
  });

  it("filters out steps whose guard returns false", () => {
    const flow = [
      step(makeStep("a")),
      step(makeStep("b", [], () => false)),
      step(makeStep("c")),
    ];
    expect(getVisibleStepIds(flow, {})).toEqual(["a", "c"]);
  });
});
