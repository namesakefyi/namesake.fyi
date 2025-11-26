import { NameField } from "~/components/react/forms";
import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function ParentTwoNameStep(_props: StepComponentProps) {
  return (
    <FormStep title="What is your father's (or second parent's) name?">
      <NameField type="fathersName" />
    </FormStep>
  );
}
