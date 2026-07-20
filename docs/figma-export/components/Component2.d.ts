import * as React from 'react';
export interface Component2Props {
  className?: string;
  style?: React.CSSProperties;
  darkMode?: boolean;
  actions?: "single" | "double" | "triple";
  /** Text content; defaults to "Action". */
  text1?: string;
  /** Text content; defaults to "Action". */
  text2?: string;
  /** Text content; defaults to "Action". */
  text3?: string;
}
export declare const Component2: React.FC<Component2Props>;
export default Component2;
