import type * as React from "react";
export interface LiquidToggleProps {
  className?: string;
  style?: React.CSSProperties;
  property1?: "default" | "default 2" | "default 3" | "enabled" | "enabled 2" | "enabled 3";
}
export declare const LiquidToggle: React.FC<LiquidToggleProps>;
export default LiquidToggle;
