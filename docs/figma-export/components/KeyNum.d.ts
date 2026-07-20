import type * as React from "react";
export interface KeyNumProps {
  className?: string;
  style?: React.CSSProperties;
  abc?: "on" | "off";
  dark?: "off" | "on";
  /** Text content; defaults to "2". */
  text1?: string;
}
export declare const KeyNum: React.FC<KeyNumProps>;
export default KeyNum;
