import { useCallback, useMemo, useRef, useState } from "react";
import { FormProvider, type UseFormReturn } from "react-hook-form";
import { ProgressCircle } from "@/components/react/common/ProgressCircle";
import { FormCompleteStep } from "@/components/react/forms/FormCompleteStep";
import { FormNavigation } from "@/components/react/forms/FormNavigation";
import { FormReviewStep } from "@/components/react/forms/FormReviewStep";
import { FormTitleStep } from "@/components/react/forms/FormTitleStep/FormTitleStep";
import type { FormMachine } from "@/forms/formConfig";
import type { FormPdfMetadata } from "@/forms/getFormPdfMetadata";
import type { Step } from "@/forms/types";
import { useFormState } from "@/forms/useFormState";
import type { Cost } from "@/utils/formatTotalCosts";
import { FormStepContext } from "./FormStepContext";
import "./FormContainer.css";

export interface FormContainerProps {
  /** The title of the form. */
  title: string;

  /** An optional description to provide more context. */
  description?: string;

  /** Children to display on the title step. */
  children?: React.ReactNode;

  /** Ordered steps, including optional `when` rules for conditional inclusion. */
  steps: readonly Step[];

  /** The XState machine for this form, created by createFormMachine. */
  machine: FormMachine;

  /** The form instance from react-hook-form's useForm hook. */
  form: UseFormReturn<any>;

  /** Submit handler for the final form submission. Can be async. */
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void | Promise<void>;

  /** The date the form was last updated. */
  updatedAt?: string;

  /** The PDF metadata for forms that will be generated. */
  pdfs?: FormPdfMetadata[];

  /** The costs associated with this form. */
  costs?: Cost[];
}

export function FormContainer({
  title,
  description,
  children,
  steps,
  machine,
  form,
  onSubmit,
  updatedAt,
  pdfs,
  costs,
}: FormContainerProps) {
  const formSlug = machine.id;
  const {
    isLoading,
    phase,
    send,
    activeStep,
    currentStepIndex,
    totalSteps,
    goNext,
    goBack,
  } = useFormState(machine, steps, form.getValues);

  const containerRef = useRef<HTMLDivElement>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const scrollToFormTop = useCallback(() => {
    containerRef.current?.scrollIntoView({ block: "start" });
  }, []);

  const focusStepContent = useCallback(() => {
    requestAnimationFrame(() => {
      const stepForm = containerRef.current?.querySelector(
        ".form-step",
      ) as HTMLElement | null;

      if (stepForm) {
        stepForm.focus({ preventScroll: true });
      }
    });
  }, []);

  const onStart = useCallback(() => {
    send({ type: "START" });
    scrollToFormTop();
    focusStepContent();
  }, [send, scrollToFormTop, focusStepContent]);

  const onNext = useCallback(() => {
    goNext();
    scrollToFormTop();
    focusStepContent();
  }, [goNext, scrollToFormTop, focusStepContent]);

  const onBack = useCallback(() => {
    goBack();
    scrollToFormTop();
    focusStepContent();
  }, [goBack, scrollToFormTop, focusStepContent]);

  const onEditStep = useCallback(
    (stepId: string) => {
      send({ type: "EDIT_STEP", stepId });
      scrollToFormTop();
      focusStepContent();
    },
    [send, scrollToFormTop, focusStepContent],
  );

  const handleFormSubmit = useCallback(
    async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();

      switch (phase) {
        case "editing":
          send({ type: "SAVE_EDIT" });
          scrollToFormTop();
          focusStepContent();
          return;
        case "review":
          setSubmitError(null);
          send({ type: "SUBMIT" });
          try {
            await onSubmit(e);
            send({ type: "SUBMIT_DONE" });
            scrollToFormTop();
          } catch (error) {
            console.error("Form submission failed:", error);
            send({ type: "SUBMIT_ERROR" });
            setSubmitError(
              "Something went wrong while generating your download. Please try again.",
            );
          }
          return;
        default:
          onNext();
      }
    },
    [phase, send, onSubmit, onNext, scrollToFormTop, focusStepContent],
  );

  const currentStepComponent = useMemo(() => {
    switch (phase) {
      case "title":
        return (
          <FormTitleStep
            title={title}
            description={description}
            pdfs={pdfs ?? []}
            updatedAt={updatedAt ?? ""}
            totalSteps={totalSteps}
            onStart={onStart}
          >
            {children}
          </FormTitleStep>
        );
      case "filling":
      case "editing": {
        if (!activeStep) return null;
        const StepComponent = activeStep.render;
        return <StepComponent stepConfig={activeStep} />;
      }
      case "review":
      case "submitting":
        return <FormReviewStep steps={steps} />;
      case "complete":
        return (
          <FormCompleteStep
            title={title}
            formSlug={formSlug}
            onRedownload={onSubmit}
          />
        );
      default:
        return null;
    }
  }, [
    phase,
    steps,
    activeStep,
    pdfs,
    updatedAt,
    title,
    description,
    children,
    totalSteps,
    onStart,
    onSubmit,
    formSlug,
  ]);

  const showNavigation = !["title", "complete"].includes(phase);

  const stepContextValue = {
    onNext,
    onBack,
    formTitle: title,
    formDescription: description,
    currentStepIndex,
    totalSteps,
    phase,
    onSubmit: handleFormSubmit,
    onEditStep,
    submitError,
    costs,
  };

  if (isLoading) {
    return (
      <section
        className="form-container form-container-loading"
        ref={containerRef}
      >
        <ProgressCircle isIndeterminate aria-label="Loading form" size={40} />
      </section>
    );
  }

  return (
    <FormProvider {...form}>
      <FormStepContext.Provider value={stepContextValue}>
        <section className="form-container" ref={containerRef}>
          {showNavigation && <FormNavigation />}
          <div className="form-container-content">{currentStepComponent}</div>
        </section>
      </FormStepContext.Provider>
    </FormProvider>
  );
}
