import { IconFaceID2 } from './IconFaceID2.jsx';

// figma node: 2:25838 Face ID
export function FaceID(_p = {}) {
  const props = _p;
  return (
    <div className={props.className} style={{
      width: 155,
      height: 155,
      position: "relative",
      color: "rgba(229,229,234,0.82)",
      ...props.style,
    }}>
      <svg width={155} height={155} viewBox="0 0 155 155" fill="none" style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 155,
        height: 155,
        borderRadius: 8,
        backdropFilter: "blur(54.366px)",
      }}>
        <path d={"M 0 0 L 155 0 L 155 155 L 0 155 L 0 0 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
      <span style={{
        position: "absolute",
        left: 50,
        top: 117,
        width: 56,
        height: 21,
        fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 600,
        fontSize: 16,
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: "21px",
        letterSpacing: "-0.320px",
        color: "rgb(101,102,106)",
      }}>{props.text1 ?? "Face ID"}</span>
      <div style={{
          position: "absolute",
          left: 42,
          top: 26,
          width: 72,
          height: 72,
          color: "rgb(255,255,255)",
        }}>{props.icon1 ?? <IconFaceID2 />}</div>
    </div>
  );
}
export default FaceID;
