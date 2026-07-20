import * as React from 'react';
export interface SwitchProps {
  className?: string;
  style?: React.CSSProperties;
  size?: "sm" | "md" | "lg";
  status?: "on" | "off";
  copy?: boolean;
  title?: boolean;
  /** Text content; defaults to "Title text goes here". */
  text1?: string;
  /** Text content; defaults to "Secondary text line goes here ". */
  text2?: string;
}
export declare const Switch: React.FC<SwitchProps>;
export default Switch;
