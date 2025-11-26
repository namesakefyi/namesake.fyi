import clsx from "clsx";
import type { Ref } from "react";
import {
  TextField as AriaTextField,
  TextArea as AriaTextArea,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
  Text,
} from "react-aria-components";
import { FieldError, Label } from "~/components/react/common/Form";
import "./TextArea.css";

export interface TextAreaProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  ref?: Ref<HTMLTextAreaElement>;
}

export function TextArea({
  ref,
  label,
  description,
  errorMessage,
  className,
  ...props
}: TextAreaProps) {
  return (
    <AriaTextField className={clsx("namesake-text-area", className)} {...props}>
      {label && <Label>{label}</Label>}
      <AriaTextArea ref={ref} />
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
