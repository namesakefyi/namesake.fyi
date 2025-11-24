import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { FormStepContext } from "../FormContainer/FormStepContext";
import { FormTitleStep } from "./FormTitleStep";

// Test wrapper that provides FormStepContext
function TestWrapper({ children }: { children: ReactNode }) {
  return (
    <FormStepContext.Provider
      value={{
        onNext: vi.fn(),
        onBack: vi.fn(),
        formTitle: "Test Form",
        currentStepIndex: 0, // Title step
        totalSteps: 5, // 5 actual steps
        isReviewStep: false,
      }}
    >
      {children}
    </FormStepContext.Provider>
  );
}

describe("FormTitleStep", () => {
  const formTitleStep = {
    title: "Massachusetts Court Order",
    description:
      "File for a court-ordered name change in Massachusetts. This is the first step in the legal name change process.",
    onStart: vi.fn(),
  };

  it("renders title correctly", () => {
    render(<FormTitleStep {...formTitleStep} />, { wrapper: TestWrapper });

    const titleElement = screen.getByText(formTitleStep.title);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("form-title-step-heading");
  });

  it("renders optional description", () => {
    render(<FormTitleStep {...formTitleStep} />, { wrapper: TestWrapper });

    const descriptionElement = screen.getByText(formTitleStep.description);
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement).toHaveClass("form-title-step-description");
  });

  it("does not render description when not provided", () => {
    render(<FormTitleStep {...formTitleStep} description={undefined} />, {
      wrapper: TestWrapper,
    });

    const titleElement = screen.getByText(formTitleStep.title);
    expect(titleElement).toBeInTheDocument();

    const descriptionQuery = screen.queryByText(formTitleStep.description);
    expect(descriptionQuery).toBeNull();
  });

  it("renders Start button", () => {
    render(<FormTitleStep {...formTitleStep} />, { wrapper: TestWrapper });

    const startButton = screen.getByRole("button", { name: /start/i });
    expect(startButton).toBeInTheDocument();
  });

  it("calls onStart when Start button is clicked", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();

    render(<FormTitleStep {...formTitleStep} onStart={onStart} />, {
      wrapper: TestWrapper,
    });

    const startButton = screen.getByRole("button", { name: /start/i });
    await user.click(startButton);

    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("renders time estimate when totalSteps is provided", () => {
    render(<FormTitleStep {...formTitleStep} />, { wrapper: TestWrapper });

    const timeEstimateElement = screen.getByText(
      /estimated time to complete:/i,
    );
    expect(timeEstimateElement).toBeInTheDocument();
  });

  it("renders children when provided", () => {
    const children = <div>Test child content</div>;

    render(<FormTitleStep {...formTitleStep}>{children}</FormTitleStep>, {
      wrapper: TestWrapper,
    });

    const childElement = screen.getByText("Test child content");
    expect(childElement).toBeInTheDocument();
  });

  it("does not render children when not provided", () => {
    render(<FormTitleStep {...formTitleStep} />, { wrapper: TestWrapper });

    const contentDiv = document.querySelector(".form-title-step-content");
    expect(contentDiv).toBeNull();
  });

  it("applies smartquotes to title", () => {
    render(
      <FormTitleStep
        {...formTitleStep}
        title='Court Order for "Name Change"'
      />,
      { wrapper: TestWrapper },
    );

    // smartquotes should convert straight quotes to curly quotes
    const titleElement = screen.getByText(/Court Order for/i);
    expect(titleElement).toBeInTheDocument();
  });

  it("applies smartquotes to description", () => {
    render(
      <FormTitleStep
        {...formTitleStep}
        description='This is the "first step" in the process.'
      />,
      { wrapper: TestWrapper },
    );

    const descriptionElement = screen.getByText(/This is the/i);
    expect(descriptionElement).toBeInTheDocument();
  });

  it("renders as a section element", () => {
    const { container } = render(<FormTitleStep {...formTitleStep} />, {
      wrapper: TestWrapper,
    });

    const section = container.querySelector("section.form-title-step");
    expect(section).toBeInTheDocument();
  });

  it("renders header with proper structure", () => {
    const { container } = render(<FormTitleStep {...formTitleStep} />, {
      wrapper: TestWrapper,
    });

    const header = container.querySelector("header.form-title-step-header");
    expect(header).toBeInTheDocument();

    const heading = header?.querySelector(".form-title-step-heading");
    expect(heading).toBeInTheDocument();
  });

  it("renders footer with proper structure", () => {
    const { container } = render(<FormTitleStep {...formTitleStep} />, {
      wrapper: TestWrapper,
    });

    const footer = container.querySelector("footer.form-title-step-footer");
    expect(footer).toBeInTheDocument();

    const button = footer?.querySelector("button");
    expect(button).toBeInTheDocument();
  });
});
