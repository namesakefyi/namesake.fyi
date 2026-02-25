import { FormContainer } from "@/components/react/forms/FormContainer";
import type { FieldType } from "@/constants/fields";
import { createFormSubmitHandler } from "@/forms/createFormSubmitHandler";
import type { FormPdfMetadata } from "@/forms/getFormPdfMetadata";
import { useFormData } from "@/forms/useFormData";
import { socialSecurityConfig } from "./config";

type FormData = {
  [K in (typeof socialSecurityConfig.fields)[number]]: FieldType<K>;
};

export function SocialSecurityForm({
  title,
  description,
  updatedAt,
  pdfs,
}: {
  title: string;
  description: string;
  updatedAt?: string;
  pdfs?: FormPdfMetadata[];
}) {
  const form = useFormData<FormData>(socialSecurityConfig.fields);

  const handleSubmit = createFormSubmitHandler(socialSecurityConfig, form);

  return (
    <FormContainer
      title={title}
      description={description}
      steps={socialSecurityConfig.steps}
      machine={socialSecurityConfig.machine}
      form={form}
      onSubmit={handleSubmit}
      updatedAt={updatedAt}
      pdfs={pdfs}
    />
  );
}
