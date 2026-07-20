import * as React from 'react';
export interface KeyPrimaryProps {
  className?: string;
  style?: React.CSSProperties;
  dark?: "off" | "on";
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}
export declare const KeyPrimary: React.FC<KeyPrimaryProps>;
export default KeyPrimary;
