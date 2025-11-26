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
        formDescription: "Test Description",
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
    onStart: vi.fn(),
  };

  it("renders title", () => {
    render(<FormTitleStep {...formTitleStep} />, { wrapper: TestWrapper });

    const titleElement = screen.getByText("Test Form");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("form-title-step-heading");
  });

  it("renders description", () => {
    render(<FormTitleStep {...formTitleStep} />, { wrapper: TestWrapper });

    const descriptionElement = screen.getByText("Test Description");
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement).toHaveClass("form-title-step-description");
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

    const timeEstimateElement = screen.getByText(/\d+–\d+ minutes/);
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
});
