import type * as React from "react";
export interface TabItemProps {
  className?: string;
  style?: React.CSSProperties;
  state?: "selected" | "unselected";
  /** Text content; defaults to "Selected". */
  text1?: string;
}
export declare const TabItem: React.FC<TabItemProps>;
export default TabItem;
