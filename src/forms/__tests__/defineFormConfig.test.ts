import { describe, expect, it } from "vitest";
import {
  defineFormConfig,
  fieldsFromSteps,
  step,
} from "@/forms/defineFormConfig";
import { makeStep } from "./testHelpers";

describe("step", () => {
  it("returns the config unchanged", () => {
    const config = makeStep("a", ["oldFirstName" as any]);
    expect(step(config)).toBe(config);
  });
});

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
    const steps = [
      step(makeStep("a", ["oldFirstName" as any])),
      step(makeStep("b", ["oldLastName" as any])),
    ];

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
