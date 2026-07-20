import type * as React from "react";
export interface KeyboardDefaultProps {
  className?: string;
  style?: React.CSSProperties;
  option?: boolean;
  dark?: "off" | "on";
  suggestion?: boolean;
}
export declare const KeyboardDefault: React.FC<KeyboardDefaultProps>;
export default KeyboardDefault;
