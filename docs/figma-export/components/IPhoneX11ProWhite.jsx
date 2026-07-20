import { IPhoneX11ProBlack } from "./IPhoneX11ProBlack.jsx";

// figma node: 2:44 iPhone X, 11 Pro / White
export function IPhoneX11ProWhite(_p = {}) {
  const props = _p;
  return (
    <div
      className={props.className}
      style={{
        width: 375,
        height: 44,
        position: "relative",
        ...props.style,
      }}
    >
      <IPhoneX11ProBlack
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 375,
          height: 44,
          color: "rgb(255,255,255)",
        }}
      />
    </div>
  );
}
export default IPhoneX11ProWhite;
