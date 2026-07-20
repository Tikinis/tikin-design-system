import type * as React from "react";
export interface PrimaryProps {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  leftIcon?: boolean;
  state?: "default" | "hover" | "pressed" | "loading" | "disabled";
  size?: "xs" | "s" | "m" | "l";
  rightIcon?: boolean;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}
export declare const Primary: React.FC<PrimaryProps>;
export default Primary;
