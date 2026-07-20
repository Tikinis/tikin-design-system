import * as React from 'react';
export interface KeyboardLayoutProps {
  className?: string;
  style?: React.CSSProperties;
  layout?: "ABC" | "abc" | "123";
  dark?: "off" | "on";
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon2?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon3?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon4?: React.ReactNode;
}
export declare const KeyboardLayout: React.FC<KeyboardLayoutProps>;
export default KeyboardLayout;
