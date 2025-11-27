import { Heading } from "react-aria-components";
import { Button } from "../../common/Button";
import "./FormReviewStep.css";
import { RiDownloadLine } from "@remixicon/react";
import type { StepConfig } from "../FormContainer/FormContainer";
import { useFormStep } from "../FormContainer/FormStepContext";
import { FormReviewTable } from "../FormReviewTable";

export interface FormReviewStepProps {
  /**
   * The title of the review screen.
   * @default "Review your information"
   */
  title?: string;

  /**
   * Optional description for the review screen.
   */
  description?: string;

  /**
   * The step configurations to display in the review table.
   */
  steps: readonly StepConfig[];
}

export function FormReviewStep({
  title = "Review your information",
  description = "Please review your answers before submitting. Once submitted, completed forms will download automatically.",
  steps,
}: FormReviewStepProps) {
  const { onSubmit } = useFormStep();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form className="form-review-step" onSubmit={handleSubmit}>
      <header className="form-review-step-header">
        <Heading className="form-review-step-title">{title}</Heading>
        {description && (
          <p className="form-review-description">{description}</p>
        )}
      </header>
      <div className="form-review-step-content">
        <FormReviewTable steps={steps} />
      </div>
      <Button
        type="submit"
        variant="primary"
        icon={RiDownloadLine}
        size="large"
        className="form-review-step-button"
      >
        Finish and Download
      </Button>
    </form>
  );
}
