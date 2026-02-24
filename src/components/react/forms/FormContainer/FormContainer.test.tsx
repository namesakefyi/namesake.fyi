import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { beforeAll, describe, expect, it, vi } from "vitest";
import * as db from "@/db/database";
import { createFormMachine, step } from "@/forms/createFormMachine";
import type { Step } from "@/forms/types";
import { FormContainer } from "./FormContainer";

vi.mock("@/db/database", () => ({
  getFormProgress: vi.fn().mockResolvedValue(undefined),
  saveFormProgress: vi.fn().mockResolvedValue(undefined),
  clearFormProgress: vi.fn().mockResolvedValue(undefined),
}));

const emptyStep: Step = {
  id: "empty",
  title: "Empty Step",
  fields: [],
  component: () => <div>Step content</div>,
};

const emptyFlow = [step(emptyStep)];
const emptyMachine = createFormMachine({ id: "test", steps: emptyFlow });

const FormContainerWithForm = () => {
  const form = useForm();
  return (
    <FormContainer
      title="Test Title"
      description="Test Description"
      updatedAt="2025-01-01"
      form={form}
      onSubmit={() => {}}
      steps={emptyFlow}
      machine={emptyMachine}
    />
  );
};

describe("FormContainer", () => {
  beforeAll(() => {
    if (typeof globalThis.indexedDB === "undefined") {
      Object.defineProperty(globalThis, "indexedDB", { value: {} });
    }
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("renders title on title step", async () => {
    render(<FormContainerWithForm />);

    expect(await screen.findByText("Test Title")).toBeInTheDocument();
  });

  it("renders description on title step", async () => {
    render(<FormContainerWithForm />);

    expect(await screen.findByText("Test Description")).toBeInTheDocument();
  });

  it("renders start button on title step", async () => {
    render(<FormContainerWithForm />);

    expect(
      await screen.findByRole("button", { name: "Start" }),
    ).toBeInTheDocument();
  });

  it("renders a loading spinner while saved progress is being fetched", () => {
    vi.mocked(db.getFormProgress).mockReturnValue(new Promise(() => {}));

    render(<FormContainerWithForm />);

    expect(
      screen.getByRole("progressbar", { name: "Loading form" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
  });
});
