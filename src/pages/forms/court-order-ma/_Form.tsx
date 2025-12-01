import { FormContainer } from "@/components/react/forms/FormContainer";
import type { FieldType } from "@/constants/fields";
import { createFormSubmitHandler } from "@/utils/createFormSubmitHandler";
import type { FormPdfMetadata } from "@/utils/getFormPdfMetadata";
import { useForm } from "@/utils/useForm";
import { courtOrderMaConfig } from "./config";

type FormData = {
  [K in (typeof courtOrderMaConfig.fields)[number]]: FieldType<K>;
};

export function MaCourtOrderForm({
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
  const { ...form } = useForm<FormData>(courtOrderMaConfig.fields);

  const handleSubmit = createFormSubmitHandler(courtOrderMaConfig, form);

  return (
    <FormContainer
      title={title}
      description={description}
      steps={courtOrderMaConfig.steps}
      form={form}
      onSubmit={handleSubmit}
      updatedAt={updatedAt}
      pdfs={pdfs}
    />
  );
}
