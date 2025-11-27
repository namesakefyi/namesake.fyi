import { Controller, useFormContext } from "react-hook-form";
import {
  TextField,
  type TextFieldProps,
} from "@/components/react/common/TextField";
import type { FieldName } from "@/constants/fields";
import "./EmailField.css";

export interface EmailFieldProps extends Omit<TextFieldProps, "size"> {
  name: FieldName;
  children?: React.ReactNode;
}

export function EmailField({
  children,
  name,
  defaultValue,
  ...props
}: EmailFieldProps) {
  const { control } = useFormContext();

  return (
    <div className="namesake-email-field">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? ""}
        render={({ field, fieldState: { invalid, error } }) => (
          <TextField
            {...field}
            label="Email address"
            type="email"
            autoComplete="email"
            size={32}
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
