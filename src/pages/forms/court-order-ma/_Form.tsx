import { RiMegaphoneLine } from "@remixicon/react";
import { Banner } from "@/components/react/common/Banner";
import { FormContainer } from "@/components/react/forms/FormContainer";
import type { FieldType } from "@/constants/fields";
import { createFormSubmitHandler } from "@/utils/createFormSubmitHandler";
import type { Cost } from "@/utils/formatTotalCosts";
import type { FormPdfMetadata } from "@/utils/getFormPdfMetadata";
import { useForm } from "@/utils/useForm";
import { courtOrderMaConfig } from "./config";
import { PortableText, type PortableTextProps } from "@portabletext/react";

type FormData = {
  [K in (typeof courtOrderMaConfig.fields)[number]]: FieldType<K>;
};

export function MaCourtOrderForm({
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
