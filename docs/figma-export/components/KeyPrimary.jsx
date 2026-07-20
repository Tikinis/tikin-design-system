import { Icon } from './Icon.jsx';

// figma node: 2:5567 Key/Primary (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "dark=" + __venc(p.dark);

export function KeyPrimary(_p = {}) {
  const props = { ..._p, dark: _p.dark ?? "off" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 40,
      height: 42,
      borderRadius: 4.599999904632568,
      backgroundColor: "rgb(255,255,255)",
      boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.35)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 8,
          top: 9,
          width: 24,
          height: 24,
        }}>{props.icon1 ?? <Icon icon={"at @"} />}</div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 40,
      height: 42,
      borderRadius: 4.599999904632568,
      backgroundColor: "rgba(255,255,255,0.3)",
      boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.4)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 8,
          top: 9,
          width: 24,
          height: 24,
          color: "rgb(255,255,255)",
        }}>{props.icon1 ?? <Icon icon={"at @"} />}</div>
    </div>
  );
  const __impls = {
    // figma: Dark=Off
    "dark=off": __body0,
    // figma: Dark=On
    "dark=on": __body1,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default KeyPrimary;
