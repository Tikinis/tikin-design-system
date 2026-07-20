import type * as React from "react";
export interface FaceIDProps {
  className?: string;
  style?: React.CSSProperties;
  /** Text content; defaults to "Face ID". */
  text1?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}
export declare const FaceID: React.FC<FaceIDProps>;
export default FaceID;
