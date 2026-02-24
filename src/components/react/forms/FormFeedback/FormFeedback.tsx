import {
  RiArrowRightLine,
  RiCheckLine,
  RiThumbDownFill,
  RiThumbUpFill,
} from "@remixicon/react";
import { useActionState } from "react";
import { Button } from "@/components/react/common/Button";
import { Form } from "@/components/react/common/Form";
import { Radio, RadioGroup } from "@/components/react/common/RadioGroup";
import { TextArea } from "@/components/react/common/TextArea";
import type { FormFeedbackSentiment, FormSlug } from "@/constants/forms";
import "./FormFeedback.css";
import { Banner } from "../../common/Banner";

interface FormFeedbackProps {
  formSlug: FormSlug;
}

type SubmitState = "idle" | "success" | "error";

export function FormFeedback({ formSlug }: FormFeedbackProps) {
  const [state, submitAction, isPending] = useActionState(
    async (_prev: SubmitState, formData: FormData) => {
      const sentiment = formData.get("sentiment") as FormFeedbackSentiment;
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
      <div className="form-feedback">
        <div className="form-feedback-success">
          <RiCheckLine size={32} aria-hidden />
          <div role="alert">Thank you for your feedback!</div>
        </div>
      </div>
    );
  }

  return (
    <Form className="form-feedback" action={submitAction}>
      <RadioGroup
        name="sentiment"
        isRequired
        label="Was it easy to complete this form?"
        orientation="horizontal"
        className="form-feedback-sentiment"
        errorMessage="Please select a rating."
      >
        <Radio
          value="positive"
          className="form-feedback-sentiment-option"
          aria-label="It was easy"
        >
          <RiThumbUpFill size={20} aria-hidden />
          <span aria-hidden="true">Easy</span>
        </Radio>
        <Radio
          value="negative"
          className="form-feedback-sentiment-option"
          aria-label="I had some problems"
        >
          <RiThumbDownFill size={20} aria-hidden />
          <span aria-hidden="true">Hmm&hellip;</span>
        </Radio>
      </RadioGroup>
      <TextArea
        name="comment"
        label="Please share any feedback."
        maxLength={1000}
      />
      {state === "error" && (
        <Banner variant="error">Something went wrong. Please try again.</Banner>
      )}
      <Button
        type="submit"
        variant="primary"
        endIcon={RiArrowRightLine}
        isPending={isPending}
      >
        Submit
      </Button>
    </Form>
  );
}
