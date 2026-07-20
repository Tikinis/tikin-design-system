// figma node: 2:5281 Keyboard/Option (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "dark=" + __venc(p.dark);

export function KeyboardOption(_p = {}) {
  const props = { ..._p, dark: _p.dark ?? true };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 393,
      height: 44,
      overflow: "hidden",
      backgroundColor: "rgba(235,235,237,0.9)",
      backdropFilter: "blur(16px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "absolute",
        left: 339,
        top: 14,
        width: 39,
        height: 18,
        fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 600,
        fontSize: 15,
        textAlign: "right",
        whiteSpace: "nowrap",
        lineHeight: "100%",
        color: "rgb(52,120,246)",
      }}>{props.text1 ?? "Done"}</span>
      <svg width={17} height={9} viewBox="0 0 17 9" fill="none" style={{
        position: "absolute",
        left: 57.25,
        top: 17.75,
        width: 17,
        height: 9,
        color: "rgb(164,173,177)",
      }}>
        <path d={"M 0.545 -0.515 C 0.261 -0.816 -0.214 -0.83 -0.515 -0.545 C -0.816 -0.261 -0.83 0.214 -0.545 0.515 L 0 0 L 0.545 -0.515 Z M 8.5 9 L 7.955 9.515 C 8.096 9.665 8.294 9.75 8.5 9.75 C 8.706 9.75 8.904 9.665 9.045 9.515 L 8.5 9 Z M 17.545 0.515 C 17.83 0.214 17.816 -0.261 17.515 -0.545 C 17.214 -0.83 16.739 -0.816 16.455 -0.515 L 17 0 L 17.545 0.515 Z M 0 0 L -0.545 0.515 L 7.955 9.515 L 8.5 9 L 9.045 8.485 L 0.545 -0.515 L 0 0 Z M 8.5 9 L 9.045 9.515 L 17.545 0.515 L 17 0 L 16.455 -0.515 L 7.955 8.485 L 8.5 9 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
      <svg width={17} height={9} viewBox="0 0 17 9" fill="none" style={{
        position: "absolute",
        left: 18.75,
        top: 17.25,
        width: 17,
        height: 9,
        color: "rgb(52,120,246)",
      }}>
        <path d={"M -0.545 8.485 C -0.83 8.786 -0.816 9.261 -0.515 9.545 C -0.214 9.83 0.261 9.816 0.545 9.515 L 0 9 L -0.545 8.485 Z M 8.5 0 L 9.045 -0.515 C 8.904 -0.665 8.706 -0.75 8.5 -0.75 C 8.294 -0.75 8.096 -0.665 7.955 -0.515 L 8.5 0 Z M 16.455 9.515 C 16.739 9.816 17.214 9.83 17.515 9.545 C 17.816 9.261 17.83 8.786 17.545 8.485 L 17 9 L 16.455 9.515 Z M 0 9 L 0.545 9.515 L 9.045 0.515 L 8.5 0 L 7.955 -0.515 L -0.545 8.485 L 0 9 Z M 8.5 0 L 7.955 0.515 L 16.455 9.515 L 17 9 L 17.545 8.485 L 9.045 -0.515 L 8.5 0 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 393,
      height: 44,
      overflow: "hidden",
      backgroundColor: "rgba(0,0,0,0.18)",
      backdropFilter: "blur(12px)",
      boxShadow: "inset 0px 0.330px 0px 0px rgba(255,255,255,0.15)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "absolute",
        left: 339,
        top: 14,
        width: 39,
        height: 18,
        fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 600,
        fontSize: 15,
        textAlign: "right",
        whiteSpace: "nowrap",
        lineHeight: "100%",
        color: "rgb(254,255,255)",
      }}>{props.text1 ?? "Done"}</span>
      <svg width={17} height={9} viewBox="0 0 17 9" fill="none" style={{
        position: "absolute",
        left: 57.25,
        top: 17.75,
        width: 17,
        height: 9,
        color: "rgb(254,255,255)",
      }}>
        <path d={"M 0.545 -0.515 C 0.261 -0.816 -0.214 -0.83 -0.515 -0.545 C -0.816 -0.261 -0.83 0.214 -0.545 0.515 L 0 0 L 0.545 -0.515 Z M 8.5 9 L 7.955 9.515 C 8.096 9.665 8.294 9.75 8.5 9.75 C 8.706 9.75 8.904 9.665 9.045 9.515 L 8.5 9 Z M 17.545 0.515 C 17.83 0.214 17.816 -0.261 17.515 -0.545 C 17.214 -0.83 16.739 -0.816 16.455 -0.515 L 17 0 L 17.545 0.515 Z M 0 0 L -0.545 0.515 L 7.955 9.515 L 8.5 9 L 9.045 8.485 L 0.545 -0.515 L 0 0 Z M 8.5 9 L 9.045 9.515 L 17.545 0.515 L 17 0 L 16.455 -0.515 L 7.955 8.485 L 8.5 9 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
      <svg width={17} height={9} viewBox="0 0 17 9" fill="none" style={{
        position: "absolute",
        left: 18.75,
        top: 17.25,
        width: 17,
        height: 9,
        color: "rgba(255,255,255,0.4)",
      }}>
        <path d={"M -0.545 8.485 C -0.83 8.786 -0.816 9.261 -0.515 9.545 C -0.214 9.83 0.261 9.816 0.545 9.515 L 0 9 L -0.545 8.485 Z M 8.5 0 L 9.045 -0.515 C 8.904 -0.665 8.706 -0.75 8.5 -0.75 C 8.294 -0.75 8.096 -0.665 7.955 -0.515 L 8.5 0 Z M 16.455 9.515 C 16.739 9.816 17.214 9.83 17.515 9.545 C 17.816 9.261 17.83 8.786 17.545 8.485 L 17 9 L 16.455 9.515 Z M 0 9 L 0.545 9.515 L 9.045 0.515 L 8.5 0 L 7.955 -0.515 L -0.545 8.485 L 0 9 Z M 8.5 0 L 7.955 0.515 L 16.455 9.515 L 17 9 L 17.545 8.485 L 9.045 -0.515 L 8.5 0 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
    </div>
  );
  const __impls = {
    // figma: Dark=False
    "dark=false": __body0,
    // figma: Dark=True
    "dark=true": __body1,
  };
  return (__impls[__vkey(props)] ?? __body1)();
}
export default KeyboardOption;
