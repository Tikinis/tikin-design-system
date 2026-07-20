// figma node: 2:5085 Chip (16 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "size=" + __venc(p.size) + '|' + "feedback=" + __venc(p.feedback);

export function Chip(_p = {}) {
  const props = { ..._p, label: _p.label ?? "Label", size: _p.size ?? "s", feedback: _p.feedback ?? "info" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      height: 26,
      borderRadius: 100,
      backgroundColor: "var(--chip-bg-info)",
      display: "flex",
      flexDirection: "row",
      padding: "6px 12px 6px 12px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingTop: "calc(var(--numbers-uniques-6) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingBottom: "calc(var(--numbers-uniques-6) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"Ubuntu Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: "calc(var(--chip-typo-size-m) * 1px)",
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: 1,
        letterSpacing: "0.050em",
        color: "var(--chip-text-info)",
        textTransform: "uppercase",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.label}</span>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      height: 22,
      borderRadius: 100,
      backgroundColor: "var(--chip-bg-info)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-4) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-4) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"Ubuntu Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: "calc(var(--chip-typo-size-s) * 1px)",
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: 1,
        letterSpacing: "0.050em",
        color: "var(--chip-text-info)",
        textTransform: "uppercase",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.label}</span>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      height: 20,
      borderRadius: 100,
      backgroundColor: "var(--chip-bg-success)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--dropdown-option-corner-s) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-4) * 1px)",
      paddingRight: "calc(var(--dropdown-option-corner-s) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-4) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"Ubuntu Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: "calc(var(--chip-typo-size-xs) * 1px)",
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: 1,
        letterSpacing: "0.050em",
        color: "var(--chip-text-success)",
        textTransform: "uppercase",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.label}</span>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      height: 20,
      borderRadius: 100,
      backgroundColor: "var(--chip-bg-error)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--dropdown-option-corner-s) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-4) * 1px)",
      paddingRight: "calc(var(--dropdown-option-corner-s) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-4) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"Ubuntu Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: "calc(var(--chip-typo-size-xs) * 1px)",
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: 1,
        letterSpacing: "0.050em",
        color: "var(--chip-text-error)",
        textTransform: "uppercase",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.label}</span>
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      height: 20,
      borderRadius: 100,
      backgroundColor: "var(--chip-bg-info)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--dropdown-option-corner-s) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-4) * 1px)",
      paddingRight: "calc(var(--dropdown-option-corner-s) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-4) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"Ubuntu Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: "calc(var(--chip-typo-size-xs) * 1px)",
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: 1,
        letterSpacing: "0.050em",
        color: "var(--chip-text-info)",
        textTransform: "uppercase",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.label}</span>
    </div>
  );
  const __body5 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      height: 20,
      borderRadius: 100,
      backgroundColor: "var(--chip-bg-warning)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--dropdown-option-corner-s) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-4) * 1px)",
      paddingRight: "calc(var(--dropdown-option-corner-s) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-4) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"Ubuntu Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: "calc(var(--chip-typo-size-xs) * 1px)",
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: 1,
        letterSpacing: "0.050em",
        color: "var(--chip-text-warning)",
        textTransform: "uppercase",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.label}</span>
    </div>
  );
  const __body6 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      height: 22,
      borderRadius: 100,
      backgroundColor: "var(--chip-bg-success)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-4) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-4) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"Ubuntu Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: "calc(var(--chip-typo-size-s) * 1px)",
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: 1,
        letterSpacing: "0.050em",
        color: "var(--chip-text-success)",
        textTransform: "uppercase",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.label}</span>
    </div>
  );
  const __body7 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      height: 22,
      borderRadius: 100,
      backgroundColor: "var(--chip-bg-error)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-4) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-4) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"Ubuntu Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: "calc(var(--chip-typo-size-s) * 1px)",
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: 1,
        letterSpacing: "0.050em",
        color: "var(--chip-text-error)",
        textTransform: "uppercase",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.label}</span>
    </div>
  );
  const __body8 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      height: 22,
      borderRadius: 100,
      backgroundColor: "var(--chip-bg-warning)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-4) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-4) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"Ubuntu Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: "calc(var(--chip-typo-size-s) * 1px)",
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: 1,
        letterSpacing: "0.050em",
        color: "var(--chip-text-warning)",
        textTransform: "uppercase",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.label}</span>
    </div>
  );
  const __body9 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      height: 26,
      borderRadius: 100,
      backgroundColor: "var(--chip-bg-success)",
      display: "flex",
      flexDirection: "row",
      padding: "6px 12px 6px 12px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingTop: "calc(var(--numbers-uniques-6) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingBottom: "calc(var(--numbers-uniques-6) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"Ubuntu Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: "calc(var(--chip-typo-size-m) * 1px)",
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: 1,
        letterSpacing: "0.050em",
        color: "var(--chip-text-success)",
        textTransform: "uppercase",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.label}</span>
    </div>
  );
  const __body10 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      height: 26,
      borderRadius: 100,
      backgroundColor: "var(--chip-bg-error)",
      display: "flex",
      flexDirection: "row",
      padding: "6px 12px 6px 12px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingTop: "calc(var(--numbers-uniques-6) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingBottom: "calc(var(--numbers-uniques-6) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"Ubuntu Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: "calc(var(--chip-typo-size-m) * 1px)",
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: 1,
        letterSpacing: "0.050em",
        color: "var(--chip-text-error)",
        textTransform: "uppercase",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.label}</span>
    </div>
  );
  const __body11 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      height: 26,
      borderRadius: 100,
      backgroundColor: "var(--chip-bg-warning)",
      display: "flex",
      flexDirection: "row",
      padding: "6px 12px 6px 12px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingTop: "calc(var(--numbers-uniques-6) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingBottom: "calc(var(--numbers-uniques-6) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"Ubuntu Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: "calc(var(--chip-typo-size-m) * 1px)",
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: 1,
        letterSpacing: "0.050em",
        color: "var(--chip-text-warning)",
        textTransform: "uppercase",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.label}</span>
    </div>
  );
  const __body12 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      height: 28,
      borderRadius: 100,
      backgroundColor: "var(--chip-bg-success)",
      display: "flex",
      flexDirection: "row",
      padding: "6px 12px 6px 12px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingTop: "calc(var(--numbers-uniques-6) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingBottom: "calc(var(--numbers-uniques-6) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"Ubuntu Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: "calc(var(--chip-typo-size-l) * 1px)",
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: 1,
        letterSpacing: "0.050em",
        color: "var(--chip-text-success)",
        textTransform: "uppercase",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.label}</span>
    </div>
  );
  const __body13 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      height: 28,
      borderRadius: 100,
      backgroundColor: "var(--chip-bg-error)",
      display: "flex",
      flexDirection: "row",
      padding: "6px 12px 6px 12px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingTop: "calc(var(--numbers-uniques-6) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingBottom: "calc(var(--numbers-uniques-6) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"Ubuntu Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: "calc(var(--chip-typo-size-l) * 1px)",
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: 1,
        letterSpacing: "0.050em",
        color: "var(--chip-text-error)",
        textTransform: "uppercase",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.label}</span>
    </div>
  );
  const __body14 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      height: 28,
      borderRadius: 100,
      backgroundColor: "var(--chip-bg-info)",
      display: "flex",
      flexDirection: "row",
      padding: "6px 12px 6px 12px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingTop: "calc(var(--numbers-uniques-6) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingBottom: "calc(var(--numbers-uniques-6) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"Ubuntu Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: "calc(var(--chip-typo-size-l) * 1px)",
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: 1,
        letterSpacing: "0.050em",
        color: "var(--chip-text-info)",
        textTransform: "uppercase",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.label}</span>
    </div>
  );
  const __body15 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      height: 28,
      borderRadius: 100,
      backgroundColor: "var(--chip-bg-warning)",
      display: "flex",
      flexDirection: "row",
      padding: "6px 12px 6px 12px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingTop: "calc(var(--numbers-uniques-6) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingBottom: "calc(var(--numbers-uniques-6) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"Ubuntu Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: "calc(var(--chip-typo-size-l) * 1px)",
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: 1,
        letterSpacing: "0.050em",
        color: "var(--chip-text-warning)",
        textTransform: "uppercase",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.label}</span>
    </div>
  );
  const __impls = {
    // figma: Size=M, Feedback=Info
    "size=m|feedback=info": __body0,
    // figma: Size=S, Feedback=Info
    "size=s|feedback=info": __body1,
    // figma: Size=Xs, Feedback=Success
    "size=xs|feedback=success": __body2,
    // figma: Size=Xs, Feedback=Error
    "size=xs|feedback=error": __body3,
    // figma: Size=Xs, Feedback=Info
    "size=xs|feedback=info": __body4,
    // figma: Size=Xs, Feedback=Warning
    "size=xs|feedback=warning": __body5,
    // figma: Size=S, Feedback=Success
    "size=s|feedback=success": __body6,
    // figma: Size=S, Feedback=Error
    "size=s|feedback=error": __body7,
    // figma: Size=S, Feedback=Warning
    "size=s|feedback=warning": __body8,
    // figma: Size=M, Feedback=Success
    "size=m|feedback=success": __body9,
    // figma: Size=M, Feedback=Error
    "size=m|feedback=error": __body10,
    // figma: Size=M, Feedback=Warning
    "size=m|feedback=warning": __body11,
    // figma: Size=L, Feedback=Success
    "size=l|feedback=success": __body12,
    // figma: Size=L, Feedback=Error
    "size=l|feedback=error": __body13,
    // figma: Size=L, Feedback=Info
    "size=l|feedback=info": __body14,
    // figma: Size=L, Feedback=Warning
    "size=l|feedback=warning": __body15,
  };
  return (__impls[__vkey(props)] ?? __body1)();
}
export default Chip;
