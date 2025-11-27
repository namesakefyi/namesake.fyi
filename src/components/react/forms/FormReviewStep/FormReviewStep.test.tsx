import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { FormStepContext } from "../FormContainer/FormStepContext";
import { FormReviewStep } from "./FormReviewStep";

// Test wrapper that provides form context and FormStepContext
function TestWrapper({ children }: { children: React.ReactNode }) {
  const form = useForm();
  return (
    <FormProvider {...form}>
      <FormStepContext.Provider
        value={{
          onNext: vi.fn(),
          onBack: vi.fn(),
          formTitle: "Test Form",
          currentStepIndex: 0,
          totalSteps: 5,
          isReviewStep: true,
          isReviewingMode: false,
          onSubmit: vi.fn(),
        }}
      >
        {children}
      </FormStepContext.Provider>
    </FormProvider>
  );
}

describe("FormReviewStep", () => {
  it("renders with default title", () => {
    render(<FormReviewStep steps={[]} />, { wrapper: TestWrapper });

    expect(screen.getByText("Review your information")).toBeInTheDocument();
  });

  it("renders with default description", () => {
    render(<FormReviewStep steps={[]} />, { wrapper: TestWrapper });

    expect(
      screen.getByText(
        /Please review your answers before submitting. Once submitted, completed forms will download automatically./i,
      ),
    ).toBeInTheDocument();
  });

  it("renders with custom title", () => {
    render(<FormReviewStep title="Confirm Your Details" steps={[]} />, {
      wrapper: TestWrapper,
    });

    expect(screen.getByText("Confirm Your Details")).toBeInTheDocument();
  });

  it("renders with custom description", () => {
    render(
      <FormReviewStep
        steps={[]}
        title="Review"
        description="Please double-check everything."
      />,
      { wrapper: TestWrapper },
    );

    expect(
      screen.getByText("Please double-check everything."),
    ).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    render(
      <FormReviewStep title="Review" description={undefined} steps={[]} />,
      {
        wrapper: TestWrapper,
      },
    );

    expect(screen.getByText("Review")).toBeInTheDocument();

    const description = document.querySelector(".form-review-step-description");
    expect(description).not.toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<FormReviewStep steps={[]} />, { wrapper: TestWrapper });

    const button = screen.getByRole("button", {
      name: /finish and download/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "submit");
  });

  it("renders submit button with icon", () => {
    render(<FormReviewStep steps={[]} />, {
      wrapper: TestWrapper,
    });

    const button = screen.getByRole("button", {
      name: /finish and download/i,
    });
    expect(button).toBeInTheDocument();

    // Check if icon is present (RiDownloadLine)
    const svg = button.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("button click triggers form submission", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn((e) => e.preventDefault());

    function TestForm() {
      const form = useForm();
      return (
        <FormProvider {...form}>
          <FormStepContext.Provider
            value={{
              onNext: vi.fn(),
              onBack: vi.fn(),
              formTitle: "Test Form",
              currentStepIndex: 0,
              totalSteps: 5,
              isReviewStep: true,
              isReviewingMode: false,
              onSubmit: handleSubmit,
            }}
          >
            <FormReviewStep steps={[]} />
          </FormStepContext.Provider>
        </FormProvider>
      );
    }

    render(<TestForm />);

    const button = screen.getByRole("button", {
      name: /finish and download/i,
    });
    await user.click(button);

    expect(handleSubmit).toHaveBeenCalled();
  });
});
