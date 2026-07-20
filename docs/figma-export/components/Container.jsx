// figma node: 2:162998 Container (10 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) =>
  "darkMode=" +
  __venc(p.darkMode) +
  "|" +
  "bottomVar=" +
  __venc(p.bottomVar) +
  "|" +
  "top=" +
  __venc(p.top) +
  "|" +
  "bottom=" +
  __venc(p.bottom) +
  "|" +
  "stack=" +
  __venc(p.stack);

export function Container(_p = {}) {
  const props = {
    ..._p,
    darkMode: _p.darkMode ?? false,
    bottomVar: _p.bottomVar ?? "default",
    top: _p.top ?? false,
    bottom: _p.bottom ?? false,
    stack: _p.stack ?? false,
  };
  const __body0 = () => (
    <div
      className={props.className}
      style={{
        width: 270,
        height: 44,
        borderRadius: "14px 14px 0px 0px",
        backgroundColor: "rgba(248,248,248,0.92)",
        backdropFilter: "blur(27.183px)",
        boxShadow: "inset 0px -1px 0px 0px rgba(0,0,0,0.15)",
        position: "relative",
        ...props.style,
      }}
    />
  );
  const __body1 = () => (
    <div
      className={props.className}
      style={{
        width: 270,
        height: 44,
        backgroundColor: "rgba(248,248,248,0.92)",
        backdropFilter: "blur(27.183px)",
        boxShadow: "inset 0px -1px 0px 0px rgba(0,0,0,0.15)",
        position: "relative",
        ...props.style,
      }}
    />
  );
  const __body2 = () => (
    <div
      className={props.className}
      style={{
        width: 270,
        height: 44,
        borderRadius: "0px 0px 14px 14px",
        backgroundColor: "rgba(248,248,248,0.92)",
        backdropFilter: "blur(27.183px)",
        position: "relative",
        ...props.style,
      }}
    />
  );
  const __body3 = () => (
    <div
      className={props.className}
      style={{
        width: 270,
        height: 44,
        borderRadius: "0px 0px 0px 14px",
        backgroundColor: "rgba(248,248,248,0.92)",
        backdropFilter: "blur(27.183px)",
        position: "relative",
        ...props.style,
      }}
    />
  );
  const __body4 = () => (
    <div
      className={props.className}
      style={{
        width: 270,
        height: 44,
        borderRadius: "0px 0px 14px 0px",
        backgroundColor: "rgba(248,248,248,0.92)",
        backdropFilter: "blur(27.183px)",
        boxShadow: "inset 1px 0px 0px 0px rgba(0,0,0,0.15)",
        position: "relative",
        ...props.style,
      }}
    />
  );
  const __body5 = () => (
    <div
      className={props.className}
      style={{
        width: 270,
        height: 44,
        borderRadius: "14px 14px 0px 0px",
        backgroundColor: "rgba(49,49,49,0.92)",
        backdropFilter: "blur(27.183px)",
        boxShadow: "inset 0px -1px 0px 0px rgba(130,130,130,0.25)",
        position: "relative",
        ...props.style,
      }}
    />
  );
  const __body6 = () => (
    <div
      className={props.className}
      style={{
        width: 270,
        height: 44,
        backgroundColor: "rgba(49,49,49,0.92)",
        backdropFilter: "blur(27.183px)",
        boxShadow: "inset 0px -1px 0px 0px rgba(130,130,130,0.25)",
        position: "relative",
        ...props.style,
      }}
    />
  );
  const __body7 = () => (
    <div
      className={props.className}
      style={{
        width: 270,
        height: 44,
        borderRadius: "0px 0px 14px 14px",
        backgroundColor: "rgba(49,49,49,0.92)",
        backdropFilter: "blur(27.183px)",
        position: "relative",
        ...props.style,
      }}
    />
  );
  const __body8 = () => (
    <div
      className={props.className}
      style={{
        width: 270,
        height: 44,
        borderRadius: "0px 0px 0px 14px",
        backgroundColor: "rgba(49,49,49,0.92)",
        backdropFilter: "blur(27.183px)",
        position: "relative",
        ...props.style,
      }}
    />
  );
  const __body9 = () => (
    <div
      className={props.className}
      style={{
        width: 270,
        height: 44,
        borderRadius: "0px 0px 14px 0px",
        backgroundColor: "rgba(49,49,49,0.92)",
        backdropFilter: "blur(27.183px)",
        boxShadow: "inset 1px 0px 0px 0px rgba(130,130,130,0.25)",
        position: "relative",
        ...props.style,
      }}
    />
  );
  const __impls = {
    // figma: Dark mode=No, Top=Yes, Stack=No, Bottom=No, Bottom var=Default
    "darkMode=false|bottomVar=default|top=true|bottom=false|stack=false": __body0,
    // figma: Dark mode=No, Top=No, Stack=Yes, Bottom=No, Bottom var=Default
    "darkMode=false|bottomVar=default|top=false|bottom=false|stack=true": __body1,
    // figma: Dark mode=No, Top=No, Stack=No, Bottom=Yes, Bottom var=Default
    "darkMode=false|bottomVar=default|top=false|bottom=true|stack=false": __body2,
    // figma: Dark mode=No, Top=No, Stack=No, Bottom=Yes, Bottom var=Left
    "darkMode=false|bottomVar=left|top=false|bottom=true|stack=false": __body3,
    // figma: Dark mode=No, Top=No, Stack=No, Bottom=Yes, Bottom var=Right
    "darkMode=false|bottomVar=right|top=false|bottom=true|stack=false": __body4,
    // figma: Dark mode=Yes, Top=Yes, Stack=No, Bottom=No, Bottom var=Default
    "darkMode=true|bottomVar=default|top=true|bottom=false|stack=false": __body5,
    // figma: Dark mode=Yes, Top=No, Stack=Yes, Bottom=No, Bottom var=Default
    "darkMode=true|bottomVar=default|top=false|bottom=false|stack=true": __body6,
    // figma: Dark mode=Yes, Top=No, Stack=No, Bottom=Yes, Bottom var=Default
    "darkMode=true|bottomVar=default|top=false|bottom=true|stack=false": __body7,
    // figma: Dark mode=Yes, Top=No, Stack=No, Bottom=Yes, Bottom var=Left
    "darkMode=true|bottomVar=left|top=false|bottom=true|stack=false": __body8,
    // figma: Dark mode=Yes, Top=No, Stack=No, Bottom=Yes, Bottom var=Right
    "darkMode=true|bottomVar=right|top=false|bottom=true|stack=false": __body9,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Container;
