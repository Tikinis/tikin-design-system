import * as React from 'react';
export interface KeySpaceProps {
  className?: string;
  style?: React.CSSProperties;
  dark?: "on" | "off";
  /** Text content; defaults to "space". */
  text1?: string;
}
export declare const KeySpace: React.FC<KeySpaceProps>;
export default KeySpace;
