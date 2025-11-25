import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as formRegistry from "~/forms/formRegistry";
import { FormRenderer } from "./FormRenderer";

// Mock the form registry module
vi.mock("~/forms/formRegistry", () => ({
  getFormComponent: vi.fn(),
}));

// Create a mock form component
const MockFormComponent = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) => (
  <div data-testid="mock-form">
    {title && <h1>{title}</h1>}
    {description && <p>{description}</p>}
  </div>
);

describe("FormRenderer", () => {
  it("renders the form component when valid componentId is provided", () => {
    vi.mocked(formRegistry.getFormComponent).mockReturnValue(MockFormComponent);

    render(
      <FormRenderer
        componentId="ma-court-order"
        title="Massachusetts Court Order"
        description="Test description"
      />,
    );

    expect(formRegistry.getFormComponent).toHaveBeenCalledWith(
      "ma-court-order",
    );
    expect(screen.getByTestId("mock-form")).toBeInTheDocument();
  });

  it("passes title prop to the form component", () => {
    vi.mocked(formRegistry.getFormComponent).mockReturnValue(MockFormComponent);

    render(
      <FormRenderer
        componentId="ma-court-order"
        title="Massachusetts Court Order"
      />,
    );

    expect(screen.getByText("Massachusetts Court Order")).toBeInTheDocument();
  });

  it("passes description prop to the form component", () => {
    vi.mocked(formRegistry.getFormComponent).mockReturnValue(MockFormComponent);

    render(
      <FormRenderer
        componentId="ma-court-order"
        title="Test Form"
        description="This is a test description"
      />,
    );

    expect(screen.getByText("This is a test description")).toBeInTheDocument();
  });

  it("renders without description when not provided", () => {
    vi.mocked(formRegistry.getFormComponent).mockReturnValue(MockFormComponent);

    render(<FormRenderer componentId="ma-court-order" title="Test Form" />);

    expect(screen.getByTestId("mock-form")).toBeInTheDocument();
    expect(screen.getByText("Test Form")).toBeInTheDocument();
  });

  it("renders empty state when componentId is not found", () => {
    vi.mocked(formRegistry.getFormComponent).mockReturnValue(undefined);

    render(
      <FormRenderer
        componentId="non-existent-form"
        title="Non-existent Form"
      />,
    );

    expect(
      screen.getByText(/Couldn't find form for component ID/i),
    ).toBeInTheDocument();
    expect(screen.getByText("non-existent-form")).toBeInTheDocument();
  });

  it("renders empty state with proper message for invalid componentId", () => {
    vi.mocked(formRegistry.getFormComponent).mockReturnValue(undefined);

    render(<FormRenderer componentId="invalid-id" title="Invalid Form" />);

    const emptyState = screen.getByText(/Couldn't find form for component ID/i);
    expect(emptyState).toBeInTheDocument();

    const codeElement = screen.getByText("invalid-id");
    expect(codeElement.tagName).toBe("CODE");
  });

  it("shows 'unknown' when componentId is empty", () => {
    vi.mocked(formRegistry.getFormComponent).mockReturnValue(undefined);

    render(<FormRenderer componentId="" title="Empty ID Form" />);

    expect(screen.getByText("unknown")).toBeInTheDocument();
  });

  it("applies form-empty-state class to empty state", () => {
    vi.mocked(formRegistry.getFormComponent).mockReturnValue(undefined);

    const { container } = render(
      <FormRenderer componentId="non-existent" title="Test" />,
    );

    const emptyState = container.querySelector(".form-empty-state");
    expect(emptyState).toBeInTheDocument();
  });

  it("does not render the mock form when component is not found", () => {
    vi.mocked(formRegistry.getFormComponent).mockReturnValue(undefined);

    render(<FormRenderer componentId="non-existent" title="Test" />);

    expect(screen.queryByTestId("mock-form")).not.toBeInTheDocument();
  });

  it("renders the component without title or description props", () => {
    vi.mocked(formRegistry.getFormComponent).mockReturnValue(MockFormComponent);

    render(<FormRenderer componentId="ma-court-order" />);

    const mockForm = screen.getByTestId("mock-form");
    expect(mockForm).toBeInTheDocument();

    // Ensure no title or description is rendered
    expect(mockForm.querySelector("h1")).not.toBeInTheDocument();
    expect(mockForm.querySelector("p")).not.toBeInTheDocument();
  });
});
