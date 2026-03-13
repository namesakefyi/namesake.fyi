import { describe, expect, it } from "vitest";
import { resolveFormVisibility } from "../formVisibility";
import { makeStep } from "./testHelpers";

describe("resolveFormVisibility", () => {
  describe("steps (visibleStepIds)", () => {
    it("returns all step IDs when no step when rules", () => {
      const flow = [makeStep("a"), makeStep("b")];
      const result = resolveFormVisibility(flow, {});
      expect(result.visibleStepIds).toEqual(["a", "b"]);
      expect(result.sections).toEqual([
        { stepId: "a", fields: [] },
        { stepId: "b", fields: [] },
      ]);
    });

    it("filters out steps whose when rule evaluates to false", () => {
      const flow = [
        makeStep("a"),
        makeStep("b", [], { or: [] }),
        makeStep("c"),
      ];
      const result = resolveFormVisibility(flow, {});
      expect(result.visibleStepIds).toEqual(["a", "c"]);
      expect(result.sections).toEqual([
        { stepId: "a", fields: [] },
        { stepId: "c", fields: [] },
      ]);
    });

    it.each([
      [{ shouldApplyForFeeWaiver: true }, ["a", "b"]],
      [{ shouldApplyForFeeWaiver: false }, ["a"]],
    ] as const)("evaluates when rule with formData (formData=%o -> %s)", (formData, expected) => {
      const flow = [
        makeStep("a"),
        makeStep("b", [], {
          field: "shouldApplyForFeeWaiver",
          equals: true,
        }),
      ];
      expect(resolveFormVisibility(flow, formData).visibleStepIds).toEqual(
        expected,
      );
    });

    it("returns empty array for empty steps", () => {
      const result = resolveFormVisibility([], {});
      expect(result.visibleStepIds).toEqual([]);
      expect(result.sections).toEqual([]);
    });
  });

  describe("fields (visibleFields)", () => {
    it("includes all field values when no field when rules", () => {
      const flow = [
        makeStep("a", ["oldFirstName", "oldLastName"]),
        makeStep("b", ["phoneNumber"]),
      ];
      const formData = {
        oldFirstName: "x",
        oldLastName: "y",
        phoneNumber: "z",
      };
      const result = resolveFormVisibility(flow, formData);
      expect(result.visibleFields).toEqual({
        oldFirstName: "x",
        oldLastName: "y",
        phoneNumber: "z",
      });
      expect(result.sections).toEqual([
        { stepId: "a", fields: ["oldFirstName", "oldLastName"] },
        { stepId: "b", fields: ["phoneNumber"] },
      ]);
    });

    it.each([
      [
        { hasUsedOtherNameOrAlias: false, otherNamesOrAliases: "y" },
        { hasUsedOtherNameOrAlias: false },
      ],
      [
        { hasUsedOtherNameOrAlias: true, otherNamesOrAliases: "y" },
        { hasUsedOtherNameOrAlias: true, otherNamesOrAliases: "y" },
      ],
    ] as const)("filters fields by when rules (formData -> visibleFields)", (formData, expected) => {
      const stepWithVisibility = makeStep("a", [
        "hasUsedOtherNameOrAlias",
        {
          id: "otherNamesOrAliases",
          when: { field: "hasUsedOtherNameOrAlias", equals: true },
        },
      ]);
      const flow = [stepWithVisibility];
      expect(resolveFormVisibility(flow, formData).visibleFields).toEqual(
        expected,
      );
    });

    it("excludes all fields when step when rule fails", () => {
      const flow = [
        makeStep("a", ["oldFirstName"]),
        makeStep("b", ["oldLastName"], { or: [] }),
      ];
      const formData = { oldFirstName: "x", oldLastName: "y" };
      const result = resolveFormVisibility(flow, formData);
      expect(result.visibleFields).toEqual({ oldFirstName: "x" });
      expect(result.sections).toEqual([
        { stepId: "a", fields: ["oldFirstName"] },
      ]);
    });

    it("returns empty object for empty steps", () => {
      const result = resolveFormVisibility([], { oldFirstName: "x" });
      expect(result.visibleFields).toEqual({});
    });
  });

  describe("PDFs (pdfsToInclude)", () => {
    it("includes all PDFs when no when rule", () => {
      const pdfs = [
        "cjp27-petition-to-change-name-of-adult",
        "ss5-application-for-social-security-card",
      ] as const;
      const result = resolveFormVisibility([], {}, pdfs);
      expect(result.pdfsToInclude).toEqual([
        "cjp27-petition-to-change-name-of-adult",
        "ss5-application-for-social-security-card",
      ]);
    });

    it.each([
      [{ shouldApplyForFeeWaiver: true }, ["affidavit-of-indigency"]],
      [
        { shouldApplyForFeeWaiver: false },
        [{ id: "affidavit-of-indigency", when: false }],
      ],
    ] as const)("evaluates when rule with formData (formData=%o -> pdfsToInclude)", (formData, expected) => {
      const pdfs = [
        {
          id: "affidavit-of-indigency" as const,
          when: { field: "shouldApplyForFeeWaiver" as const, equals: true },
        },
      ];
      expect(resolveFormVisibility([], formData, pdfs).pdfsToInclude).toEqual(
        expected,
      );
    });

    it("returns empty array when pdfs omitted", () => {
      const result = resolveFormVisibility([], {});
      expect(result.pdfsToInclude).toEqual([]);
    });
  });

  describe("combined", () => {
    it("resolves steps, fields, and PDFs together", () => {
      const guardedStep = makeStep("fee-waiver", ["reasonToWaivePublication"], {
        field: "shouldApplyForFeeWaiver",
        equals: true,
      });
      const flow = [makeStep("intro", ["newFirstName"]), guardedStep];
      const pdfs = [
        "cjp27-petition-to-change-name-of-adult",
        {
          id: "affidavit-of-indigency",
          when: { field: "shouldApplyForFeeWaiver", equals: true },
        },
      ] as const;
      const formData = {
        newFirstName: "Jane",
        shouldApplyForFeeWaiver: true,
        reasonToWaivePublication: "doc.pdf",
      };

      const result = resolveFormVisibility(flow, formData, pdfs);

      expect(result.visibleStepIds).toEqual(["intro", "fee-waiver"]);
      expect(result.visibleFields).toEqual({
        newFirstName: "Jane",
        reasonToWaivePublication: "doc.pdf",
      });
      expect(result.sections).toEqual([
        { stepId: "intro", fields: ["newFirstName"] },
        { stepId: "fee-waiver", fields: ["reasonToWaivePublication"] },
      ]);
      expect(result.pdfsToInclude).toEqual([
        "cjp27-petition-to-change-name-of-adult",
        "affidavit-of-indigency",
      ]);
    });
  });
});
