import { Icon } from "./Icon.jsx";

// figma node: 2:5558 Key/Return (4 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "icon=" + __venc(p.icon) + "|" + "dark=" + __venc(p.dark);

export function KeyReturn(_p = {}) {
  const props = { ..._p, icon: _p.icon ?? "off", dark: _p.dark ?? "off" };
  const __body0 = () => (
    <div
      className={props.className}
      style={{
        width: 87,
        height: 42,
        borderRadius: 4.599999904632568,
        backgroundColor: "rgb(174,179,190)",
        boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.35)",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 11,
          width: 87,
          height: 20,
          fontFamily:
            '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontSize: 16,
          textAlign: "center",
          lineHeight: "100%",
          letterSpacing: "-0.020em",
          color: "rgb(0,0,0)",
        }}
      >
        {props.text1 ?? "return"}
      </span>
    </div>
  );
  const __body1 = () => (
    <div
      className={props.className}
      style={{
        width: 87,
        height: 42,
        borderRadius: 4.599999904632568,
        backgroundColor: "rgb(174,179,190)",
        boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.35)",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 31,
          top: 9,
          width: 24,
          height: 24,
        }}
      >
        {props.icon1 ?? <Icon icon={"enter"} />}
      </div>
    </div>
  );
  const __body2 = () => (
    <div
      className={props.className}
      style={{
        width: 87,
        height: 42,
        borderRadius: 4.599999904632568,
        backgroundColor: "rgba(255,255,255,0.1)",
        boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.4)",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 11,
          width: 87,
          height: 20,
          fontFamily:
            '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontWeight: 400,
          fontSize: 16,
          textAlign: "center",
          lineHeight: "100%",
          letterSpacing: "-0.020em",
          color: "rgb(255,255,255)",
        }}
      >
        {props.text1 ?? "return"}
      </span>
    </div>
  );
  const __body3 = () => (
    <div
      className={props.className}
      style={{
        width: 87,
        height: 42,
        borderRadius: 4.599999904632568,
        backgroundColor: "rgba(255,255,255,0.1)",
        boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.4)",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 31,
          top: 9,
          width: 24,
          height: 24,
        }}
      >
        {props.icon1 ?? <Icon icon={"enter"} />}
      </div>
    </div>
  );
  const __impls = {
    // figma: Icon=Off,Dark=Off
    "icon=off|dark=off": __body0,
    // figma: Icon=On,Dark=Off
    "icon=on|dark=off": __body1,
    // figma: Icon=Off,Dark=On
    "icon=off|dark=on": __body2,
    // figma: Icon=On,Dark=On
    "icon=on|dark=on": __body3,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default KeyReturn;
