import type * as React from "react";
export interface KeySecondaryProps {
  className?: string;
  style?: React.CSSProperties;
  icon?: "on" | "off";
  dark?: "off" | "on";
  /** Text content; defaults to "123". */
  text1?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}
export declare const KeySecondary: React.FC<KeySecondaryProps>;
export default KeySecondary;
