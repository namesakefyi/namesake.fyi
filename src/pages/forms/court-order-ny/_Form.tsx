import { PortableText, type PortableTextProps } from "@portabletext/react";
import { RiMegaphoneLine } from "@remixicon/react";
import { Banner } from "@/components/react/common/Banner";
import { FormContainer } from "@/components/react/forms/FormContainer";
import type { FieldType } from "@/constants/fields";
import { createFormSubmitHandler } from "@/forms/createFormSubmitHandler";
import type { FormPdfMetadata } from "@/forms/getFormPdfMetadata";
import { useFormData } from "@/forms/useFormData";
import type { Cost } from "@/utils/formatTotalCosts";
import { courtOrderNyConfig } from "./config";

type FormData = {
  [K in (typeof courtOrderNyConfig.fields)[number]]: FieldType<K>;
};

export function NyCourtOrderForm({
  title,
  description,
  banner,
  updatedAt,
  pdfs,
  costs,
}: {
  title: string;
  description: string;
  banner?: PortableTextProps["value"];
  updatedAt?: string;
  pdfs?: FormPdfMetadata[];
  costs?: Cost[];
}) {
  const form = useFormData<FormData>(courtOrderNyConfig.fields);

  const handleSubmit = createFormSubmitHandler(courtOrderNyConfig, form);

  return (
    <FormContainer
      title={title}
      description={description}
      steps={courtOrderNyConfig.steps}
      machine={courtOrderNyConfig.machine}
      form={form}
      onSubmit={handleSubmit}
      updatedAt={updatedAt}
      pdfs={pdfs}
      costs={costs}
    >
      {banner && (
        <Banner icon={RiMegaphoneLine}>
          <PortableText value={banner} />
        </Banner>
      )}
    </FormContainer>
  );
}
