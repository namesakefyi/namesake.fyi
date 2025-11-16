"use client";
import { RiArrowDownSLine } from "@remixicon/react";
import {
  ComboBox as AriaComboBox,
  type ComboBoxProps as AriaComboBoxProps,
  Input,
  type ListBoxItemProps,
  type ValidationResult,
} from "react-aria-components";
import { Text } from "../Content";
import { FieldButton, FieldError, Label } from "../Form";
import { ListBox, ListBoxItem } from "../ListBox";
import { Popover } from "../Popover";

import "./ComboBox.css";

export interface ComboBoxProps<T extends object>
  extends Omit<AriaComboBoxProps<T>, "children"> {
  label?: string;
  description?: string | null;
  errorMessage?: string | ((validation: ValidationResult) => string);
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

export function ComboBox<T extends object>({
  label,
  description,
  errorMessage,
  children,
  ...props
}: ComboBoxProps<T>) {
  return (
    <AriaComboBox {...props}>
      {({ isInvalid }) => (
        <>
          <Label>{label}</Label>
          <div className="my-combobox-container">
            <Input />
            <FieldButton>
              <RiArrowDownSLine size={16} />
            </FieldButton>
          </div>
          {description && !isInvalid && (
            <Text slot="description">{description}</Text>
          )}
          <FieldError>{errorMessage}</FieldError>
          <Popover hideArrow>
            <ListBox>{children}</ListBox>
          </Popover>
        </>
      )}
    </AriaComboBox>
  );
}

export function ComboBoxItem(props: ListBoxItemProps) {
  return <ListBoxItem {...props} />;
}
