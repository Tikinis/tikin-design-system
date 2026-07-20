import * as React from 'react';
export interface ReservationTypeProps {
  className?: string;
  style?: React.CSSProperties;
  type?: "phone call" | "online" | "location";
  /** Text content; defaults to "Phone call". */
  text1?: string;
}
export declare const ReservationType: React.FC<ReservationTypeProps>;
export default ReservationType;
