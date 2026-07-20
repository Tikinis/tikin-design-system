// figma node: 2:47 Key/Num (4 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "abc=" + __venc(p.abc) + "|" + "dark=" + __venc(p.dark);

export function KeyNum(_p = {}) {
  const props = { ..._p, abc: _p.abc ?? "on", dark: _p.dark ?? "off" };
  const __body0 = () => (
    <div
      className={props.className}
      style={{
        width: 117,
        height: 46,
        borderRadius: 5,
        backgroundColor: "rgb(252,252,254)",
        boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.35)",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 29,
          width: 117,
          height: 12,
          fontFamily:
            '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontWeight: 700,
          fontSize: 10,
          textAlign: "center",
          lineHeight: "100%",
          letterSpacing: "2px",
          color: "rgb(0,0,0)",
          whiteSpace: "pre-wrap",
          display: "inline-block",
        }}
      >
        {"AB"}
        {"C"}
      </span>
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 1,
          width: 117,
          height: 30,
          fontFamily:
            '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontSize: 25,
          textAlign: "center",
          lineHeight: "100%",
          letterSpacing: "0.291px",
          color: "rgb(0,0,0)",
        }}
      >
        {props.text1 ?? "2"}
      </span>
    </div>
  );
  const __body1 = () => (
    <div
      className={props.className}
      style={{
        width: 117,
        height: 46,
        borderRadius: 5,
        backgroundColor: "rgb(252,252,254)",
        boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.35)",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 7,
          width: 117,
          height: 30,
          fontFamily:
            '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontWeight: 400,
          fontSize: 25,
          textAlign: "center",
          lineHeight: "100%",
          letterSpacing: "0.291px",
          color: "rgb(0,0,0)",
        }}
      >
        {props.text1 ?? "0"}
      </span>
    </div>
  );
  const __body2 = () => (
    <div
      className={props.className}
      style={{
        width: 117,
        height: 46,
        borderRadius: 5,
        backgroundColor: "rgba(255,255,255,0.3)",
        boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.4)",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 29,
          width: 117,
          height: 12,
          fontFamily:
            '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontWeight: 700,
          fontSize: 10,
          textAlign: "center",
          lineHeight: "100%",
          letterSpacing: "2px",
          color: "rgb(255,255,255)",
          whiteSpace: "pre-wrap",
          display: "inline-block",
        }}
      >
        {"AB"}
        {"C"}
      </span>
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 1,
          width: 117,
          height: 30,
          fontFamily:
            '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontSize: 25,
          textAlign: "center",
          lineHeight: "100%",
          letterSpacing: "0.291px",
          color: "rgb(255,255,255)",
        }}
      >
        {props.text1 ?? "2"}
      </span>
    </div>
  );
  const __body3 = () => (
    <div
      className={props.className}
      style={{
        width: 117,
        height: 46,
        borderRadius: 5,
        backgroundColor: "rgba(255,255,255,0.3)",
        boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.4)",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 7,
          width: 117,
          height: 30,
          fontFamily:
            '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontWeight: 400,
          fontSize: 25,
          textAlign: "center",
          lineHeight: "100%",
          letterSpacing: "0.291px",
          color: "rgb(255,255,255)",
        }}
      >
        {props.text1 ?? "0"}
      </span>
    </div>
  );
  const __impls = {
    // figma: abc=On,Dark=Off
    "abc=on|dark=off": __body0,
    // figma: abc=Off,Dark=Off
    "abc=off|dark=off": __body1,
    // figma: abc=On,Dark=On
    "abc=on|dark=on": __body2,
    // figma: abc=Off,Dark=On
    "abc=off|dark=on": __body3,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default KeyNum;
