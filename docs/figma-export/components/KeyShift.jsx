import { Icon } from './Icon.jsx';

// figma node: 2:5338 Key/Shift (4 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "lowercase=" + __venc(p.lowercase) + '|' + "dark=" + __venc(p.dark);

export function KeyShift(_p = {}) {
  const props = { ..._p, lowercase: _p.lowercase ?? "off", dark: _p.dark ?? "off" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 42,
      height: 42,
      borderRadius: 4.599999904632568,
      backgroundColor: "rgb(174,179,190)",
      boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.35)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 9,
          top: 9,
          width: 24,
          height: 24,
        }}>{props.icon1 ?? <Icon icon={"arrow up"} />}</div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 42,
      height: 42,
      borderRadius: 4.599999904632568,
      backgroundColor: "rgb(255,255,255)",
      boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.35)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 9,
          top: 9,
          width: 24,
          height: 24,
        }}>{props.icon1 ?? <Icon icon={"arrow up filled"} />}</div>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 42,
      height: 42,
      borderRadius: 4.599999904632568,
      backgroundColor: "rgba(255,255,255,0.1)",
      boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.4)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 9,
          top: 9,
          width: 24,
          height: 24,
          color: "rgb(255,255,255)",
        }}>{props.icon1 ?? <Icon icon={"arrow up"} />}</div>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: 42,
      height: 42,
      borderRadius: 4.599999904632568,
      backgroundColor: "rgba(255,255,255,0.8)",
      boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.4)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "absolute",
          left: 9,
          top: 9,
          width: 24,
          height: 24,
        }}>{props.icon1 ?? <Icon icon={"arrow up filled"} />}</div>
    </div>
  );
  const __impls = {
    // figma: lowercase=On, Dark=Off
    "lowercase=on|dark=off": __body0,
    // figma: lowercase=Off,Dark=Off
    "lowercase=off|dark=off": __body1,
    // figma: lowercase=On, Dark=On
    "lowercase=on|dark=on": __body2,
    // figma: lowercase=Off, Dark=On
    "lowercase=off|dark=on": __body3,
  };
  return (__impls[__vkey(props)] ?? __body1)();
}
export default KeyShift;
