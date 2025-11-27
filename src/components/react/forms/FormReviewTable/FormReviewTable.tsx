import { useFormContext } from "react-hook-form";
import type { StepConfig } from "@/components/react/forms/FormContainer";
import { resolveVisibleFields } from "@/components/react/forms/FormContainer/resolveVisibleFields";
import type { FormData } from "@/constants/fields";
import { formatFieldValue, getFieldLabel } from "@/utils/formatReviewFields";
import "./FormReviewTable.css";
import { smartquotes } from "@/utils/smartquotes";

export interface FormReviewTableProps {
  steps: readonly StepConfig[];
}

interface ReviewField {
  fieldName: string;
  label: string;
  value: string | undefined;
}

interface ReviewSection {
  stepId: string;
  changeUrl: string;
  fields: ReviewField[];
}

export function FormReviewTable({ steps }: FormReviewTableProps) {
  const form = useFormContext();
  const formData = form.getValues() as FormData;

  // Get only the visible fields based on conditional logic
  const visibleFields = resolveVisibleFields(steps, formData);

  // Build grouped sections
  const sections: ReviewSection[] = [];

  steps.forEach((step) => {
    // Get fields for this step that are visible
    const stepFields = step.fields.filter(
      (fieldName) => fieldName in visibleFields,
    );

    // Skip steps with no visible fields
    if (stepFields.length === 0) {
      return;
    }

    const fields = stepFields.map((fieldName) => ({
      fieldName,
      label: smartquotes(getFieldLabel(fieldName)),
      value: formatFieldValue(fieldName, formData[fieldName]),
    }));

    sections.push({
      stepId: step.id,
      changeUrl: `#${step.id}?reviewing=true`,
      fields,
    });
  });

  return (
    <div className="form-review-sections">
      {sections.map((section) => (
        <section key={section.stepId} className="form-review-section">
          <dl className="form-review-list">
            {section.fields.map((field) => (
              <div key={field.fieldName} className="form-review-field">
                <dt className="form-review-label">{field.label}: </dt>
                <dd className="form-review-value">
                  {field.value !== undefined ? (
                    field.value
                  ) : (
                    <span className="form-review-no-response">Missing!</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <div className="form-review-section-action">
            <a href={section.changeUrl} className="form-review-change-link">
              Change
            </a>
          </div>
        </section>
      ))}
    </div>
  );
}
