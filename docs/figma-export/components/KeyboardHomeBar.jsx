import { HomeBarPro } from './HomeBarPro.jsx';
import { Icon } from './Icon.jsx';

// figma node: 2:114 Keyboard/Home Bar (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "dark=" + __venc(p.dark);

export function KeyboardHomeBar(_p = {}) {
  const props = { ..._p, dark: _p.dark ?? "off", iconLeft: _p.iconLeft ?? true, iconRight: _p.iconRight ?? true };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 393,
      height: 75,
      position: "relative",
      ...props.style,
    }}>
      <HomeBarPro
        style={{
          position: "absolute",
          left: 0,
          top: 41,
          width: 393,
          height: 34,
        }}
        darkMode={"off"}
      />
      {props.iconLeft && (
      <div style={{
          position: "absolute",
          left: 20,
          top: 19,
          width: 32,
          height: 32,
          color: "rgb(81,85,91)",
        }}>{props.icon1 ?? <Icon icon={"emoji"} style={{ transform: "scale(1.333, 1.333)", transformOrigin: "0 0" }} />}</div>
      )}
      {props.iconRight && (
      <div style={{
          position: "absolute",
          left: 341,
          top: 19,
          width: 32,
          height: 32,
          color: "rgb(81,85,91)",
        }}>{props.icon2 ?? <Icon icon={"siri"} style={{ transform: "scale(1.333, 1.333)", transformOrigin: "0 0" }} />}</div>
      )}
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 393,
      height: 75,
      backdropFilter: "blur(12px)",
      position: "relative",
      ...props.style,
    }}>
      <HomeBarPro
        style={{
          position: "absolute",
          left: 0,
          top: 41,
          width: 393,
          height: 34,
        }}
        darkMode={"on"}
      />
      {props.iconLeft && (
      <div style={{
          position: "absolute",
          left: 20,
          top: 19,
          width: 32,
          height: 32,
          color: "rgb(255,255,255)",
        }}>{props.icon1 ?? <Icon icon={"emoji filled"} style={{ transform: "scale(1.333, 1.333)", transformOrigin: "0 0" }} />}</div>
      )}
      {props.iconRight && (
      <div style={{
          position: "absolute",
          left: 341,
          top: 19,
          width: 32,
          height: 32,
          color: "rgb(255,255,255)",
        }}>{props.icon2 ?? <Icon icon={"siri"} style={{ transform: "scale(1.333, 1.333)", transformOrigin: "0 0" }} />}</div>
      )}
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
export default KeyboardHomeBar;
