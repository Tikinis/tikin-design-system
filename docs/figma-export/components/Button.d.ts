import type * as React from "react";
export interface ButtonProps {
  className?: string;
  style?: React.CSSProperties;
  text?: string;
  iconRight?: boolean;
  variant?: "primary" | "secondary";
  iconValue?: React.ReactNode;
  state?: "default" | "disable";
  size?: "m";
}
export declare const Button: React.FC<ButtonProps>;
export default Button;
