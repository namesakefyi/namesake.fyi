import { type MaskitoOptions, maskitoTransform } from "@maskito/core";
import { Controller, useFormContext } from "react-hook-form";
import {
  TextField,
  type TextFieldProps,
} from "@/components/react/common/TextField";
import type { FieldName } from "@/constants/fields";
import "./PhoneField.css";

export interface PhoneFieldProps extends Omit<TextFieldProps, "size"> {
  name: FieldName;
  children?: React.ReactNode;
}

export function PhoneField({
  children,
  name,
  defaultValue,
  ...props
}: PhoneFieldProps) {
  const { control } = useFormContext();

  const maskitoOptions: MaskitoOptions = {
    mask: [
      "+",
      "1",
      " ",
      "(",
      /\d/,
      /\d/,
      /\d/,
      ")",
      " ",
      /\d/,
      /\d/,
      /\d/,
      "-",
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ],
  };

  return (
    <div className="namesake-phone-field">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? ""}
        render={({ field, fieldState: { invalid, error } }) => (
          <TextField
            {...field}
            label="Phone number"
            type="tel"
            autoComplete="tel"
            className="phone-number-input"
            onChange={(value) => {
              const transformedValue = maskitoTransform(value, maskitoOptions);
              field.onChange(transformedValue);
            }}
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
