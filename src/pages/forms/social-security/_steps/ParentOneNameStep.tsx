import { Banner } from "@/components/react/common/Banner";
import { FormStep } from "@/components/react/forms/FormStep";
import { NameField } from "@/components/react/forms/NameField";

export function ParentOneNameStep() {
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
