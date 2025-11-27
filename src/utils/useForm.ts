import { useEffect, useMemo, useState } from "react";
import {
  type FieldValues,
  type Path,
  type PathValue,
  type UseFormProps,
  useForm as useReactHookForm,
} from "react-hook-form";
import type { FieldName } from "@/constants/fields";
import { getFieldsByNames, saveField } from "@/db/database";

export function useForm<TFieldValues extends FieldValues = FieldValues>(
  fields: FieldName[],
  options?: Omit<UseFormProps<TFieldValues>, "values" | "defaultValues">,
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fieldsList = useMemo(() => fields as string[], [fields]);

  const form = useReactHookForm<TFieldValues>({
    mode: "onBlur",
    ...options,
  });

  // Load saved field values from IndexedDB on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedFields = await getFieldsByNames(fieldsList);

        for (const { field, value } of savedFields) {
          form.setValue(
            field as Path<TFieldValues>,
            value as PathValue<TFieldValues, Path<TFieldValues>>,
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

  // Auto-save fields on change
  useEffect(() => {
    const subscription = form.watch(async (value, { name }) => {
      if (!name || isSubmitting || isLoading) return;

      const fieldValue = value[name];

      // Only save non-empty values
      if (
        fieldValue !== "" &&
        fieldValue !== null &&
        fieldValue !== undefined
      ) {
        try {
          await saveField(name, fieldValue);
        } catch (error) {
          console.error(`Error saving field ${name}:`, error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, isSubmitting, isLoading]);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);

      const entries = Object.entries(data).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined,
      );

      for (const [field, value] of entries) {
        await saveField(field, value);
      }
    } catch (error) {
      console.error("Error saving form data:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  });

  return {
    ...form,
    onSubmit,
    isSubmitting,
    isLoading,
  };
}
