import { describe, expect, it } from "vitest";
import { createForm } from "@/forms/createForm";
import { makeStep } from "./testHelpers";

describe("createForm", () => {
  it("derives machine from slug and steps", () => {
    const steps = [
      makeStep("a", ["oldFirstName" as any]),
      makeStep("b", ["oldLastName" as any]),
    ];

    const form = createForm({
      slug: "test-form",
      steps,
      pdfs: [],
      downloadTitle: "Test Form",
      instructions: [],
    });

    expect(form.slug).toBe("test-form");
    expect(form.steps).toBe(steps);
    expect(form.machine).toBeDefined();
  });

  it("passes through extra properties", () => {
    const steps = [makeStep("a")];
    const instructions = ["Do a thing"];

    const form = createForm({
      slug: "extra-props",
      steps,
      pdfs: [],
      downloadTitle: "Extra",
      instructions,
    });

    expect(form.instructions).toEqual(instructions);
  });
});
