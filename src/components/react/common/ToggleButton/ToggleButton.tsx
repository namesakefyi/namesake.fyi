"use client";
import {
  ToggleButton as RACToggleButton,
  type ToggleButtonProps,
} from "react-aria-components";
import "./ToggleButton.css";

export function ToggleButton(props: ToggleButtonProps) {
  return <RACToggleButton {...props} />;
}
