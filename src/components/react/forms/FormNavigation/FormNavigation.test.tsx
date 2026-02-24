import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { FormStepContext } from "@/components/react/forms/FormContainer/FormStepContext";
import { FormNavigation } from "./FormNavigation";

const defaultContext = {
  formTitle: "Court Order MA",
  currentStepIndex: 1,
  totalSteps: 4,
  isReviewStep: false,
  isReviewingMode: false,
  onNext: vi.fn(),
  onBack: vi.fn(),
  onSubmit: vi.fn(),
};

function makeWrapper(
  overrides: Partial<typeof defaultContext> = {},
): ({ children }: { children: ReactNode }) => ReactNode {
  return ({ children }) => (
    <FormStepContext.Provider value={{ ...defaultContext, ...overrides }}>
      {children}
    </FormStepContext.Provider>
  );
}

describe("FormNavigation", () => {
  describe("visibility", () => {
    it("renders nothing on the title step (index 0, not review)", () => {
      const { container } = render(<FormNavigation />, {
        wrapper: makeWrapper({ currentStepIndex: 0, isReviewStep: false }),
      });

      expect(container.firstChild).toBeNull();
    });

    it("renders the nav on a regular step (index > 0)", () => {
      render(<FormNavigation />, {
        wrapper: makeWrapper({ currentStepIndex: 1, isReviewStep: false }),
      });

      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("renders the nav on the review step even when index is 0", () => {
      render(<FormNavigation />, {
        wrapper: makeWrapper({ currentStepIndex: 0, isReviewStep: true }),
      });

      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });
  });

  describe("navigation buttons", () => {
    it("calls onBack when the previous step button is pressed", async () => {
      const onBack = vi.fn();
      render(<FormNavigation />, { wrapper: makeWrapper({ onBack }) });

      await userEvent.click(
        screen.getByRole("button", { name: "Previous step" }),
      );

      expect(onBack).toHaveBeenCalledOnce();
    });

    it("calls onNext when the next step button is pressed", async () => {
      const onNext = vi.fn();
      render(<FormNavigation />, { wrapper: makeWrapper({ onNext }) });

      await userEvent.click(
        screen.getByRole("button", { name: "Next step" }),
      );

      expect(onNext).toHaveBeenCalledOnce();
    });

    it("disables the next step button on the review step", () => {
      render(<FormNavigation />, {
        wrapper: makeWrapper({ isReviewStep: true }),
      });

      expect(
        screen.getByRole("button", { name: "Next step" }),
      ).toBeDisabled();
    });

    it("enables the next step button on regular steps", () => {
      render(<FormNavigation />, {
        wrapper: makeWrapper({ isReviewStep: false }),
      });

      expect(
        screen.getByRole("button", { name: "Next step" }),
      ).not.toBeDisabled();
    });
  });

  describe("progress bar", () => {
    it("labels the progress bar with the form title", () => {
      render(<FormNavigation />, {
        wrapper: makeWrapper({ formTitle: "Social Security" }),
      });

      expect(
        screen.getByRole("progressbar", { name: "Social Security" }),
      ).toBeInTheDocument();
    });
  });
});
