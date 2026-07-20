import type * as React from "react";
export interface TextFieldProps {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  state?: "deafult" | "pressed" | "active" | "disabled";
  placeholder?: string;
  feedback?: "default" | "success" | "error";
  error?: string;
  showIcon?: boolean;
  size?: "xs" | "s" | "m" | "l";
  /** Text content; defaults to "|". */
  text1?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}
export declare const TextField: React.FC<TextFieldProps>;
export default TextField;
