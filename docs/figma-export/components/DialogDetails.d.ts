import type * as React from "react";
export interface DialogDetailsProps {
  className?: string;
  style?: React.CSSProperties;
  darkMode?: boolean;
  /** Text content; defaults to "Update Available". */
  text1?: string;
  /** Text content; defaults to "There are newer version available. Update Now?". */
  text2?: string;
}
export declare const DialogDetails: React.FC<DialogDetailsProps>;
export default DialogDetails;
