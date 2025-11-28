import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FormContainer } from "./FormContainer";

const FormContainerWithForm = () => {
  const form = useForm();
  return (
    <FormContainer
      title="Test Title"
      description="Test Description"
      updatedAt="2025-01-01"
      form={form}
      onSubmit={() => {}}
      steps={[]}
    >
      <div>Test Content</div>
    </FormContainer>
  );
};

describe("FormContainer", () => {
  beforeEach(() => {
    // Mock scrollIntoView and focus for jsdom
    Element.prototype.scrollIntoView = vi.fn();
    HTMLElement.prototype.focus = vi.fn();
  });
  it("renders children content on title step", () => {
    render(<FormContainerWithForm />);

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders title on title step", () => {
    render(<FormContainerWithForm />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders description on title step", () => {
    render(<FormContainerWithForm />);

    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("renders start button on title step", () => {
    render(<FormContainerWithForm />);

    expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
  });
});
