import {
  type RemixiconComponentType,
  RiArrowRightLine,
  RiAuctionLine,
  RiFileTextLine,
  RiLockLine,
  RiShieldKeyholeLine,
  RiTimerLine,
} from "@remixicon/react";
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
      <ul className="form-title-step-info">
        <li>
          <RiFileTextLine />
          <span>
            {/* TODO: Enumerate forms which this helps fill */}
            This will help you fill and download <strong>SS-5</strong>
          </span>
        </li>
        {timeEstimate && (
          <li>
            <RiTimerLine />
            <span>
              Requires about <strong>{timeEstimate}</strong> to complete
            </span>
          </li>
        )}
        <li>
          <RiShieldKeyholeLine />
          <span>
            Your data is never sent to Namesake—everything is stored locally in
            your browser
          </span>
        </li>
      </ul>
      <footer className="form-title-step-footer">
        <Button
          onPress={onStart}
          variant="primary"
          size="large"
          endIcon={RiArrowRightLine}
          className="form-title-step-button"
        >
          Start
        </Button>
      </footer>
    </section>
  );
}
