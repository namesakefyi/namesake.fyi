import { useFormContext } from "react-hook-form";
import { Banner } from "@/components/react/common/Banner";
import { FormStep } from "@/components/react/forms/FormStep";
import { YesNoField } from "@/components/react/forms/YesNoField";

export function ReturnDocumentsStep() {
  const form = useFormContext();

  return (
    <FormStep title="Do you want your original documents returned afterwards?">
      <YesNoField
        name="shouldReturnOriginalDocuments"
        label="Return original documents?"
        labelHidden
        yesLabel="Yes, return my documents"
        noLabel="No, I don't need my documents returned"
      />
      {form.watch("shouldReturnOriginalDocuments") === false && (
        <Banner variant="warning">
          We strongly recommend getting your original documents back from the
          court.
        </Banner>
      )}
    </FormStep>
  );
}
