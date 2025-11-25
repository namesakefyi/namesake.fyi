import { RiArrowRightLine } from "@remixicon/react";
import { Heading } from "react-aria-components";
import { formatTimeEstimate } from "../../../../utils/formatTimeEstimate";
import { smartquotes } from "../../../../utils/smartquotes";
import { Button } from "../../common/Button";
import { useFormStep } from "../FormContainer/FormStepContext";
import "./FormTitleStep.css";

export interface FormTitleStepProps {
  /**
   * Optional child content to display below the description.
   */
  children?: React.ReactNode;

  /**
   * Handler for when the user clicks the start button.
   */
  onStart: () => void;
}

export function FormTitleStep({ children, onStart }: FormTitleStepProps) {
  const { formTitle, formDescription, totalSteps } = useFormStep();
  const timeEstimate = formatTimeEstimate(totalSteps);

  return (
    <section className="form-title-step">
      <header className="form-title-step-header">
        <Heading className="form-title-step-heading">
          {smartquotes(formTitle)}
        </Heading>
        {formDescription && (
          <p className="form-title-step-description">
            {smartquotes(formDescription)}
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
