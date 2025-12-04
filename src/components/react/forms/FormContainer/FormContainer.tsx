import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, type UseFormReturn } from "react-hook-form";
import { FormNavigation } from "@/components/react/forms/FormNavigation";
import { FormReviewStep } from "@/components/react/forms/FormReviewStep";
import { FormTitleStep } from "@/components/react/forms/FormTitleStep/FormTitleStep";
import type { FieldName, FormData } from "@/constants/fields";
import type { Cost } from "@/utils/formatTotalCosts";
import type { FormPdfMetadata } from "@/utils/getFormPdfMetadata";
import { FormStepContext } from "./FormStepContext";
import "./FormContainer.css";

export interface StepConfig {
  id: string;
  title: string;
  description?: string;
  fields: readonly FieldName[];
  isFieldVisible?: (fieldName: FieldName, data: FormData) => boolean;
  component: React.ComponentType<{
    stepConfig: StepConfig;
    form: UseFormReturn<any>;
  }>;
}

export interface FormContainerProps {
  /** The title of the form. */
  title: string;

  /** An optional description to provide more context. */
  description?: string;

  /** Children to display on the title step. */
  children?: React.ReactNode;

  /** The form steps to render. */
  steps: readonly StepConfig[];

  /** The form instance from react-hook-form's useForm hook. */
  form: UseFormReturn<any>;

  /** Submit handler for the final form submission. Can be async. */
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;

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
  form,
  onSubmit,
  updatedAt,
  pdfs,
  costs,
}: FormContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Navigation index: -1 = title step, 0 to steps.length-1 = actual steps, steps.length = review
  // Always initialize to -1 for SSR consistency, then sync from hash in useEffect
  const [navigationIndex, setNavigationIndex] = useState(-1);

  // Track reviewing mode state
  const [isReviewingMode, setIsReviewingMode] = useState(false);

  const scrollToFormTop = useCallback(() => {
    containerRef.current?.scrollIntoView({ block: "start" });
  }, []);

  const focusStepContent = useCallback(() => {
    // Small delay to ensure DOM has updated after step change
    requestAnimationFrame(() => {
      // Focus on the form element for screen reader accessibility
      const stepForm = containerRef.current?.querySelector(
        ".form-step",
      ) as HTMLElement | null;

      if (stepForm) {
        stepForm.focus({ preventScroll: true });
      }
    });
  }, []);

  // Sync step with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove #

      // Update reviewing mode based on hash
      setIsReviewingMode(hash.includes("?reviewing=true"));

      // If no hash, go to title step
      if (!hash) {
        setNavigationIndex(-1);
        return;
      }

      // Parse hash to separate step ID from query params (e.g., "new-name?reviewing=true")
      const [stepId] = hash.split("?");

      // Check if it's the review step
      if (stepId === "review") {
        setNavigationIndex(steps.length);
        return;
      }

      // Find the step in the actual steps array
      const stepIndex = steps.findIndex((step) => step.id === stepId);
      if (stepIndex !== -1) {
        setNavigationIndex(stepIndex);
        focusStepContent();
      }
    };

    // Set initial step from hash
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [steps, focusStepContent]);

  // Update hash when navigation changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    let targetHash = "";

    if (navigationIndex === -1) {
      // Title step - no hash
      targetHash = "";
    } else if (navigationIndex === steps.length) {
      // Review step
      targetHash = "#review";
    } else if (navigationIndex >= 0 && navigationIndex < steps.length) {
      // Actual step - preserve reviewing query param if present
      const currentHash = window.location.hash.slice(1);
      const hasReviewingParam = currentHash.includes("?reviewing=true");
      targetHash = `#${steps[navigationIndex].id}${hasReviewingParam ? "?reviewing=true" : ""}`;
    }

    const currentPath = window.location.pathname + window.location.search;
    const targetUrl = currentPath + targetHash;

    if (window.location.href !== window.location.origin + targetUrl) {
      window.history.pushState(null, "", targetUrl);
    }
  }, [navigationIndex, steps]);

  const goToNextStep = useCallback(() => {
    // Can go through all steps (0 to steps.length-1) to review (steps.length)
    if (navigationIndex < steps.length) {
      setNavigationIndex(navigationIndex + 1);
    }

    // Clear reviewing mode when using navigation buttons
    if (typeof window !== "undefined") {
      const hash = window.location.hash.slice(1);
      if (hash.includes("?reviewing=true")) {
        const nextStepId =
          navigationIndex + 1 < steps.length
            ? steps[navigationIndex + 1].id
            : "review";
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}#${nextStepId}`,
        );
      }
    }

    scrollToFormTop();
  }, [navigationIndex, steps, scrollToFormTop]);

  const goToPreviousStep = useCallback(() => {
    // Can go back from review (steps.length) through all steps to title step (-1)
    if (navigationIndex > -1) {
      setNavigationIndex(navigationIndex - 1);
    }

    // Clear reviewing mode when using navigation buttons
    if (typeof window !== "undefined") {
      const hash = window.location.hash.slice(1);
      if (hash.includes("?reviewing=true")) {
        const prevStepId =
          navigationIndex - 1 >= 0
            ? (steps[navigationIndex - 1]?.id ?? steps[0].id)
            : "";
        const targetUrl = prevStepId
          ? `${window.location.pathname}${window.location.search}#${prevStepId}`
          : `${window.location.pathname}${window.location.search}`;
        window.history.replaceState(null, "", targetUrl);
      }
    }

    scrollToFormTop();
  }, [navigationIndex, steps, scrollToFormTop]);

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (navigationIndex === steps.length) {
        // On the review step, trigger the actual form submission
        try {
          await onSubmit(e);
          // Redirect to success page after successful submission
          if (typeof window !== "undefined") {
            window.location.href = "/forms/done";
          }
        } catch (error) {
          // If submission fails, stay on the review page
          console.error("Form submission failed:", error);
          // TODO: Show error message to user
        }
      } else {
        // Otherwise, just go to the next step (which handles scrolling)
        goToNextStep();
        focusStepContent();
      }
    },
    [navigationIndex, steps.length, onSubmit, goToNextStep, focusStepContent],
  );

  // Memoize the current step component to prevent unnecessary recreations
  const currentStepComponent = useMemo(() => {
    if (navigationIndex === -1) {
      // Title step
      return (
        <FormTitleStep
          title={title}
          description={description}
          pdfs={pdfs ?? []}
          updatedAt={updatedAt ?? ""}
          totalSteps={steps.length}
          onStart={() => {
            // Navigate to first step
            if (typeof window !== "undefined" && steps.length > 0) {
              window.location.hash = steps[0].id;
            }
          }}
        >
          {children}
        </FormTitleStep>
      );
    }

    if (navigationIndex === steps.length) {
      return <FormReviewStep steps={steps} />;
    }

    if (navigationIndex >= 0 && navigationIndex < steps.length) {
      const StepComponent = steps[navigationIndex].component;
      const stepConfig = steps[navigationIndex];
      return <StepComponent stepConfig={stepConfig} form={form} />;
    }

    return null;
  }, [
    navigationIndex,
    steps,
    form,
    pdfs,
    updatedAt,
    title,
    description,
    children,
  ]);

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
      isReviewingMode,
      onSubmit: handleFormSubmit,
      costs,
    }),
    [
      goToNextStep,
      goToPreviousStep,
      title,
      description,
      currentStepIndex,
      steps.length,
      isReviewStep,
      isReviewingMode,
      handleFormSubmit,
      costs,
    ],
  );

  const showNavigation = navigationIndex !== -1; // Hide navigation on title step

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
