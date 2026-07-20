import * as React from 'react';
export interface IconProps {
  className?: string;
  style?: React.CSSProperties;
  icon?: "delete" | "arrow up" | "at @" | "slash" | "emoji" | "enter" | "dot" | "tel" | "emoji filled" | "arrow up filled" | "language" | "dictation" | "dictation filled" | "siri";
}
export declare const Icon: React.FC<IconProps>;
export default Icon;
