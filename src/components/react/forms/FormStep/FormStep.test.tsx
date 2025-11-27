import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import type { StepConfig } from "../FormContainer";
import { FormStepContext } from "../FormContainer/FormStepContext";
import { FormStep, FormSubsection } from "./FormStep";

// Test wrapper that provides FormStepContext
function TestWrapper({ children }: { children: ReactNode }) {
  return (
    <FormStepContext.Provider
      value={{
        onNext: vi.fn(),
        onBack: vi.fn(),
        formTitle: "Test Form",
        isReviewStep: false,
        currentStepIndex: 2, // Step 2 of actual steps
        totalSteps: 5, // 5 actual steps
        isReviewingMode: false,
        onSubmit: vi.fn(),
      }}
    >
      {children}
    </FormStepContext.Provider>
  );
}

describe("FormStep", () => {
  const formStep: StepConfig = {
    id: "what-is-your-legal-name",
    component: () => <div>Test content</div>,
    title: "What is your legal name?",
    description: "Type your name exactly as it appears on your ID.",
    fields: [],
    isFieldVisible: () => true,
  };

  it("renders title correctly", () => {
    render(<FormStep stepConfig={formStep} />, { wrapper: TestWrapper });

    const titleElement = screen.getByText(formStep.title);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("form-step-title");
  });

  it("renders optional description", () => {
    render(<FormStep stepConfig={formStep} />, { wrapper: TestWrapper });

    const descriptionElement = screen.getByText(formStep.description ?? "");
    expect(descriptionElement).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    render(<FormStep stepConfig={formStep} />, {
      wrapper: TestWrapper,
    });

    const titleElement = screen.getByText(formStep.title);
    expect(titleElement).toBeInTheDocument();

    const descriptionQuery = screen.queryByRole("paragraph");
    expect(descriptionQuery).toBeNull();
  });

  it("associates the form with the title", () => {
    render(<FormStep stepConfig={formStep} />, {
      wrapper: TestWrapper,
    });
    const form = screen.getByRole("form");
    expect(form).toHaveAttribute("aria-labelledby", "what-is-your-legal-name");
    const header = screen.getByRole("heading");
    expect(header).toHaveAttribute("id", "what-is-your-legal-name");
  });

  it("omits apostrophes from the id", () => {
    render(<FormStep {...formStep} stepConfig={formStep} />, {
      wrapper: TestWrapper,
    });
    const form = screen.getByRole("form");
    expect(form).toHaveAttribute(
      "aria-labelledby",
      "what-is-the-reason-youre-changing-your-name",
    );
  });

  it("has accessible description when description is provided", () => {
    render(<FormStep stepConfig={formStep} />, { wrapper: TestWrapper });

    const form = screen.getByRole("form", {
      description: formStep.description,
    });
    expect(form).toBeInTheDocument();
  });

  it("has no accessible description when description is omitted", () => {
    render(<FormStep stepConfig={formStep} />, {
      wrapper: TestWrapper,
    });

    const form = screen.getByRole("form", {
      name: formStep.title,
    });
    expect(form).toBeInTheDocument();
    expect(form).not.toHaveAccessibleDescription();
  });
});

describe("FormSubsection", () => {
  it("renders title", () => {
    render(<FormSubsection title="What is your legal name?" />);

    const titleElement = screen.getByText("What is your legal name?");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("react-aria-Heading");
  });

  it("does not render title when not provided", () => {
    render(<FormSubsection title={undefined} />);

    const titleElement = screen.queryByText("What is your legal name?");
    expect(titleElement).toBeNull();
  });

  it("renders children", () => {
    render(
      <FormSubsection title="What is your legal name?">
        <div>Test content</div>
      </FormSubsection>,
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("does not render when not visible", () => {
    render(
      <FormSubsection title="What is your legal name?" isVisible={false} />,
    );

    const titleElement = screen.queryByText("What is your legal name?");
    expect(titleElement).toBeNull();
  });
});
