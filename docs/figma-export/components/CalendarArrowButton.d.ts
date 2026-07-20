import * as React from 'react';
export interface CalendarArrowButtonProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: "next" | "previous";
  state?: "default" | "hover" | "focus" | "disabled";
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}
export declare const CalendarArrowButton: React.FC<CalendarArrowButtonProps>;
export default CalendarArrowButton;
