"use client";

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

export function Form(props: FormProps) {
  return <RACForm {...props} />;
}

export function Label(props: LabelProps) {
  return <RACLabel {...props} />;
}

export function FieldError(props: FieldErrorProps) {
  return <RACFieldError {...props} />;
}

export function FieldButton(props: ButtonProps) {
  return <Button {...props} className="field-Button" />;
}
