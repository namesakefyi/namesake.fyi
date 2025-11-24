import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
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
        currentStepIndex: 2, // Step 2 of actual steps
        totalSteps: 5, // 5 actual steps
        isReviewStep: false,
      }}
    >
      {children}
    </FormStepContext.Provider>
  );
}

describe("FormStep", () => {
  const formStep = {
    title: "What is your legal name?",
    description: "Type your name exactly as it appears on your ID.",
  };

  it("renders title correctly", () => {
    render(<FormStep {...formStep} />, { wrapper: TestWrapper });

    const titleElement = screen.getByText(formStep.title);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("form-step-title");
  });

  it("renders optional description", () => {
    render(<FormStep {...formStep} />, { wrapper: TestWrapper });

    const descriptionElement = screen.getByText(formStep.description);
    expect(descriptionElement).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    render(<FormStep {...formStep} description={undefined} />, {
      wrapper: TestWrapper,
    });

    const titleElement = screen.getByText(formStep.title);
    expect(titleElement).toBeInTheDocument();

    const descriptionQuery = screen.queryByRole("paragraph");
    expect(descriptionQuery).toBeNull();
  });

  it("associates the section with the title", () => {
    render(<FormStep {...formStep} title="What is your legal name?" />, {
      wrapper: TestWrapper,
    });
    const section = screen.getByRole("region");
    expect(section).toHaveAttribute(
      "aria-labelledby",
      "what-is-your-legal-name",
    );
    const header = screen.getByRole("heading");
    expect(header).toHaveAttribute("id", "what-is-your-legal-name");
  });

  it("omits apostrophes from the id", () => {
    render(
      <FormStep
        {...formStep}
        title="What is the reason you're changing your name?"
      />,
      { wrapper: TestWrapper },
    );
    const section = screen.getByRole("region");
    expect(section).toHaveAttribute(
      "aria-labelledby",
      "what-is-the-reason-youre-changing-your-name",
    );
  });

  it("has accessible description when description is provided", () => {
    render(<FormStep {...formStep} />, { wrapper: TestWrapper });

    const section = screen.getByRole("region", {
      description: formStep.description,
    });
    expect(section).toBeInTheDocument();
  });

  it("has no accessible description when description is omitted", () => {
    render(<FormStep {...formStep} description={undefined} />, {
      wrapper: TestWrapper,
    });

    const section = screen.getByRole("region", {
      name: formStep.title,
    });
    expect(section).toBeInTheDocument();
    expect(section).not.toHaveAccessibleDescription();
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
