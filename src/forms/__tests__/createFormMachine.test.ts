import { describe, expect, it } from "vitest";
import { createActor } from "xstate";
import type { Step } from "@/forms/types";
import {
  createFormMachine,
  defineFormConfig,
  fieldsFromSteps,
  findNextStepIndex,
  findPrevStepIndex,
  getPhase,
  getVisibleStepIds,
  step,
} from "../createFormMachine";

function makeStep(
  id: string,
  fields: string[] = [],
  guard?: (data: any) => boolean,
): Step {
  return {
    id,
    title: `Step ${id}`,
    fields: fields as any,
    component: () => null,
    ...(guard && { guard }),
  };
}

// ---------------------------------------------------------------------------
// findNextStepIndex / findPrevStepIndex
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// fieldsFromSteps / defineFormConfig
// ---------------------------------------------------------------------------

describe("fieldsFromSteps", () => {
  it("flattens all field names from all steps", () => {
    const steps = [
      step(makeStep("a", ["oldFirstName", "oldLastName"])),
      step(makeStep("b", ["phoneNumber"])),
    ];
    expect(fieldsFromSteps(steps)).toEqual([
      "oldFirstName",
      "oldLastName",
      "phoneNumber",
    ]);
  });

  it("returns an empty array for an empty steps array", () => {
    expect(fieldsFromSteps([])).toEqual([]);
  });
});

describe("defineFormConfig", () => {
  it("derives machine and fields from slug and steps", () => {
    const a = makeStep("a", ["oldFirstName" as any]);
    const b = makeStep("b", ["oldLastName" as any]);
    const steps = [step(a), step(b)];

    const config = defineFormConfig({
      slug: "test-form",
      steps,
      pdfs: [],
      downloadTitle: "Test Form",
      instructions: [],
    });

    expect(config.slug).toBe("test-form");
    expect(config.steps).toBe(steps);
    expect(config.fields).toEqual(["oldFirstName", "oldLastName"]);
    expect(config.machine).toBeDefined();
  });

  it("passes through extra properties", () => {
    const steps = [step(makeStep("a"))];
    const instructionsFn = () => ["Do a thing"];

    const config = defineFormConfig({
      slug: "extra-props",
      steps,
      pdfs: [],
      downloadTitle: "Extra",
      instructions: instructionsFn,
    });

    expect(config.instructions).toBe(instructionsFn);
  });
});

// ---------------------------------------------------------------------------
// createFormMachine
// ---------------------------------------------------------------------------

describe("createFormMachine", () => {
  describe("linear flow", () => {
    const flow = [
      step(makeStep("a")),
      step(makeStep("b")),
      step(makeStep("c")),
    ];
    const machine = createFormMachine({ id: "test-linear", steps: flow });

    it("starts in title state", () => {
      const actor = createActor(machine);
      actor.start();
      expect(actor.getSnapshot().matches("title")).toBe(true);
      actor.stop();
    });

    it("START transitions to filling and sets currentStepId", () => {
      const actor = createActor(machine);
      actor.start();
      actor.send({ type: "START" });
      expect(actor.getSnapshot().matches("filling")).toBe(true);
      expect(actor.getSnapshot().context.currentStepId).toBe("a");
      actor.stop();
    });

    it("GOTO_STEP navigates between steps", () => {
      const actor = createActor(machine);
      actor.start();
      actor.send({ type: "START" });
      actor.send({ type: "GOTO_STEP", stepId: "b" });
      expect(actor.getSnapshot().context.currentStepId).toBe("b");
      actor.send({ type: "GOTO_STEP", stepId: "c" });
      expect(actor.getSnapshot().context.currentStepId).toBe("c");
      actor.stop();
    });

    it("GOTO_REVIEW transitions to review", () => {
      const actor = createActor(machine);
      actor.start();
      actor.send({ type: "START" });
      actor.send({ type: "GOTO_REVIEW" });
      expect(actor.getSnapshot().matches("review")).toBe(true);
      actor.stop();
    });

    it("GOTO_TITLE transitions back to title", () => {
      const actor = createActor(machine);
      actor.start();
      actor.send({ type: "START" });
      actor.send({ type: "GOTO_TITLE" });
      expect(actor.getSnapshot().matches("title")).toBe(true);
      actor.stop();
    });
  });

  describe("review-edit flow", () => {
    const flow = [step(makeStep("a")), step(makeStep("b"))];
    const machine = createFormMachine({ id: "test-review", steps: flow });

    it("EDIT_STEP from review transitions to editing with stepId in context", () => {
      const actor = createActor(machine);
      actor.start();
      actor.send({ type: "START" });
      actor.send({ type: "GOTO_REVIEW" });
      expect(actor.getSnapshot().matches("review")).toBe(true);

      actor.send({ type: "EDIT_STEP", stepId: "a" });
      expect(actor.getSnapshot().matches("editing")).toBe(true);
      expect(actor.getSnapshot().context.editingStepId).toBe("a");
      actor.stop();
    });

    it("SAVE_EDIT from editing returns to review and clears editingStepId", () => {
      const actor = createActor(machine);
      actor.start();
      actor.send({ type: "START" });
      actor.send({ type: "GOTO_REVIEW" });
      actor.send({ type: "EDIT_STEP", stepId: "b" });
      expect(actor.getSnapshot().matches("editing")).toBe(true);

      actor.send({ type: "SAVE_EDIT" });
      expect(actor.getSnapshot().matches("review")).toBe(true);
      expect(actor.getSnapshot().context.editingStepId).toBeNull();
      actor.stop();
    });

    it("GOTO_STEP from review transitions to filling", () => {
      const actor = createActor(machine);
      actor.start();
      actor.send({ type: "START" });
      actor.send({ type: "GOTO_REVIEW" });
      actor.send({ type: "GOTO_STEP", stepId: "b" });
      expect(actor.getSnapshot().matches("filling")).toBe(true);
      expect(actor.getSnapshot().context.currentStepId).toBe("b");
      actor.stop();
    });
  });

  describe("submission flow", () => {
    const flow = [step(makeStep("a"))];
    const machine = createFormMachine({ id: "test-submit", steps: flow });

    it("SUBMIT from review transitions to submitting", () => {
      const actor = createActor(machine);
      actor.start();
      actor.send({ type: "START" });
      actor.send({ type: "GOTO_REVIEW" });
      actor.send({ type: "SUBMIT" });
      expect(actor.getSnapshot().matches("submitting")).toBe(true);
      actor.stop();
    });

    it("SUBMIT_DONE transitions to complete", () => {
      const actor = createActor(machine);
      actor.start();
      actor.send({ type: "START" });
      actor.send({ type: "GOTO_REVIEW" });
      actor.send({ type: "SUBMIT" });
      actor.send({ type: "SUBMIT_DONE" });
      expect(actor.getSnapshot().matches("complete")).toBe(true);
      actor.stop();
    });

    it("SUBMIT_ERROR returns to review", () => {
      const actor = createActor(machine);
      actor.start();
      actor.send({ type: "START" });
      actor.send({ type: "GOTO_REVIEW" });
      actor.send({ type: "SUBMIT" });
      actor.send({ type: "SUBMIT_ERROR" });
      expect(actor.getSnapshot().matches("review")).toBe(true);
      actor.stop();
    });
  });
});

// ---------------------------------------------------------------------------
// getPhase
// ---------------------------------------------------------------------------

describe("getPhase", () => {
  it("returns the state name for simple string states", () => {
    expect(getPhase("title")).toBe("title");
    expect(getPhase("review")).toBe("review");
    expect(getPhase("filling")).toBe("filling");
    expect(getPhase("complete")).toBe("complete");
  });

  it("returns the top-level key for compound state objects", () => {
    expect(getPhase({ filling: "some-step" })).toBe("filling");
    expect(getPhase({ review: {} })).toBe("review");
  });

  it("defaults to 'title' for unexpected values", () => {
    expect(getPhase(null)).toBe("title");
    expect(getPhase(undefined)).toBe("title");
    expect(getPhase(42)).toBe("title");
  });
});

// ---------------------------------------------------------------------------
// getVisibleStepIds
// ---------------------------------------------------------------------------

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
