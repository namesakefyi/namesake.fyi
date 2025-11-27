import { Controller, useFormContext } from "react-hook-form";
import {
  TextField,
  type TextFieldProps,
} from "@/components/react/common/TextField";
import type { FieldName } from "@/constants/fields";
import { smartquotes } from "@/utils/smartquotes";
import "./ShortTextField.css";

export interface ShortTextFieldProps extends Omit<TextFieldProps, "size"> {
  label: string;
  name: FieldName;
  children?: React.ReactNode;
}

export function ShortTextField({
  label,
  name,
  children,
  defaultValue,
  ...props
}: ShortTextFieldProps) {
  const { control } = useFormContext();

  return (
    <div className="namesake-short-text-field">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? ""}
        render={({ field, fieldState: { invalid, error } }) => (
          <TextField
            {...field}
            label={smartquotes(label)}
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
