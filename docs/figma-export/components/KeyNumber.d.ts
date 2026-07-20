import type * as React from "react";
export interface KeyNumberProps {
  className?: string;
  style?: React.CSSProperties;
  type?: "decimal" | "tel" | "placeholder";
  dark?: "off" | "on";
}
export declare const KeyNumber: React.FC<KeyNumberProps>;
export default KeyNumber;
