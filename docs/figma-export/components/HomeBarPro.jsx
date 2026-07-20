// figma node: 2:79 Home bar/Pro (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "darkMode=" + __venc(p.darkMode);

export function HomeBarPro(_p = {}) {
  const props = { ..._p, darkMode: _p.darkMode ?? "off" };
  const __body0 = () => (
    <div
      className={props.className}
      style={{
        width: 393,
        height: 34,
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 127,
          top: 20,
          width: 139,
          height: 5,
          borderRadius: 100,
          backgroundColor: "rgb(255,255,255)",
        }}
      />
    </div>
  );
  const __body1 = () => (
    <div
      className={props.className}
      style={{
        width: 393,
        height: 34,
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 127,
          top: 20,
          width: 139,
          height: 5,
          borderRadius: 100,
          backgroundColor: "rgb(0,0,0)",
        }}
      />
    </div>
  );
  const __impls = {
    // figma: Dark Mode=On
    "darkMode=on": __body0,
    // figma: Dark Mode=Off
    "darkMode=off": __body1,
  };
  return (__impls[__vkey(props)] ?? __body1)();
}
export default HomeBarPro;
