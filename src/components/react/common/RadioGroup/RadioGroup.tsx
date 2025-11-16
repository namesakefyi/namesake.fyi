"use client";
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps,
  type ValidationResult,
} from "react-aria-components";
import { Text } from "../Content";
import { FieldError, Label } from "../Form";
import "./RadioGroup.css";

export interface RadioGroupProps extends Omit<AriaRadioGroupProps, "children"> {
  children?: React.ReactNode;
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function RadioGroup({
  label,
  description,
  errorMessage,
  children,
  ...props
}: RadioGroupProps) {
  return (
    <AriaRadioGroup {...props}>
      <Label>{label}</Label>
      <div className="radio-items">{children}</div>
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </AriaRadioGroup>
  );
}

export function Radio(props: RadioProps) {
  return <AriaRadio {...props} />;
}
