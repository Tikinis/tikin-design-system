import type * as React from "react";
export interface KeyGoProps {
  className?: string;
  style?: React.CSSProperties;
  active?: "on" | "off";
  dark?: "off" | "on";
  /** Text content; defaults to "go". */
  text1?: string;
}
export declare const KeyGo: React.FC<KeyGoProps>;
export default KeyGo;
