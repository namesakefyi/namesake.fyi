import { NameField } from "~/components/react/forms";
import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";
import { Banner } from "~/components/react/common/Banner";

export function ParentOneNameStep(_props: StepComponentProps) {
  return (
    <FormStep title="What is your mother's (or first parent's) name?">
      <NameField type="mothersName" />
      <Banner variant="info">
        Use your parent's name at their birth, before marriage. This is also
        known as a maiden name.
      </Banner>
    </FormStep>
  );
}
