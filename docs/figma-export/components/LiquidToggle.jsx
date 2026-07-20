// figma node: 2:34537 Liquid Toggle (6 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "property1=" + __venc(p.property1);

export function LiquidToggle(_p = {}) {
  const props = { ..._p, property1: _p.property1 ?? "default" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 720,
      height: 400,
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 720,
        height: 400,
        borderRadius: 200,
        backgroundColor: "rgb(196,196,196)",
      }} />
      <div style={{
        position: "absolute",
        left: 40,
        top: 40,
        width: 320,
        height: 320,
        borderRadius: "50%",
        backgroundColor: "rgb(255,255,255)",
      }} />
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 720,
      height: 400,
      position: "relative",
      color: "rgb(255,255,255)",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 720,
        height: 400,
        borderRadius: 200,
        backgroundColor: "rgb(196,196,196)",
      }} />
      <svg width={212} height={320} viewBox="0 0 212 320" fill="none" style={{
        position: "absolute",
        left: 468,
        top: 40,
        width: 212,
        height: 320,
      }}>
        <path d={"M 212 160 C 212 248.366 164.542 320 106 320 C 0 320 0 248.366 0 160 C 0 71.634 0 0 106 0 C 168.5 0 212 71.634 212 160 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 720,
      height: 400,
      position: "relative",
      color: "rgb(255,255,255)",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 720,
        height: 400,
        borderRadius: 200,
        backgroundColor: "rgb(196,196,196)",
      }} />
      <svg width={198} height={320} viewBox="0 0 198 320" fill="none" style={{
        position: "absolute",
        left: 40,
        top: 40,
        width: 198,
        height: 320,
      }}>
        <path d={"M 198 160 C 198 248.366 183.5 320 99 320 C 44.324 320 0 248.366 0 160 C 0 71.634 44.324 0 99 0 C 181 0 198 71.634 198 160 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: 720,
      height: 400,
      position: "relative",
      color: "rgb(255,255,255)",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 720,
        height: 400,
        borderRadius: 200,
        backgroundColor: "rgb(196,196,196)",
      }} />
      <svg width={468.500} height={320} viewBox="0 0 468.500 320" fill="none" style={{
        position: "absolute",
        left: 51.5,
        top: 40,
        width: 468.5,
        height: 320,
      }}>
        <path d={"M 468.5 160 C 468.5 248.366 396.866 320 308.5 320 C 220.134 320 0 248.366 0 160 C 0 71.634 220.134 0 308.5 0 C 396.866 0 468.5 71.634 468.5 160 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: 720,
      height: 400,
      position: "relative",
      color: "rgb(255,255,255)",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 720,
        height: 400,
        borderRadius: 200,
        backgroundColor: "rgb(196,196,196)",
      }} />
      <svg width={474} height={320} viewBox="0 0 474 320" fill="none" style={{
        position: "absolute",
        left: 200,
        top: 40,
        width: 474,
        height: 320,
      }}>
        <path d={"M 474 160 C 474 248.366 248.366 320 160 320 C 71.634 320 0 248.366 0 160 C 0 71.634 71.634 0 160 0 C 248.366 0 474 71.634 474 160 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
    </div>
  );
  const __body5 = () => (
    <div className={props.className} style={{
      width: 720,
      height: 400,
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 720,
        height: 400,
        borderRadius: 200,
        backgroundColor: "rgb(123,97,255)",
      }} />
      <div style={{
        position: "absolute",
        left: 360,
        top: 40,
        width: 320,
        height: 320,
        borderRadius: "50%",
        backgroundColor: "rgb(255,255,255)",
      }} />
    </div>
  );
  const __impls = {
    // figma: Property 1=Default
    "property1=default": __body0,
    // figma: Property 1=Default 3
    "property1=default 3": __body1,
    // figma: Property 1=Enabled 3
    "property1=enabled 3": __body2,
    // figma: Property 1=Default 2
    "property1=default 2": __body3,
    // figma: Property 1=Enabled 2
    "property1=enabled 2": __body4,
    // figma: Property 1=Enabled
    "property1=enabled": __body5,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default LiquidToggle;
