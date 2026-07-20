import * as React from 'react';
export interface FaceIDPrompTyAgainProps {
  className?: string;
  style?: React.CSSProperties;
  /** Text content; defaults to "Cancel". */
  text1?: string;
  /** Text content; defaults to "Try Face ID Again". */
  text2?: string;
  /** Text content; defaults to "Try Again". */
  text3?: string;
  /** Text content; defaults to "Face ID". */
  text4?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}
export declare const FaceIDPrompTyAgain: React.FC<FaceIDPrompTyAgainProps>;
export default FaceIDPrompTyAgain;
