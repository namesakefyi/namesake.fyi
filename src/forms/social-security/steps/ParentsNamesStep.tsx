import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function ParentsNamesStep(_props: StepComponentProps) {
  return (
    <FormStep title="What are your parents' names?">
      {/* TODO: Add section for mother's name */}
      {/* Description: "What is your mother's (or first parent's) name?" */}
      {/* Note: Use your parent's name at their birth, before marriage. This is also known as a maiden name. */}
      {/* TODO: Add NameField for mothersName */}

      {/* TODO: Add section for father's name */}
      {/* Description: "What is your father's (or second parent's) name?" */}
      {/* TODO: Add NameField for fathersName */}
    </FormStep>
  );
}
