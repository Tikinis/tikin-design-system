import type * as React from "react";
export interface ValueProps {
  className?: string;
  style?: React.CSSProperties;
  value?:
    | "arrowdown"
    | "arrowleft"
    | "arrowright"
    | "arrowup"
    | "arrowupleft"
    | "arrowupright"
    | "bell"
    | "briefcase"
    | "close"
    | "downloadsimple"
    | "eye"
    | "eyeclosed"
    | "headset"
    | "house"
    | "mathoperations"
    | "qrcode"
    | "questionmark"
    | "copy"
    | "heart"
    | "chevronleft"
    | "chevrondown"
    | "chevronup"
    | "chevronright"
    | "spinner"
    | "warning"
    | "warningcircle";
}
export declare const Value: React.FC<ValueProps>;
export default Value;
