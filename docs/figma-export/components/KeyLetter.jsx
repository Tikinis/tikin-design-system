// figma node: 2:5328 Key/Letter (4 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "lowercase=" + __venc(p.lowercase) + '|' + "dark=" + __venc(p.dark);

export function KeyLetter(_p = {}) {
  const props = { ..._p, lowercase: _p.lowercase ?? "on", dark: _p.dark ?? "on" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 32,
      height: 42,
      borderRadius: 4.599999904632568,
      backgroundColor: "rgb(255,255,255)",
      boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.35)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "absolute",
        left: 6,
        top: 6,
        width: 20,
        height: 30,
        fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 25,
        textAlign: "center",
        lineHeight: "100%",
        color: "rgb(0,0,0)",
        textTransform: "uppercase",
      }}>{props.text1 ?? "Q"}</span>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 32,
      height: 42,
      borderRadius: 4.599999904632568,
      backgroundColor: "rgba(255,255,255,0.3)",
      boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.4)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "absolute",
        left: 6,
        top: 6,
        width: 20,
        height: 30,
        fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 25,
        textAlign: "center",
        lineHeight: "100%",
        color: "rgb(255,255,255)",
        textTransform: "uppercase",
      }}>{props.text1 ?? "Q"}</span>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 32,
      height: 42,
      borderRadius: 4.599999904632568,
      backgroundColor: "rgb(255,255,255)",
      boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.35)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "absolute",
        left: 6,
        top: 4,
        width: 20,
        height: 30,
        fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 25,
        textAlign: "center",
        lineHeight: "100%",
        color: "rgb(0,0,0)",
        textTransform: "lowercase",
      }}>{props.text1 ?? "q"}</span>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: 32,
      height: 42,
      borderRadius: 4.599999904632568,
      backgroundColor: "rgba(255,255,255,0.3)",
      boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.4)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "absolute",
        left: 6,
        top: 4,
        width: 20,
        height: 30,
        fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 25,
        textAlign: "center",
        lineHeight: "100%",
        color: "rgb(255,255,255)",
        textTransform: "lowercase",
      }}>{props.text1 ?? "q"}</span>
    </div>
  );
  const __impls = {
    // figma: lowercase=Off, Dark=Off
    "lowercase=off|dark=off": __body0,
    // figma: lowercase=Off, Dark=On
    "lowercase=off|dark=on": __body1,
    // figma: lowercase=On, Dark=Off
    "lowercase=on|dark=off": __body2,
    // figma: lowercase=On, Dark=On
    "lowercase=on|dark=on": __body3,
  };
  return (__impls[__vkey(props)] ?? __body3)();
}
export default KeyLetter;
