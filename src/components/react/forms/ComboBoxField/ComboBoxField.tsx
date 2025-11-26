import { Controller, useFormContext } from "react-hook-form";
import { ComboBox, ComboBoxItem } from "@/components/react/common/ComboBox";
import type { FieldName } from "@/constants/fields";
import { smartquotes } from "@/utils/smartquotes";
import "./ComboBoxField.css";

export interface ComboBoxFieldProps {
  label: string;
  name: FieldName;
  placeholder?: string;
  children?: React.ReactNode;
  defaultValue?: string;
  options: {
    label: string;
    value: string;
  }[];
}

export function ComboBoxField({
  label,
  name,
  placeholder,
  children,
  defaultValue,
  options,
  ...props
}: ComboBoxFieldProps) {
  const { control } = useFormContext();

  return (
    <div className="namesake-combobox-field">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? null}
        shouldUnregister={true}
        render={({ field, fieldState: { invalid, error } }) => (
          <ComboBox
            {...field}
            label={smartquotes(label)}
            placeholder={placeholder}
            selectedKey={field.value}
            onSelectionChange={(key) => {
              field.onChange(key);
            }}
            isInvalid={invalid}
            errorMessage={error?.message}
            {...props}
          >
            {options.map(({ label, value }) => (
              <ComboBoxItem key={value} id={value} textValue={label}>
                {label}
              </ComboBoxItem>
            ))}
          </ComboBox>
        )}
      />
      {children}
    </div>
  );
}
