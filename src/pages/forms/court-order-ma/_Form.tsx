import { FormContainer } from "@/components/react/forms/FormContainer";
import type { FieldType } from "@/constants/fields";
import { createFormSubmitHandler } from "@/utils/createFormSubmitHandler";
import type { Cost } from "@/utils/formatTotalCosts";
import type { FormPdfMetadata } from "@/utils/getFormPdfMetadata";
import { useForm } from "@/utils/useForm";
import { courtOrderMaConfig } from "./config";
import { Banner } from "@/components/react/common/Banner";
import { Link } from "@/components/react/common/Link";
import { RiMegaphoneLine } from "@remixicon/react";

type FormData = {
  [K in (typeof courtOrderMaConfig.fields)[number]]: FieldType<K>;
};

export function MaCourtOrderForm({
  title,
  description,
  updatedAt,
  pdfs,
  costs,
}: {
  title: string;
  description: string;
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
      <Banner icon={RiMegaphoneLine}>
        Massachusetts no longer requires publishing name change in a newspaper
        as of November 26, 2025. All name change records will now be kept
        confidential without having to file additional paperwork.{" "}
        <a
          href="https://www.masstpc.org/name-change-bill-signed/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read more about the passage of MA Senate Bill 1045 and House Bill
          1673, "An Act Protecting Personal Security".
        </a>
      </Banner>
    </FormContainer>
  );
}
