import type * as React from "react";
export interface ContainerProps {
  className?: string;
  style?: React.CSSProperties;
  darkMode?: boolean;
  bottomVar?: "default" | "left" | "right";
  top?: boolean;
  bottom?: boolean;
  stack?: boolean;
}
export declare const Container: React.FC<ContainerProps>;
export default Container;
