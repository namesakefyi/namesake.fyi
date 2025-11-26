import { Heading } from "react-aria-components";
import { Button } from "../../common/Button";
import "./FormReviewStep.css";
import { RiDownloadLine } from "@remixicon/react";

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
   * Optional child content to display (form data preview will go here).
   */
  children?: React.ReactNode;
}

export function FormReviewStep({
  title = "Review your information",
  description = "Please review your answers before submitting. Once submitted, completed forms will download automatically.",
  children,
}: FormReviewStepProps) {
  return (
    <div className="form-review-step">
      <header className="form-review-step-header">
        <Heading className="form-review-step-title">{title}</Heading>
        {description && (
          <p className="form-review-description">{description}</p>
        )}
      </header>
      <div className="form-review-step-content">
        {children || (
          <div className="form-review-step-placeholder">
            <p>Form review placeholder</p>
          </div>
        )}
      </div>
      <Button
        type="submit"
        variant="primary"
        icon={RiDownloadLine}
        size="large"
        className="form-review-step-button"
      >
        Finish and Download Forms
      </Button>
    </div>
  );
}
