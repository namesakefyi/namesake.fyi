import { RiArrowRightLine } from "@remixicon/react";
import { Heading } from "react-aria-components";
import { useFormStep } from "@/components/react/forms/FormContainer";
import { slugify } from "../../../../utils/slugify";
import { smartquotes } from "../../../../utils/smartquotes";
import { Button } from "../../common/Button";
import "./FormStep.css";
import clsx from "clsx";
import { useId } from "react";

export interface FormStepProps {
  /**
   * The question title.
   * @example "What is your current legal name?"
   */
  title: string;

  /**
   * An optional description to provide more context.
   * @example "This is the name you're leaving behind. Type it exactly as it appears on your ID."
   */
  description?: string;

  /**
   * The form fields to render.
   */
  children?: React.ReactNode;

  /**
   * Optional styles for the container.
   */
  className?: string;
}

export function FormStep({
  title,
  description,
  children,
  className,
}: FormStepProps) {
  const titleId = slugify(title);
  const descriptionId = useId();
  const { onSubmit } = useFormStep();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form
      className={clsx("form-step", className)}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onSubmit={handleSubmit}
    >
      <header>
        <Heading className="form-step-title" id={titleId}>
          {smartquotes(title)}
        </Heading>
        {description && (
          <p id={descriptionId} className="form-step-description">
            {smartquotes(description)}
          </p>
        )}
      </header>
      <div className="form-step-content">{children}</div>
      <Button
        type="submit"
        variant="primary"
        endIcon={RiArrowRightLine}
        className="form-step-button"
      >
        Continue
      </Button>
    </form>
  );
}

interface FormSubsectionProps {
  title?: string;
  children?: React.ReactNode;
  isVisible?: boolean;
}

export function FormSubsection({
  title,
  children,
  isVisible = true,
}: FormSubsectionProps) {
  if (!isVisible) return null;

  return (
    <fieldset className="form-subsection" disabled={!isVisible}>
      {title && <Heading>{smartquotes(title)}</Heading>}
      {children}
    </fieldset>
  );
}
