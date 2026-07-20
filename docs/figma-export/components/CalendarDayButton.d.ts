import type * as React from "react";
export interface CalendarDayButtonProps {
  className?: string;
  style?: React.CSSProperties;
  numberText?: string;
  variant?: "default" | "current" | "outside";
  state?: "default" | "hover" | "pressed" | "disabled" | "selected" | "selected (focus)";
}
export declare const CalendarDayButton: React.FC<CalendarDayButtonProps>;
export default CalendarDayButton;
