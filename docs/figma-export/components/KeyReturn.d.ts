import * as React from 'react';
export interface KeyReturnProps {
  className?: string;
  style?: React.CSSProperties;
  icon?: "off" | "on";
  dark?: "off" | "on";
  /** Text content; defaults to "return". */
  text1?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}
export declare const KeyReturn: React.FC<KeyReturnProps>;
export default KeyReturn;
