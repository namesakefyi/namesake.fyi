import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import * as db from "@/db/database";
import { createForm } from "@/forms/createForm";
import { createFormMachine } from "@/forms/createFormMachine";
import type { Step } from "@/forms/types";
import { FormStep } from "../FormStep/FormStep";
import { FormContainer } from "./FormContainer";

vi.mock("@/db/database", () => ({
  getFormProgress: vi.fn().mockResolvedValue(undefined),
  saveFormProgress: vi.fn().mockResolvedValue(undefined),
  clearFormProgress: vi.fn().mockResolvedValue(undefined),
  getAllFields: vi.fn().mockResolvedValue([]),
  getFieldsByNames: vi.fn().mockResolvedValue([]),
}));

const mockSubmitHandler = vi.fn().mockResolvedValue(undefined);
vi.mock("@/forms/createFormSubmitHandler", () => ({
  createFormSubmitHandler: vi.fn(() => mockSubmitHandler),
}));

// A minimal step whose component renders plain content (no form).
const plainStep: Step = {
  id: "plain",
  title: "Plain Step",
  fields: [],
  render: () => <div>Step content</div>,
};

// A step whose component renders a FormStep, exposing a submittable form.
const formStepStep: Step = {
  id: "form-step",
  title: "Form Step",
  fields: [],
  render: ({ stepConfig }) => <FormStep stepConfig={stepConfig} />,
};

const plainFlow = [plainStep];
const plainMachine = createFormMachine({ id: "test-plain", steps: plainFlow });

const formStepFlow = [formStepStep];
const formStepMachine = createFormMachine({
  id: "test-form-step",
  steps: formStepFlow,
});

function makeContainer(
  flow: typeof plainFlow,
  machine: ReturnType<typeof createFormMachine>,
) {
  const form = createForm({
    slug: machine.id,
    steps: flow,
    pdfs: [],
    downloadTitle: "Test Download",
    instructions: [],
  });
  return function Container() {
    return (
      <FormContainer
        config={form}
        title="Test Title"
        description="Test Description"
        updatedAt="2025-01-01"
      />
    );
  };
}

describe("FormContainer", () => {
  beforeEach(() => {
    vi.mocked(db.getFormProgress).mockResolvedValue(undefined);
  });

  beforeAll(() => {
    if (typeof globalThis.indexedDB === "undefined") {
      Object.defineProperty(globalThis, "indexedDB", { value: {} });
    }
    Element.prototype.scrollIntoView = vi.fn();
    // Ensure requestAnimationFrame callbacks run synchronously in tests.
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
  });

  describe("title step", () => {
    const Container = makeContainer(plainFlow, plainMachine);

    it("renders title on title step", async () => {
      render(<Container />);
      expect(await screen.findByText("Test Title")).toBeInTheDocument();
    });

    it("renders description on title step", async () => {
      render(<Container />);
      expect(await screen.findByText("Test Description")).toBeInTheDocument();
    });

    it("renders start button on title step", async () => {
      render(<Container />);
      expect(
        await screen.findByRole("button", { name: "Start" }),
      ).toBeInTheDocument();
    });

    it("renders a loading spinner while saved progress is being fetched", () => {
      vi.mocked(db.getFormProgress).mockReturnValue(new Promise(() => {}));

      render(<Container />);

      expect(
        screen.getByRole("progressbar", { name: "Loading form" }),
      ).toBeInTheDocument();
      expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    });
  });

  describe("filling phase", () => {
    it("renders step content and navigation after clicking Start", async () => {
      const user = userEvent.setup();
      const Container = makeContainer(plainFlow, plainMachine);
      render(<Container />);

      await user.click(await screen.findByRole("button", { name: "Start" }));

      expect(screen.getByText("Step content")).toBeInTheDocument();
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("returns to title after clicking Previous step", async () => {
      const user = userEvent.setup();
      const Container = makeContainer(plainFlow, plainMachine);
      render(<Container />);

      await user.click(await screen.findByRole("button", { name: "Start" }));
      await user.click(screen.getByRole("button", { name: "Previous step" }));

      expect(
        await screen.findByRole("button", { name: "Start" }),
      ).toBeInTheDocument();
    });
  });

  describe("review phase", () => {
    it("renders review step after clicking Next step", async () => {
      const user = userEvent.setup();
      const Container = makeContainer(plainFlow, plainMachine);
      render(<Container />);

      await user.click(await screen.findByRole("button", { name: "Start" }));
      await user.click(screen.getByRole("button", { name: "Next step" }));

      expect(
        await screen.findByText("Review your information"),
      ).toBeInTheDocument();
    });
  });

  describe("handleFormSubmit — default case (filling)", () => {
    it("advances to review when a filling-phase form step is submitted", async () => {
      const user = userEvent.setup();
      const Container = makeContainer(formStepFlow, formStepMachine);
      render(<Container />);

      await user.click(await screen.findByRole("button", { name: "Start" }));
      await user.click(screen.getByRole("button", { name: "Continue" }));

      expect(
        await screen.findByText("Review your information"),
      ).toBeInTheDocument();
    });
  });

  describe("handleFormSubmit — review case", () => {
    it("renders complete step after a successful submission", async () => {
      const user = userEvent.setup();
      mockSubmitHandler.mockResolvedValue(undefined);
      const Container = makeContainer(plainFlow, plainMachine);
      render(<Container />);

      await user.click(await screen.findByRole("button", { name: "Start" }));
      await user.click(screen.getByRole("button", { name: "Next step" }));
      await user.click(
        await screen.findByRole("button", { name: /finish and download/i }),
      );

      expect(mockSubmitHandler).toHaveBeenCalled();
      expect(await screen.findByText("Form complete!")).toBeInTheDocument();
    });

    it("shows an error banner when submission throws", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const user = userEvent.setup();
      mockSubmitHandler.mockRejectedValueOnce(new Error("PDF failed"));
      const Container = makeContainer(plainFlow, plainMachine);
      render(<Container />);

      await user.click(await screen.findByRole("button", { name: "Start" }));
      await user.click(screen.getByRole("button", { name: "Next step" }));
      await user.click(
        await screen.findByRole("button", { name: /finish and download/i }),
      );

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveTextContent(
          "Something went wrong",
        );
      });

      consoleSpy.mockRestore();
    });
  });
});
