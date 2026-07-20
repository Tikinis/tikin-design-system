import type * as React from "react";
export interface Primary2Props {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  leftIcon?: boolean;
  state?: "default" | "loading" | "disabled" | "hover" | "pressed";
  size?: "m" | "l" | "s" | "xs";
  rightIcon?: boolean;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}
export declare const Primary2: React.FC<Primary2Props>;
export default Primary2;
