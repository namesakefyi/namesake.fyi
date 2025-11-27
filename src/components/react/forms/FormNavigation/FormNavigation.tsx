import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";
import { memo } from "react";
import { useFormStep } from "@/components/react/forms/FormContainer";
import { Button } from "../../common/Button";
import { ProgressBar } from "../../common/ProgressBar";
import "./FormNavigation.css";
import { Fragment } from "react/jsx-runtime";

export const FormNavigation = memo(function FormNavigation() {
  const {
    formTitle,
    currentStepIndex,
    totalSteps,
    isReviewStep,
    onNext,
    onBack,
  } = useFormStep();

  // Don't show navigation on title step (when currentStepIndex === 0 and not review)
  if (currentStepIndex === 0 && !isReviewStep) {
    return null;
  }

  return (
    <nav className="form-navigation">
      <div className="form-progress">
        <ProgressBar
          label={formTitle}
          value={isReviewStep ? totalSteps : currentStepIndex}
          valueLabel={<Fragment />}
          maxValue={isReviewStep ? totalSteps : totalSteps + 1}
          formatOptions={{ style: "decimal" }}
        />
      </div>
      <div className="form-navigation-buttons">
        <Button
          onPress={onBack}
          variant="secondary"
          icon={RiArrowLeftLine}
          aria-label="Previous step"
          className="form-navigation-button"
        />
        <Button
          onPress={onNext}
          variant="secondary"
          icon={RiArrowRightLine}
          aria-label="Next step"
          className="form-navigation-button"
          isDisabled={isReviewStep}
        />
      </div>
    </nav>
  );
});
