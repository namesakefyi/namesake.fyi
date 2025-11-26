import { useState } from "react";
import type { DateValue } from "react-aria-components";
import { Controller, useFormContext } from "react-hook-form";
import {
  DateField,
  type DateFieldProps,
} from "@/components/react/common/DateField";
import type { FieldName } from "@/constants/fields";
import "./MemorableDateField.css";

export interface MemorableDateFieldProps<T extends DateValue = DateValue>
  extends DateFieldProps<T> {
  label: string;
  name: FieldName;
  children?: React.ReactNode;
}

export function MemorableDateField<T extends DateValue>({
  children,
  label,
  name,
  defaultValue,
  ...props
}: MemorableDateFieldProps<T>) {
  const { control } = useFormContext();
  const [date, setDate] = useState<DateValue | null>(null);

  return (
    <div className="namesake-memorable-date-field">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? null}
        shouldUnregister={true}
        render={({
          field: { onChange, ...field },
          fieldState: { invalid, error },
        }) => (
          <DateField
            {...field}
            value={date as T}
            onChange={(date) => {
              setDate(date);
              onChange(date?.toString());
              props.onChange?.(date);
            }}
            label={label}
            className="w-fit"
            isInvalid={invalid}
            errorMessage={error?.message}
            {...props}
          />
        )}
      />
      {children}
    </div>
  );
}
