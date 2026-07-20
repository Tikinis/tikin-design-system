// figma node: 2:135138 Link (16 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "state=" + __venc(p.state) + "|" + "size=" + __venc(p.size);

export function Link(_p = {}) {
  const props = {
    ..._p,
    label: _p.label ?? "Label",
    state: _p.state ?? "deault",
    size: _p.size ?? "s",
  };
  const __body0 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-4) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 500,
          fontSize: "calc(var(--button-typo-size-s) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--link-text-default)",
          textDecoration: "underline",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
    </div>
  );
  const __body1 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-4) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 500,
          fontSize: "calc(var(--button-typo-size-xs) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--link-text-default)",
          textDecoration: "underline",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.text1 ?? "Label"}
      </span>
    </div>
  );
  const __body2 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "var(--link-bg-hover)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-4) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 500,
          fontSize: "calc(var(--button-typo-size-xs) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--link-text-hover)",
          textDecoration: "underline",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
    </div>
  );
  const __body3 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-4) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 600,
          fontSize: "calc(var(--button-typo-size-xs) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--link-text-pressed)",
          textDecoration: "underline",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
    </div>
  );
  const __body4 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-4) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 400,
          fontSize: "calc(var(--button-typo-size-xs) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--link-text-disabled)",
          textDecoration: "underline",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
    </div>
  );
  const __body5 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "var(--link-bg-hover)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-4) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 500,
          fontSize: "calc(var(--button-typo-size-s) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--link-text-hover)",
          textDecoration: "underline",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
    </div>
  );
  const __body6 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-4) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 600,
          fontSize: "calc(var(--button-typo-size-s) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--link-text-pressed)",
          textDecoration: "underline",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
    </div>
  );
  const __body7 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-4) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 400,
          fontSize: "calc(var(--button-typo-size-s) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--link-text-disabled)",
          textDecoration: "underline",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
    </div>
  );
  const __body8 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-8) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 500,
          fontSize: "calc(var(--button-typo-size-m) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--link-text-default)",
          textDecoration: "underline",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
    </div>
  );
  const __body9 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "var(--link-bg-hover)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-8) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 500,
          fontSize: "calc(var(--button-typo-size-m) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--link-text-hover)",
          textDecoration: "underline",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
    </div>
  );
  const __body10 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-8) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 600,
          fontSize: "calc(var(--button-typo-size-m) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--link-text-pressed)",
          textDecoration: "underline",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
    </div>
  );
  const __body11 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-8) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 400,
          fontSize: "calc(var(--button-typo-size-m) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--link-text-disabled)",
          textDecoration: "underline",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
    </div>
  );
  const __body12 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-8) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 500,
          fontSize: "calc(var(--button-typo-size-l) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--link-text-default)",
          textDecoration: "underline",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
    </div>
  );
  const __body13 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "var(--link-bg-hover)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-8) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 500,
          fontSize: "calc(var(--button-typo-size-l) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--link-text-hover)",
          textDecoration: "underline",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
    </div>
  );
  const __body14 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-8) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 600,
          fontSize: "calc(var(--button-typo-size-l) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--link-text-pressed)",
          textDecoration: "underline",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
    </div>
  );
  const __body15 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-8) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 400,
          fontSize: "calc(var(--button-typo-size-l) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--link-text-disabled)",
          textDecoration: "underline",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
    </div>
  );
  const __impls = {
    // figma: State=Deault, Size=S
    "state=deault|size=s": __body0,
    // figma: State=Deault, Size=Xs
    "state=deault|size=xs": __body1,
    // figma: State=Hover, Size=Xs
    "state=hover|size=xs": __body2,
    // figma: State=Pressed, Size=Xs
    "state=pressed|size=xs": __body3,
    // figma: State=Disabled, Size=Xs
    "state=disabled|size=xs": __body4,
    // figma: State=Hover, Size=S
    "state=hover|size=s": __body5,
    // figma: State=Pressed, Size=S
    "state=pressed|size=s": __body6,
    // figma: State=Disabled, Size=S
    "state=disabled|size=s": __body7,
    // figma: State=Deault, Size=M
    "state=deault|size=m": __body8,
    // figma: State=Hover, Size=M
    "state=hover|size=m": __body9,
    // figma: State=Pressed, Size=M
    "state=pressed|size=m": __body10,
    // figma: State=Disabled, Size=M
    "state=disabled|size=m": __body11,
    // figma: State=Deault, Size=L
    "state=deault|size=l": __body12,
    // figma: State=Hover, Size=L
    "state=hover|size=l": __body13,
    // figma: State=Pressed, Size=L
    "state=pressed|size=l": __body14,
    // figma: State=Disabled, Size=L
    "state=disabled|size=l": __body15,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Link;
