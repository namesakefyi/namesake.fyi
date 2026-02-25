import {
  RiArrowRightLine,
  RiHeart3Line,
  RiThumbDownFill,
  RiThumbUpFill,
} from "@remixicon/react";
import { useActionState } from "react";
import { Button } from "@/components/react/common/Button";
import { Form } from "@/components/react/common/Form";
import { Radio, RadioGroup } from "@/components/react/common/RadioGroup";
import { TextArea } from "@/components/react/common/TextArea";
import type { FormFeedbackSentiment } from "@/constants/forms";
import "./FormFeedback.css";
import { Banner } from "../../common/Banner";
import { Heading } from "../../common/Content";

interface FormFeedbackProps {
  formSlug: string;
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
          <RiHeart3Line size={32} aria-hidden />
          <div role="alert">
            <strong>Thank you for your feedback!</strong>
            <p>
              Good luck submitting your name change paperwork. If this form
              helped you, consider{" "}
              <a href="https://namesake.fyi/donate">
                donating to support our work
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form className="form-feedback" action={submitAction}>
      <Heading level={2} className="form-feedback-title">
        Help improve Namesake for others
      </Heading>
      <RadioGroup
        name="sentiment"
        isRequired
        orientation="horizontal"
        className="form-feedback-sentiment"
        errorMessage="Please select a rating."
        label="Was it easy to complete this form?"
      >
        <Radio value="positive" className="form-feedback-sentiment-option">
          <RiThumbUpFill size={24} aria-hidden />
          It was easy
        </Radio>
        <Radio value="negative" className="form-feedback-sentiment-option">
          <RiThumbDownFill size={24} aria-hidden />
          Had some problems
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
