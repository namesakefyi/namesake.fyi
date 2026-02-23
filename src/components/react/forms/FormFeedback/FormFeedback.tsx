import {
  RiArrowRightLine,
  RiCheckLine,
  RiThumbDownFill,
  RiThumbUpFill,
} from "@remixicon/react";
import { useActionState, useState } from "react";
import { Button } from "@/components/react/common/Button";
import { FieldError, Form, Label } from "@/components/react/common/Form";
import { TextArea } from "@/components/react/common/TextArea";
import { ToggleButton } from "@/components/react/common/ToggleButton";
import { ToggleButtonGroup } from "@/components/react/common/ToggleButtonGroup";
import {
  FORM_FEEDBACK_SENTIMENT,
  type FormFeedbackSentiment,
  type FormSlug,
} from "@/constants/forms";
import "./FormFeedback.css";

interface FormFeedbackProps {
  formSlug: FormSlug;
}

type SubmitState = "idle" | "success" | "error";

export function FormFeedback({ formSlug }: FormFeedbackProps) {
  const [sentiment, setSentiment] = useState<FormFeedbackSentiment | null>(
    null,
  );

  const [state, submitAction, isPending] = useActionState(
    async (_prev: SubmitState, formData: FormData) => {
      if (!sentiment) return "idle";

      const comment = formData.get("comment") as string | null;

      try {
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            form_slug: formSlug,
            sentiment,
            comment: comment?.trim() || undefined,
          }),
        });

        if (!response.ok) throw new Error("Request failed");
        return "success";
      } catch {
        return "error";
      }
    },
    "idle",
  );

  if (state === "success") {
    return (
      <div className="form-feedback-success">
        <RiCheckLine size={24} aria-hidden />
        <p>Thank you for your feedback!</p>
      </div>
    );
  }

  return (
    <Form className="form-feedback" action={submitAction}>
      <div className="form-feedback-rating">
        <Label id="form-rating-label">
          How easy was it to complete this form?
        </Label>
        <ToggleButtonGroup
          selectionMode="single"
          selectedKeys={sentiment ? new Set([sentiment]) : new Set()}
          onSelectionChange={(keys) => {
            const key = [...keys][0] as FormFeedbackSentiment | undefined;
            setSentiment(key ?? null);
          }}
          aria-labelledby="form-rating-label"
          className="form-feedback-rating-buttons"
        >
          <ToggleButton id="positive">
            <RiThumbUpFill size={20} aria-hidden />
            {FORM_FEEDBACK_SENTIMENT.positive}
          </ToggleButton>
          <ToggleButton id="negative">
            <RiThumbDownFill size={20} aria-hidden />
            {FORM_FEEDBACK_SENTIMENT.negative}
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <TextArea name="comment" label="Please share any other feedback." />
      {state === "error" && (
        <FieldError>Something went wrong. Please try again.</FieldError>
      )}
      <Button
        type="submit"
        variant="primary"
        endIcon={RiArrowRightLine}
        isPending={isPending}
        isDisabled={!sentiment || isPending}
      >
        Submit
      </Button>
    </Form>
  );
}
