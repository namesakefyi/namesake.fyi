import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createActor } from "xstate";
import { getFormProgress, saveFormProgress } from "@/db/database";
import {
  type FormMachine,
  findNextStepIndex,
  findPrevStepIndex,
  getPhase,
  getVisibleStepIds,
} from "@/forms/createFormMachine";
import type { FormMachineContext, FormPhase, Step } from "@/forms/types";

type FormActor = ReturnType<typeof createActor<FormMachine>>;
type FormSnapshot = ReturnType<FormActor["getSnapshot"]>;

export interface UseFormStateReturn {
  /** Whether the hook is still loading persisted state from IndexedDB. */
  isLoading: boolean;
  /** The current top-level machine phase (title, filling, review, etc.). */
  phase: FormPhase;
  /** Send an event to the machine. */
  send: FormActor["send"];
  /** The active step (for filling/editing phases), or null. */
  activeStep: Step | null;
  /** The active step ID, or null. */
  activeStepId: string | null;
  /** 1-based index of the current step among visible steps (0 for title/review). */
  currentStepIndex: number;
  /** Total number of visible form steps. */
  totalSteps: number;
  /** All steps. */
  steps: readonly Step[];
  /** Navigate forward, evaluating guards with live form data. */
  goNext: () => void;
  /** Navigate backward, evaluating guards with live form data. */
  goBack: () => void;
}

export function useFormState(
  machine: FormMachine,
  steps: readonly Step[],
  getFormData: () => Record<string, any>,
): UseFormStateReturn {
  const formSlug = machine.id;

  const [savedSnapshot, setSavedSnapshot] = useState<unknown>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof indexedDB === "undefined") {
      setIsLoading(false);
      return;
    }

    getFormProgress(formSlug)
      .then((snapshot) => {
        if (snapshot) setSavedSnapshot(snapshot);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [formSlug]);

  const actorRef = useRef<FormActor | null>(null);
  const [state, setState] = useState<FormSnapshot | null>(null);

  useEffect(() => {
    if (isLoading) return;

    const actor = createActor(machine, {
      ...(savedSnapshot ? { snapshot: savedSnapshot as any } : {}),
    });

    actorRef.current = actor;

    const subscription = actor.subscribe((snapshot) => {
      setState(snapshot);

      if (typeof indexedDB === "undefined") return;

      const slug = (snapshot.context as FormMachineContext).formSlug;

      saveFormProgress(slug, actor.getPersistedSnapshot()).catch(() => {});
    });

    actor.start();
    setState(actor.getSnapshot());

    if (typeof indexedDB !== "undefined") {
      saveFormProgress(formSlug, actor.getPersistedSnapshot()).catch(() => {});
    }

    return () => {
      subscription.unsubscribe();
      actor.stop();
      actorRef.current = null;
    };
  }, [isLoading, savedSnapshot, machine, formSlug]);

  const send: FormActor["send"] = useCallback((event) => {
    actorRef.current?.send(event);
  }, []);

  const context = state?.context as FormMachineContext | undefined;
  const phase = state ? getPhase(state.value) : "title";

  const activeStepId =
    phase === "editing"
      ? (context?.editingStepId ?? null)
      : (context?.currentStepId ?? null);

  const activeStep = activeStepId
    ? (steps.find((s) => s.id === activeStepId) ?? null)
    : null;

  const formData = getFormData();
  const visibleStepIds = useMemo(
    () => getVisibleStepIds(steps, formData),
    [steps, formData],
  );

  const currentStepIndex = activeStepId
    ? visibleStepIds.indexOf(activeStepId) + 1
    : 0;

  const totalSteps = visibleStepIds.length;

  const goNext = useCallback(() => {
    const currentId = actorRef.current?.getSnapshot().context.currentStepId;
    if (!currentId) return;
    const currentIndex = steps.findIndex((s) => s.id === currentId);
    if (currentIndex === -1) return;

    const nextIndex = findNextStepIndex(steps, currentIndex, getFormData());
    if (nextIndex === -1) {
      send({ type: "GOTO_REVIEW" });
    } else {
      send({ type: "GOTO_STEP", stepId: steps[nextIndex].id });
    }
  }, [steps, getFormData, send]);

  const goBack = useCallback(() => {
    const snapshot = actorRef.current?.getSnapshot();
    if (!snapshot) return;
    const currentId = snapshot.context.currentStepId;
    if (!currentId) return;

    // From review, return to the last filling step
    if (snapshot.value === "review") {
      send({ type: "GOTO_STEP", stepId: currentId });
      return;
    }

    const currentIndex = steps.findIndex((s) => s.id === currentId);
    if (currentIndex === -1) return;

    const prevIndex = findPrevStepIndex(steps, currentIndex, getFormData());
    if (prevIndex === -1) {
      send({ type: "GOTO_TITLE" });
    } else {
      send({ type: "GOTO_STEP", stepId: steps[prevIndex].id });
    }
  }, [steps, getFormData, send]);

  return {
    isLoading,
    phase,
    send,
    activeStep,
    activeStepId,
    currentStepIndex,
    totalSteps,
    steps,
    goNext,
    goBack,
  };
}
