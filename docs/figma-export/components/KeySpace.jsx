// figma node: 2:5553 Key/Space (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "dark=" + __venc(p.dark);

export function KeySpace(_p = {}) {
  const props = { ..._p, dark: _p.dark ?? "on" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 131,
      height: 42,
      borderRadius: 4.599999904632568,
      backgroundColor: "rgb(255,255,255)",
      boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.35)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "absolute",
        left: 43,
        top: 11,
        width: 45,
        height: 19,
        fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 16,
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: "100%",
        letterSpacing: "-0.100px",
        color: "rgb(0,0,0)",
        textTransform: "lowercase",
      }}>{props.text1 ?? "space"}</span>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 131,
      height: 42,
      borderRadius: 4.599999904632568,
      backgroundColor: "rgba(255,255,255,0.3)",
      boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.4)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "absolute",
        left: 43,
        top: 11,
        width: 45,
        height: 19,
        fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 16,
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: "100%",
        letterSpacing: "-0.100px",
        color: "rgb(255,255,255)",
        textTransform: "lowercase",
      }}>{props.text1 ?? "space"}</span>
    </div>
  );
  const __impls = {
    // figma: Dark=Off
    "dark=off": __body0,
    // figma: Dark=On
    "dark=on": __body1,
  };
  return (__impls[__vkey(props)] ?? __body1)();
}
export default KeySpace;
