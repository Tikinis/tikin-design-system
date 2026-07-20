import type * as React from "react";
export interface KeyLetterProps {
  className?: string;
  style?: React.CSSProperties;
  lowercase?: "on" | "off";
  dark?: "on" | "off";
  /** Text content; defaults to "Q". */
  text1?: string;
}
export declare const KeyLetter: React.FC<KeyLetterProps>;
export default KeyLetter;
