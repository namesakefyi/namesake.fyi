import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormReviewTable } from "./FormReviewTable";

function FormWrapper({
  children,
  defaultValues = {},
}: {
  children: ReactNode;
  defaultValues?: Record<string, unknown>;
}) {
  const form = useForm({ defaultValues });
  return <FormProvider {...form}>{children}</FormProvider>;
}

function renderWithValues(
  ui: ReactNode,
  defaultValues: Record<string, unknown> = {},
) {
  return render(<FormWrapper defaultValues={defaultValues}>{ui}</FormWrapper>);
}

const nameStep: StepConfig = {
  id: "legal-name",
  title: "Legal Name",
  component: () => null,
  fields: ["oldFirstName", "oldLastName"],
};

const contactStep: StepConfig = {
  id: "contact",
  title: "Contact",
  component: () => null,
  fields: ["phoneNumber"],
};

describe("FormReviewTable", () => {
  it("renders a field label and value for each visible field", () => {
    renderWithValues(<FormReviewTable steps={[nameStep]} />, {
      oldFirstName: "Sylvia",
      oldLastName: "Rivera",
    });

    const terms = screen.getAllByRole("term");
    const definitions = screen.getAllByRole("definition");

    expect(terms[0]).toHaveTextContent("Old first name:");
    expect(definitions[0]).toHaveTextContent("Sylvia");
    expect(terms[1]).toHaveTextContent("Old last name:");
    expect(definitions[1]).toHaveTextContent("Rivera");
  });

  it("shows a 'Missing!' marker for fields with no value", () => {
    renderWithValues(<FormReviewTable steps={[nameStep]} />, {
      oldFirstName: "Sylvia",
      // oldLastName intentionally omitted
    });

    const definitions = screen.getAllByRole("definition");
    expect(definitions[0]).toHaveTextContent("Sylvia");
    expect(definitions[1]).toHaveTextContent("Missing!");
  });

  it("renders a Change link pointing to the step's review URL", () => {
    renderWithValues(<FormReviewTable steps={[nameStep]} />, {
      oldFirstName: "Sylvia",
    });

    const changeLink = screen.getByRole("link", { name: "Change" });
    expect(changeLink).toHaveAttribute("href", "#legal-name?reviewing=true");
  });

  it("renders a section per step when multiple steps have visible fields", () => {
    renderWithValues(<FormReviewTable steps={[nameStep, contactStep]} />, {
      oldFirstName: "Sylvia",
      phoneNumber: "(555) 867-5309",
    });

    const changeLinks = screen.getAllByRole("link", { name: "Change" });
    expect(changeLinks).toHaveLength(2);
    expect(changeLinks[0]).toHaveAttribute(
      "href",
      "#legal-name?reviewing=true",
    );
    expect(changeLinks[1]).toHaveAttribute("href", "#contact?reviewing=true");
  });

  it("skips steps where all fields are hidden by isFieldVisible", () => {
    const hiddenStep: StepConfig = {
      ...nameStep,
      id: "hidden-step",
      isFieldVisible: () => false,
    };

    renderWithValues(<FormReviewTable steps={[hiddenStep, contactStep]} />, {
      oldFirstName: "Sylvia",
      phoneNumber: "(555) 867-5309",
    });

    // Only the contact step section should be rendered
    const changeLinks = screen.getAllByRole("link", { name: "Change" });
    expect(changeLinks).toHaveLength(1);
    expect(changeLinks[0]).toHaveAttribute("href", "#contact?reviewing=true");
  });

  it("renders no sections when all steps have no visible fields", () => {
    const emptyStep: StepConfig = {
      ...nameStep,
      isFieldVisible: () => false,
    };

    renderWithValues(<FormReviewTable steps={[emptyStep]} />, {
      oldFirstName: "Sylvia",
    });

    expect(screen.queryAllByRole("term")).toHaveLength(0);
    expect(screen.queryAllByRole("definition")).toHaveLength(0);
  });

  it("only includes fields that are visible within a step", () => {
    const partialStep: StepConfig = {
      ...nameStep,
      isFieldVisible: (fieldName) => fieldName === "oldFirstName",
    };

    renderWithValues(<FormReviewTable steps={[partialStep]} />, {
      oldFirstName: "Sylvia",
      oldLastName: "Rivera",
    });

    const terms = screen.getAllByRole("term");
    const definitions = screen.getAllByRole("definition");

    expect(terms).toHaveLength(1);
    expect(terms[0]).toHaveTextContent("Old first name:");
    expect(definitions[0]).toHaveTextContent("Sylvia");
  });
});
