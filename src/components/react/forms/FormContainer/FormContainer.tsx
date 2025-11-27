import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, type UseFormReturn } from "react-hook-form";
import { FormNavigation } from "@/components/react/forms/FormNavigation";
import { FormReviewStep } from "@/components/react/forms/FormReviewStep";
import { FormTitleStep } from "@/components/react/forms/FormTitleStep";
import { FormStepContext } from "./FormStepContext";
import "./FormContainer.css";

export interface Step {
  id: string;
  component: React.ComponentType;
}

export interface FormContainerProps {
  /** The title of the form. */
  title: string;

  /** An optional description to provide more context. */
  description?: string;

  /** Optional child content to display on the title step. */
  children?: React.ReactNode;

  /** The form steps to render (after the title step). */
  steps: readonly Step[];

  /** The form instance from react-hook-form's useForm hook. */
  form: UseFormReturn<any>;

  /** Submit handler for the final form submission. */
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export function FormContainer({
  title,
  description,
  children,
  steps,
  form,
  onSubmit,
}: FormContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Navigation index: -1 = title, 0 to steps.length-1 = actual steps, steps.length = review
  const [navigationIndex, setNavigationIndex] = useState(-1);

  const scrollToFormTop = useCallback(() => {
    containerRef.current?.scrollIntoView({ block: "start" });
  }, []);

  // Sync step with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove #

      // If no hash, go to title
      if (!hash) {
        setNavigationIndex(-1);
        return;
      }

      // Check if it's the review step
      if (hash === "review") {
        setNavigationIndex(steps.length);
        return;
      }

      // Find the step in the actual steps array
      const stepIndex = steps.findIndex((step) => step.id === hash);
      if (stepIndex !== -1) {
        setNavigationIndex(stepIndex);
      }
    };

    // Set initial step from hash
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [steps]);

  // Update hash when navigation changes
  useEffect(() => {
    let targetHash = "";

    if (navigationIndex === -1) {
      // Title step - no hash
      targetHash = "";
    } else if (navigationIndex === steps.length) {
      // Review step
      targetHash = "#review";
    } else if (navigationIndex >= 0 && navigationIndex < steps.length) {
      // Actual step
      targetHash = `#${steps[navigationIndex].id}`;
    }

    const currentPath = window.location.pathname + window.location.search;
    const targetUrl = currentPath + targetHash;

    if (window.location.href !== window.location.origin + targetUrl) {
      window.history.pushState(null, "", targetUrl);
    }
  }, [navigationIndex, steps]);

  const goToNextStep = useCallback(() => {
    // Can go from title (-1) through all steps (0 to steps.length-1) to review (steps.length)
    if (navigationIndex < steps.length) {
      setNavigationIndex(navigationIndex + 1);
    }

    scrollToFormTop();
  }, [navigationIndex, steps.length, scrollToFormTop]);

  const goToPreviousStep = useCallback(() => {
    // Can go back from review (steps.length) through all steps to title (-1)
    if (navigationIndex > -1) {
      setNavigationIndex(navigationIndex - 1);
    }

    scrollToFormTop();
  }, [navigationIndex, scrollToFormTop]);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (navigationIndex === steps.length) {
        // On the review step, trigger the actual form submission
        scrollToFormTop();
        onSubmit(e);
      } else {
        // Otherwise, just go to the next step (which handles scrolling)
        goToNextStep();
      }
    },
    [navigationIndex, steps.length, scrollToFormTop, onSubmit, goToNextStep],
  );

  // Memoize the current step component to prevent unnecessary recreations
  const currentStepComponent = useMemo(() => {
    if (navigationIndex === -1) {
      return <FormTitleStep onStart={goToNextStep}>{children}</FormTitleStep>;
    }

    if (navigationIndex === steps.length) {
      return <FormReviewStep />;
    }

    if (navigationIndex >= 0 && navigationIndex < steps.length) {
      const StepComponent = steps[navigationIndex].component;
      return <StepComponent />;
    }

    return null;
  }, [navigationIndex, steps, goToNextStep, children]);

  // Calculate the current step index for the context (1-based for actual steps, 0 for title/review)
  const currentStepIndex =
    navigationIndex >= 0 && navigationIndex < steps.length
      ? navigationIndex + 1
      : 0;

  const isReviewStep = navigationIndex === steps.length;

  const stepContextValue = useMemo(
    () => ({
      onNext: goToNextStep,
      onBack: goToPreviousStep,
      formTitle: title,
      formDescription: description,
      currentStepIndex,
      totalSteps: steps.length,
      isReviewStep,
      onSubmit: handleFormSubmit,
    }),
    [
      goToNextStep,
      goToPreviousStep,
      title,
      description,
      currentStepIndex,
      steps.length,
      isReviewStep,
      handleFormSubmit,
    ],
  );

  const showNavigation = navigationIndex >= 0;

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
