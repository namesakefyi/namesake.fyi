import { useEffect, useMemo, useState } from "react";
import {
  type Path,
  type PathValue,
  type UseFormProps,
  useForm,
} from "react-hook-form";
import type { Form, FormDataOf } from "@/constants/forms";
import { deleteField, getFieldsByNames, saveField } from "@/db/database";
import { getFormFields } from "./formVisibility";

export function useFormData<T extends Form>(
  config: T,
  options?: Omit<
    UseFormProps<Partial<FormDataOf<T>>>,
    "values" | "defaultValues"
  >,
) {
  const [isLoading, setIsLoading] = useState(true);
  const fieldsList = useMemo(
    () => [...getFormFields(config.steps)] as string[],
    [config.steps],
  );

  type FormValues = Partial<FormDataOf<T>>;
  const form = useForm<FormValues>({
    mode: "onBlur",
    ...options,
  });

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedFields = await getFieldsByNames(fieldsList);

        for (const { field, value } of savedFields) {
          form.setValue(
            field as Path<FormValues>,
            value as PathValue<FormValues, Path<FormValues>>,
            {
              shouldDirty: false,
            },
          );
        }
      } catch (error) {
        console.error("Error loading saved form data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedData();
  }, [fieldsList, form]);

  useEffect(() => {
    const subscription = form.watch(async (value, { name }) => {
      if (!name || isLoading) return;

      const fieldValue = (value as Record<string, unknown>)[name];

      if (fieldValue === undefined) return;

      try {
        if (
          fieldValue === null ||
          fieldValue === "" ||
          (Array.isArray(fieldValue) && fieldValue.length === 0)
        ) {
          await deleteField(name);
        } else {
          await saveField(name, fieldValue);
        }
      } catch (error) {
        console.error(`Error saving field ${name}:`, error);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, isLoading]);

  return {
    ...form,
    isLoading,
  };
}
