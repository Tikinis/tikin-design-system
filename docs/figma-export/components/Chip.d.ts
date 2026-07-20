import * as React from 'react';
export interface ChipProps {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  size?: "s" | "m" | "l" | "xs";
  feedback?: "info" | "error" | "success" | "warning";
}
export declare const Chip: React.FC<ChipProps>;
export default Chip;
