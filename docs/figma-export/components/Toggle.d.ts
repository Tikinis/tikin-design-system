import type * as React from "react";
export interface ToggleProps {
  className?: string;
  style?: React.CSSProperties;
  state?: "default" | "disabled";
  size?: "l" | "m" | "s" | "xs";
  active?: "on" | "off";
}
export declare const Toggle: React.FC<ToggleProps>;
export default Toggle;
