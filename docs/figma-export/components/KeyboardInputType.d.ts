import * as React from 'react';
export interface KeyboardInputTypeProps {
  className?: string;
  style?: React.CSSProperties;
  type?: "search" | "text" | "e-mail" | "url" | "emoji";
  dark?: "on" | "off";
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon2?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon3?: React.ReactNode;
}
export declare const KeyboardInputType: React.FC<KeyboardInputTypeProps>;
export default KeyboardInputType;
