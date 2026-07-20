// figma node: 2:13 Toggle (16 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "state=" + __venc(p.state) + '|' + "size=" + __venc(p.size) + '|' + "active=" + __venc(p.active);

export function Toggle(_p = {}) {
  const props = { ..._p, state: _p.state ?? "default", size: _p.size ?? "l", active: _p.active ?? "on" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 42,
      height: "calc(var(--numbers-tailwind-24) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 42,
        height: 24,
        borderRadius: 16,
        backgroundColor: "var(--toggle-track-bg-on)",
        boxShadow: "inset 0 0 0 0.250px var(--toggle-track-stroke-on), 0 0 0 0.250px var(--toggle-track-stroke-on)",
      }} />
      <div style={{
        position: "absolute",
        left: 20,
        top: 2,
        width: 20,
        height: 20,
        borderRadius: "50%",
        backgroundColor: "var(--toggle-thumb-bg-on)",
      }} />
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 29,
      height: "calc(var(--numbers-tailwind-16) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 29,
        height: 16,
        borderRadius: 16,
        backgroundColor: "var(--toggle-track-bg-off)",
        boxShadow: "inset 0 0 0 0.250px var(--toggle-track-stroke-off), 0 0 0 0.250px var(--toggle-track-stroke-off)",
      }} />
      <div style={{
        position: "absolute",
        left: 1,
        top: 1,
        width: 14,
        height: 14,
        borderRadius: "50%",
        backgroundColor: "var(--toggle-thumb-bg-off)",
      }} />
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 29,
      height: "calc(var(--numbers-tailwind-16) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 29,
        height: 16,
        borderRadius: 16,
        backgroundColor: "var(--toggle-track-bg-disabled)",
        boxShadow: "inset 0 0 0 0.250px var(--toggle-track-stroke-disabled), 0 0 0 0.250px var(--toggle-track-stroke-disabled)",
      }} />
      <div style={{
        position: "absolute",
        left: 1,
        top: 1,
        width: 14,
        height: 14,
        borderRadius: "50%",
        backgroundColor: "var(--toggle-thumb-bg-disabled)",
      }} />
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: 34,
      height: "calc(var(--numbers-tailwind-20) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 34,
        height: 20,
        borderRadius: 16,
        backgroundColor: "var(--toggle-track-bg-off)",
        boxShadow: "inset 0 0 0 0.250px var(--toggle-track-stroke-off), 0 0 0 0.250px var(--toggle-track-stroke-off)",
      }} />
      <div style={{
        position: "absolute",
        left: 2,
        top: 2,
        width: 16,
        height: 16,
        borderRadius: "50%",
        backgroundColor: "var(--toggle-thumb-bg-off)",
      }} />
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: 34,
      height: "calc(var(--numbers-tailwind-20) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 34,
        height: 20,
        borderRadius: 16,
        backgroundColor: "var(--toggle-track-bg-disabled)",
        boxShadow: "inset 0 0 0 0.250px var(--toggle-track-stroke-disabled), 0 0 0 0.250px var(--toggle-track-stroke-disabled)",
      }} />
      <div style={{
        position: "absolute",
        left: 2,
        top: 2,
        width: 16,
        height: 16,
        borderRadius: "50%",
        backgroundColor: "var(--toggle-thumb-bg-disabled)",
      }} />
    </div>
  );
  const __body5 = () => (
    <div className={props.className} style={{
      width: 34,
      height: "calc(var(--numbers-tailwind-20) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 34,
        height: 20,
        borderRadius: 16,
        backgroundColor: "var(--toggle-track-bg-on)",
        boxShadow: "inset 0 0 0 0.250px var(--toggle-track-stroke-on), 0 0 0 0.250px var(--toggle-track-stroke-on)",
      }} />
      <div style={{
        position: "absolute",
        left: 16,
        top: 2,
        width: 16,
        height: 16,
        borderRadius: "50%",
        backgroundColor: "var(--toggle-thumb-bg-on)",
      }} />
    </div>
  );
  const __body6 = () => (
    <div className={props.className} style={{
      width: 34,
      height: "calc(var(--numbers-tailwind-20) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 34,
        height: 20,
        borderRadius: 16,
        backgroundColor: "var(--toggle-track-bg-disabled)",
        boxShadow: "inset 0 0 0 0.250px var(--toggle-track-stroke-disabled), 0 0 0 0.250px var(--toggle-track-stroke-disabled)",
      }} />
      <div style={{
        position: "absolute",
        left: 16,
        top: 2,
        width: 16,
        height: 16,
        borderRadius: "50%",
        backgroundColor: "var(--toggle-thumb-bg-disabled)",
      }} />
    </div>
  );
  const __body7 = () => (
    <div className={props.className} style={{
      width: 42,
      height: "calc(var(--numbers-tailwind-24) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 42,
        height: 24,
        borderRadius: 16,
        backgroundColor: "var(--toggle-track-bg-off)",
        boxShadow: "inset 0 0 0 0.250px var(--toggle-track-stroke-off), 0 0 0 0.250px var(--toggle-track-stroke-off)",
      }} />
      <div style={{
        position: "absolute",
        left: 2,
        top: 2,
        width: 20,
        height: 20,
        borderRadius: "50%",
        backgroundColor: "var(--toggle-thumb-bg-off)",
      }} />
    </div>
  );
  const __body8 = () => (
    <div className={props.className} style={{
      width: 42,
      height: "calc(var(--numbers-tailwind-24) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 42,
        height: 24,
        borderRadius: 16,
        backgroundColor: "var(--toggle-track-bg-disabled)",
        boxShadow: "inset 0 0 0 0.250px var(--toggle-track-stroke-disabled), 0 0 0 0.250px var(--toggle-track-stroke-disabled)",
      }} />
      <div style={{
        position: "absolute",
        left: 2,
        top: 2,
        width: 20,
        height: 20,
        borderRadius: "50%",
        backgroundColor: "var(--toggle-thumb-bg-disabled)",
      }} />
    </div>
  );
  const __body9 = () => (
    <div className={props.className} style={{
      width: 42,
      height: "calc(var(--numbers-tailwind-24) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 42,
        height: 24,
        borderRadius: 16,
        backgroundColor: "var(--toggle-track-bg-disabled)",
        boxShadow: "inset 0 0 0 0.250px var(--toggle-track-stroke-disabled), 0 0 0 0.250px var(--toggle-track-stroke-disabled)",
      }} />
      <div style={{
        position: "absolute",
        left: 20,
        top: 2,
        width: 20,
        height: 20,
        borderRadius: "50%",
        backgroundColor: "var(--toggle-thumb-bg-disabled)",
      }} />
    </div>
  );
  const __body10 = () => (
    <div className={props.className} style={{
      width: 29,
      height: "calc(var(--numbers-tailwind-16) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 29,
        height: 16,
        borderRadius: 16,
        backgroundColor: "var(--toggle-track-bg-on)",
        boxShadow: "inset 0 0 0 0.250px var(--toggle-track-stroke-on), 0 0 0 0.250px var(--toggle-track-stroke-on)",
      }} />
      <div style={{
        position: "absolute",
        left: 14,
        top: 1,
        width: 14,
        height: 14,
        borderRadius: "50%",
        backgroundColor: "var(--toggle-thumb-bg-on)",
      }} />
    </div>
  );
  const __body11 = () => (
    <div className={props.className} style={{
      width: 29,
      height: "calc(var(--numbers-tailwind-16) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 29,
        height: 16,
        borderRadius: 16,
        backgroundColor: "var(--toggle-track-bg-disabled)",
        boxShadow: "inset 0 0 0 0.250px var(--toggle-track-stroke-disabled), 0 0 0 0.250px var(--toggle-track-stroke-disabled)",
      }} />
      <div style={{
        position: "absolute",
        left: 14,
        top: 1,
        width: 14,
        height: 14,
        borderRadius: "50%",
        backgroundColor: "var(--toggle-thumb-bg-disabled)",
      }} />
    </div>
  );
  const __impls = {
    // figma: State=Default, Size=L, Active=On
    "state=default|size=l|active=on": __body0,
    // figma: State=Default, Size=Xs, Active=Off
    "state=default|size=xs|active=off": __body1,
    // figma: State=Disabled, Size=Xs, Active=Off
    "state=disabled|size=xs|active=off": __body2,
    // figma: State=Default, Size=S, Active=Off
    "state=default|size=s|active=off": __body1,
    // figma: State=Disabled, Size=S, Active=Off
    "state=disabled|size=s|active=off": __body2,
    // figma: State=Default, Size=M, Active=Off
    "state=default|size=m|active=off": __body3,
    // figma: State=Disabled, Size=M, Active=Off
    "state=disabled|size=m|active=off": __body4,
    // figma: State=Default, Size=M, Active=On
    "state=default|size=m|active=on": __body5,
    // figma: State=Disabled, Size=M, Active=On
    "state=disabled|size=m|active=on": __body6,
    // figma: State=Default, Size=L, Active=Off
    "state=default|size=l|active=off": __body7,
    // figma: State=Disabled, Size=L, Active=Off
    "state=disabled|size=l|active=off": __body8,
    // figma: State=Disabled, Size=L, Active=On
    "state=disabled|size=l|active=on": __body9,
    // figma: State=Default, Size=Xs, Active=On
    "state=default|size=xs|active=on": __body10,
    // figma: State=Disabled, Size=Xs, Active=On
    "state=disabled|size=xs|active=on": __body11,
    // figma: State=Default, Size=S, Active=On
    "state=default|size=s|active=on": __body10,
    // figma: State=Disabled, Size=S, Active=On
    "state=disabled|size=s|active=on": __body11,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Toggle;
