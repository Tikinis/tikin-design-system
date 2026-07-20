import type * as React from "react";
export interface KeyboardOptionProps {
  className?: string;
  style?: React.CSSProperties;
  dark?: boolean;
  /** Text content; defaults to "Done". */
  text1?: string;
}
export declare const KeyboardOption: React.FC<KeyboardOptionProps>;
export default KeyboardOption;
