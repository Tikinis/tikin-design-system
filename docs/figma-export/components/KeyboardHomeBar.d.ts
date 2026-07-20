import type * as React from "react";
export interface KeyboardHomeBarProps {
  className?: string;
  style?: React.CSSProperties;
  dark?: "off" | "on";
  iconLeft?: boolean;
  iconRight?: boolean;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon2?: React.ReactNode;
}
export declare const KeyboardHomeBar: React.FC<KeyboardHomeBarProps>;
export default KeyboardHomeBar;
