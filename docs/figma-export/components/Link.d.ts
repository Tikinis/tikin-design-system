import type * as React from "react";
export interface LinkProps {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  state?: "deault" | "disabled" | "hover" | "pressed";
  size?: "s" | "l" | "m" | "xs";
  /** Text content; defaults to "Label". */
  text1?: string;
}
export declare const Link: React.FC<LinkProps>;
export default Link;
