import type * as React from "react";
export interface SecondaryProps {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  leftIcon?: boolean;
  state?: "default" | "pressed" | "disabled" | "hover" | "loading";
  size?: "xs" | "l" | "m" | "s";
  rightIcon?: boolean;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}
export declare const Secondary: React.FC<SecondaryProps>;
export default Secondary;
