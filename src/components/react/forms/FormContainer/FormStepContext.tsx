import { createContext, useContext } from "react";

export interface FormStepContextValue {
  onNext: () => void;
  onBack: () => void;
  /** The title of the form */
  formTitle: string;
  /** The description of the form */
  formDescription?: string;
  /** The current step index (1-based for actual form steps, 0 for title/review) */
  currentStepIndex: number;
  /** The total number of actual form steps (excludes title and review) */
  totalSteps: number;
  /** Whether the current step is the review step */
  isReviewStep: boolean;
  /** Whether the user is in reviewing mode (navigated from review page to edit a field) */
  isReviewingMode: boolean;
  /** Submit handler for form steps */
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const FormStepContext = createContext<FormStepContextValue | null>(null);

export function useFormStep() {
  const context = useContext(FormStepContext);
  if (!context) {
    throw new Error("useFormStep must be used within a FormContainer");
  }
  return context;
}
