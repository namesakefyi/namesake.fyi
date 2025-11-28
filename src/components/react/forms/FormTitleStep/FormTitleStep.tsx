import {
  type RemixiconComponentType,
  RiArrowRightLine,
  RiFileTextLine,
  RiShieldKeyholeLine,
  RiTimerLine,
} from "@remixicon/react";
import { Heading } from "react-aria-components";
import { UAParser } from "ua-parser-js";
import { formatTimeEstimate } from "@/utils/formatTimeEstimate";
import { smartquotes } from "@/utils/smartquotes";
import { Button } from "../../common/Button";
import { useFormStep } from "../FormContainer/FormStepContext";
import "./FormTitleStep.css";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(localizedFormat);

function FormTitleStepInfo({ children }: { children: React.ReactNode }) {
  return <ul className="form-title-step-info">{children}</ul>;
}

interface FormTitleStepInfoItemProps {
  icon: RemixiconComponentType;
  children: React.ReactNode;
  description?: string;
}

function FormTitleStepInfoItem({
  icon: Icon,
  children,
  description,
}: FormTitleStepInfoItemProps) {
  return (
    <li>
      <Icon />
      <span className="form-title-step-info-title">{children}</span>
      {description && (
        <p className="form-title-step-info-description">
          {smartquotes(description)}
        </p>
      )}
    </li>
  );
}

export interface FormTitleStepProps {
  /**
   * Optional child content to display below the description.
   */
  children?: React.ReactNode;

  /**
   * Handler for when the user clicks the start button.
   */
  onStart: () => void;

  /**
   * The date the form was last updated.
   */
  updatedAt: string;
}

export function FormTitleStep({
  children,
  onStart,
  updatedAt,
}: FormTitleStepProps) {
  const { formTitle, formDescription, totalSteps } = useFormStep();
  const timeEstimate = formatTimeEstimate(totalSteps);

  const { device, browser } = UAParser(navigator.userAgent);

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
      <FormTitleStepInfo>
        {timeEstimate && (
          <FormTitleStepInfoItem icon={RiTimerLine}>
            Requires about <strong>{timeEstimate}</strong>.
          </FormTitleStepInfoItem>
        )}
        <FormTitleStepInfoItem icon={RiFileTextLine}>
          All required forms will be filled and downloaded.
        </FormTitleStepInfoItem>
        <FormTitleStepInfoItem
          icon={RiShieldKeyholeLine}
          description="For your security, your information is never sent to Namesake."
        >
          Your information is stored locally in{" "}
          <strong>{browser.name ?? "this browser"}</strong> on this{" "}
          <strong>{device.model ?? "device"}</strong>.
        </FormTitleStepInfoItem>
      </FormTitleStepInfo>
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
      {updatedAt && (
        <div className="form-title-step-date-updated">
          Form last revised on{" "}
          <time dateTime={updatedAt}>
            {dayjs.utc(updatedAt).local().format("LL [at] LT")}
          </time>
          .
        </div>
      )}
    </section>
  );
}
