import type * as React from "react";
export interface KeyShiftProps {
  className?: string;
  style?: React.CSSProperties;
  lowercase?: "off" | "on";
  dark?: "off" | "on";
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}
export declare const KeyShift: React.FC<KeyShiftProps>;
export default KeyShift;
