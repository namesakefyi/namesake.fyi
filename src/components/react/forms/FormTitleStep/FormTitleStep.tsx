import { RiArrowRightLine } from "@remixicon/react";
import { Heading } from "react-aria-components";
import { formatTimeEstimate } from "../../../../utils/formatTimeEstimate";
import { smartquotes } from "../../../../utils/smartquotes";
import { Button } from "../../common/Button";
import { useFormStep } from "../FormContainer/FormStepContext";
import "./FormTitleStep.css";

export interface FormTitleStepProps {
  /**
   * The title of the form.
   */
  title: string;

  /**
   * An optional description to provide more context.
   */
  description?: string;

  /**
   * Optional child content to display below the description.
   */
  children?: React.ReactNode;

  /**
   * Handler for when the user clicks the start button.
   */
  onStart: () => void;
}

export function FormTitleStep({
  title,
  description,
  children,
  onStart,
}: FormTitleStepProps) {
  const { totalSteps } = useFormStep();
  const timeEstimate = formatTimeEstimate(totalSteps);

  return (
    <section className="form-title-step">
      <header className="form-title-step-header">
        <Heading className="form-title-step-heading">
          {smartquotes(title)}
        </Heading>
        {description && (
          <p className="form-title-step-description">
            {smartquotes(description)}
          </p>
        )}
      </header>
      {children && <div className="form-title-step-content">{children}</div>}
      <footer className="form-title-step-footer">
        <Button
          onPress={onStart}
          variant="primary"
          size="large"
          endIcon={RiArrowRightLine}
        >
          Start
        </Button>
        {timeEstimate && (
          <p className="form-title-step-time-estimate">
            <strong>Estimated time to complete: </strong>
            {timeEstimate}
          </p>
        )}
      </footer>
    </section>
  );
}
