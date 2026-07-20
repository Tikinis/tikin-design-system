// figma node: 2:5572 Key/Go (4 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "active=" + __venc(p.active) + "|" + "dark=" + __venc(p.dark);

export function KeyGo(_p = {}) {
  const props = { ..._p, active: _p.active ?? "on", dark: _p.dark ?? "off" };
  const __body0 = () => (
    <div
      className={props.className}
      style={{
        width: 64,
        height: 42,
        borderRadius: 4.599999904632568,
        backgroundColor: "rgb(171,177,188)",
        boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.35)",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 14,
          top: 11,
          width: 36,
          height: 19,
          fontFamily:
            '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontWeight: 400,
          fontSize: 16,
          textAlign: "center",
          lineHeight: "100%",
          color: "rgb(116,120,128)",
          textTransform: "lowercase",
        }}
      >
        {props.text1 ?? "go"}
      </span>
    </div>
  );
  const __body1 = () => (
    <div
      className={props.className}
      style={{
        width: 64,
        height: 42,
        borderRadius: 4.599999904632568,
        backgroundColor: "rgb(0,122,255)",
        boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.35)",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 14,
          top: 11,
          width: 36,
          height: 19,
          fontFamily:
            '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontWeight: 400,
          fontSize: 16,
          textAlign: "center",
          lineHeight: "100%",
          color: "rgb(255,255,255)",
          textTransform: "lowercase",
        }}
      >
        {props.text1 ?? "go"}
      </span>
    </div>
  );
  const __body2 = () => (
    <div
      className={props.className}
      style={{
        width: 64,
        height: 42,
        borderRadius: 4.599999904632568,
        backgroundColor: "rgba(255,255,255,0.1)",
        boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.35)",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 14,
          top: 11,
          width: 36,
          height: 19,
          fontFamily:
            '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontWeight: 400,
          fontSize: 16,
          textAlign: "center",
          lineHeight: "100%",
          color: "rgba(255,255,255,0.4)",
          textTransform: "lowercase",
        }}
      >
        {props.text1 ?? "go"}
      </span>
    </div>
  );
  const __body3 = () => (
    <div
      className={props.className}
      style={{
        width: 64,
        height: 42,
        borderRadius: 4.599999904632568,
        backgroundColor: "rgb(52,120,246)",
        boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.4)",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 14,
          top: 11,
          width: 36,
          height: 19,
          fontFamily:
            '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontWeight: 400,
          fontSize: 16,
          textAlign: "center",
          lineHeight: "100%",
          color: "rgb(255,255,255)",
          textTransform: "lowercase",
        }}
      >
        {props.text1 ?? "go"}
      </span>
    </div>
  );
  const __impls = {
    // figma: Active=Off, Dark=Off
    "active=off|dark=off": __body0,
    // figma: Active=On,Dark=Off
    "active=on|dark=off": __body1,
    // figma: Active=Off, Dark=On
    "active=off|dark=on": __body2,
    // figma: Active=On,Dark=On
    "active=on|dark=on": __body3,
  };
  return (__impls[__vkey(props)] ?? __body1)();
}
export default KeyGo;
