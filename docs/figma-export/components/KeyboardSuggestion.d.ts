import * as React from 'react';
export interface KeyboardSuggestionProps {
  className?: string;
  style?: React.CSSProperties;
  type?: "password" | "text" | "messages";
  dark?: "on" | "off";
  /** Text content; defaults to "Passwords". */
  text1?: string;
  /** Text content; defaults to "123456". */
  text2?: string;
  /** Text content; defaults to "Ok". */
  text3?: string;
}
export declare const KeyboardSuggestion: React.FC<KeyboardSuggestionProps>;
export default KeyboardSuggestion;
