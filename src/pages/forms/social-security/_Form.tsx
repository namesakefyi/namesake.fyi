import { FormContainer } from "@/components/react/forms/FormContainer";
import type { FieldType } from "@/constants/fields";
import { createFormSubmitHandler } from "@/utils/createFormSubmitHandler";
import type { FormPdfMetadata } from "@/utils/getFormPdfMetadata";
import { useForm } from "@/utils/useForm";
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
  const { onSubmit, ...form } = useForm<FormData>(socialSecurityConfig.fields);

  const handleSubmit = createFormSubmitHandler(
    socialSecurityConfig,
    form,
    onSubmit,
  );

  return (
    <FormContainer
      title={title}
      description={description}
      steps={socialSecurityConfig.steps}
      form={form}
      onSubmit={handleSubmit}
      updatedAt={updatedAt}
      pdfs={pdfs}
    />
  );
}
