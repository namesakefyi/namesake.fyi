import type { Migration } from "../types";
import { migration as createFormFields } from "./001-create-form-fields";
import { migration as renameFormFieldsToFormData } from "./002-rename-form-fields-to-form-data";

export const migrations: Migration[] = [
  createFormFields,
  renameFormFieldsToFormData,
];
