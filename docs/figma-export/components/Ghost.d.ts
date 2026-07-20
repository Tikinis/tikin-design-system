import type * as React from "react";
export interface GhostProps {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  state?: "deault" | "hover" | "pressed" | "disabled";
  leftIcon?: boolean;
  size?: "xs" | "l" | "m" | "s";
  rightIcon?: boolean;
}
export declare const Ghost: React.FC<GhostProps>;
export default Ghost;
