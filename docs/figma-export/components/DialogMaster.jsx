import { Component2 } from './Component2.jsx';
import { DialogDetails } from './DialogDetails.jsx';

// figma node: 2:163059 Dialog master
export function DialogMaster(_p = {}) {
  const props = _p;
  return (
    <div className={props.className} style={{
      width: "fit-content",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <DialogDetails
        style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          width: "auto",
        }}
        darkMode={false}
      />
      <Component2
        style={{
          position: "relative",
          height: 44,
          flexShrink: 0,
          alignSelf: "stretch",
          width: "auto",
        }}
        text2={"Action"}
        darkMode={false}
        actions={"double"}
      />
    </div>
  );
}
export default DialogMaster;
