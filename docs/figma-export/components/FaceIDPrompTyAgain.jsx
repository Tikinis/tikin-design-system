import { IconFaceID2 } from './IconFaceID2.jsx';

// figma node: 2:25842 Face ID Promp / Ty Again
export function FaceIDPrompTyAgain(_p = {}) {
  const props = _p;
  return (
    <div className={props.className} style={{
      width: 270,
      height: 260,
      position: "relative",
      ...props.style,
    }}>
      <svg width={270} height={260} viewBox="0 0 270 260" fill="none" style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 270,
        height: 260,
        borderRadius: 14,
        backdropFilter: "blur(54.366px)",
        color: "rgba(248,248,248,0.16)",
      }}>
        <path d={"M 0 0 L 270 0 L 270 260 L 0 260 L 0 0 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
      <div style={{
        position: "absolute",
        left: 0,
        top: 215,
        width: 270,
        height: 44,
      }}>
        <svg width={270} height={1} viewBox="0 0 270 1" fill="none" style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 270,
          height: 1,
        }}>
          <path d={"M 0 0 L 270 0 L 270 0.5 L 0 0.5 L 0 0 Z"} fill="currentColor" fillRule="nonzero" />
        </svg>
        <span style={{
          position: "absolute",
          left: 16,
          top: 12,
          width: 238,
          height: 22,
          fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 17,
          textAlign: "center",
          lineHeight: "22px",
          letterSpacing: "-0.410px",
          color: "rgb(0,122,255)",
        }}>{props.text1 ?? "Cancel"}</span>
      </div>
      <div style={{
        position: "absolute",
        left: 0,
        top: 171,
        width: 270,
        height: 44,
      }}>
        <svg width={270} height={1} viewBox="0 0 270 1" fill="none" style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 270,
          height: 1,
        }}>
          <path d={"M 0 0 L 270 0 L 270 0.5 L 0 0.5 L 0 0 Z"} fill="currentColor" fillRule="nonzero" />
        </svg>
        <span style={{
          position: "absolute",
          left: 16,
          top: 12,
          width: 238,
          height: 22,
          fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 600,
          fontSize: 17,
          textAlign: "center",
          lineHeight: "22px",
          letterSpacing: "-0.410px",
          color: "rgb(0,122,255)",
        }}>{props.text2 ?? "Try Face ID Again"}</span>
      </div>
      <span style={{
        position: "absolute",
        left: 16,
        top: 136,
        width: 238,
        height: 18,
        fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 13,
        textAlign: "center",
        lineHeight: "18px",
        letterSpacing: "-0.080px",
        color: "rgb(255,255,255)",
      }}>{props.text3 ?? "Try Again"}</span>
      <span style={{
        position: "absolute",
        left: 16,
        top: 113,
        width: 238,
        height: 22,
        fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 17,
        textAlign: "center",
        lineHeight: "22px",
        letterSpacing: "-0.410px",
        color: "rgb(255,255,255)",
      }}>{props.text4 ?? "Face ID"}</span>
      <div style={{
          position: "absolute",
          left: 103,
          top: 29,
          width: 64,
          height: 64,
          color: "rgb(0,122,255)",
        }}>{props.icon1 ?? <IconFaceID2 style={{ transform: "scale(0.889, 0.889)", transformOrigin: "0 0" }} />}</div>
    </div>
  );
}
export default FaceIDPrompTyAgain;
