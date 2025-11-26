import { Banner } from "~/components/react/common/Banner";
import {
  FormStep,
  type StepComponentProps,
  YesNoField,
} from "~/components/react/forms";

export function EthnicityStep(_props: StepComponentProps) {
  return (
    <FormStep
      title="What is your ethnicity?"
      description="This response is optional and does not affect your application."
    >
      <YesNoField
        name="isHispanicOrLatino"
        label="Ethnicity"
        yesLabel="I am Hispanic or Latino"
        noLabel="I am not Hispanic or Latino"
        includePreferNotToAnswer
      />
      <Banner variant="info">
        The Social Security Administration requests this information for
        research and statistical purposes.
      </Banner>
    </FormStep>
  );
}
