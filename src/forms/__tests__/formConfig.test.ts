import { describe, expect, it } from "vitest";
import { createFormConfig } from "@/forms/createFormConfig";
import { makeStep } from "./testHelpers";

describe("createFormConfig", () => {
  it("derives machine from slug and steps", () => {
    const steps = [
      makeStep("a", ["oldFirstName" as any]),
      makeStep("b", ["oldLastName" as any]),
    ];

    const config = createFormConfig({
      slug: "test-form",
      steps,
      pdfs: [],
      downloadTitle: "Test Form",
      instructions: [],
    });

    expect(config.slug).toBe("test-form");
    expect(config.steps).toBe(steps);
    expect(config.machine).toBeDefined();
  });

  it("passes through extra properties", () => {
    const steps = [makeStep("a")];
    const instructionsFn = () => ["Do a thing"];

    const config = createFormConfig({
      slug: "extra-props",
      steps,
      pdfs: [],
      downloadTitle: "Extra",
      instructions: instructionsFn,
    });

    expect(config.instructions).toBe(instructionsFn);
  });
});
