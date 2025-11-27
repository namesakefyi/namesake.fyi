import {
  Button,
  type ButtonProps,
  type FieldErrorProps,
  type FormProps,
  type LabelProps,
  FieldError as RACFieldError,
  Form as RACForm,
  Label as RACLabel,
} from "react-aria-components";
import "./Form.css";
import type { Ref } from "react";

export function Form({
  ref,
  ...props
}: FormProps & { ref?: Ref<HTMLFormElement> }) {
  return <RACForm ref={ref} {...props} />;
}

export function Label(props: LabelProps) {
  return <RACLabel {...props} />;
}

export function FieldError(props: FieldErrorProps) {
  return <RACFieldError {...props} />;
}

export function FieldButton(props: ButtonProps) {
  return <Button className="namesake-field-button" {...props} />;
}
