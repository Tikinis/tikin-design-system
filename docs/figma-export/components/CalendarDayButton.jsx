// figma node: 2:156688 Calendar / Day Button (10 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "variant=" + __venc(p.variant) + '|' + "state=" + __venc(p.state);

export function CalendarDayButton(_p = {}) {
  const props = { ..._p, numberText: _p.numberText ?? "1", variant: _p.variant ?? "default", state: _p.state ?? "default" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: "calc(var(--width-w-8) * 1px)",
      height: "calc(var(--height-h-8) * 1px)",
      opacity: 0.5,
      borderRadius: 8,
      display: "flex",
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "Geist, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 14,
        textAlign: "center",
        lineHeight: "20px",
        color: "var(--base-muted-foreground)",
        flexGrow: 1,
      }}>{props.numberText}</span>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: "calc(var(--width-w-8) * 1px)",
      height: "calc(var(--height-h-8) * 1px)",
      borderRadius: 8,
      display: "flex",
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "Geist, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 14,
        textAlign: "center",
        lineHeight: "20px",
        color: "var(--base-foreground)",
        flexGrow: 1,
      }}>{props.numberText}</span>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: "calc(var(--width-w-8) * 1px)",
      height: "calc(var(--height-h-8) * 1px)",
      borderRadius: 8,
      backgroundColor: "var(--base-primary)",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "Geist, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 14,
        textAlign: "center",
        lineHeight: "20px",
        color: "var(--base-primary-foreground)",
        flexGrow: 1,
      }}>{props.numberText}</span>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: "calc(var(--width-w-8) * 1px)",
      height: "calc(var(--height-h-8) * 1px)",
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--base-primary)",
      boxShadow: "0px 0px 0px 3px rgba(163,163,163,0.5)",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "Geist, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 14,
        textAlign: "center",
        lineHeight: "20px",
        color: "var(--base-primary-foreground)",
        flexGrow: 1,
      }}>{props.numberText}</span>
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: "calc(var(--width-w-8) * 1px)",
      height: "calc(var(--height-h-8) * 1px)",
      borderRadius: 8,
      backgroundColor: "var(--base-accent)",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "Geist, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 14,
        textAlign: "center",
        lineHeight: "20px",
        color: "var(--base-accent-foreground)",
        flexGrow: 1,
      }}>{props.numberText}</span>
    </div>
  );
  const __body5 = () => (
    <div className={props.className} style={{
      width: "calc(var(--width-w-8) * 1px)",
      height: "calc(var(--height-h-8) * 1px)",
      opacity: 0.3,
      borderRadius: 8,
      background: "linear-gradient(rgba(255,255,255,0.5),rgba(255,255,255,0.5)), linear-gradient(var(--base-accent),var(--base-accent))",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "Geist, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 14,
        textAlign: "center",
        lineHeight: "20px",
        color: "var(--base-muted-foreground)",
        flexGrow: 1,
      }}>{props.numberText}</span>
    </div>
  );
  const __body6 = () => (
    <div className={props.className} style={{
      width: "calc(var(--width-w-8) * 1px)",
      height: "calc(var(--height-h-8) * 1px)",
      opacity: 0.5,
      borderRadius: 8,
      display: "flex",
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "Geist, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 14,
        textAlign: "center",
        lineHeight: "20px",
        color: "var(--base-foreground)",
        flexGrow: 1,
      }}>{props.numberText}</span>
    </div>
  );
  const __body7 = () => (
    <div className={props.className} style={{
      width: "calc(var(--width-w-8) * 1px)",
      height: "calc(var(--height-h-8) * 1px)",
      opacity: 0.5,
      borderRadius: 8,
      backgroundColor: "var(--base-accent)",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "Geist, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 14,
        textAlign: "center",
        lineHeight: "20px",
        color: "var(--base-foreground)",
        flexGrow: 1,
      }}>{props.numberText}</span>
    </div>
  );
  const __body8 = () => (
    <div className={props.className} style={{
      width: "calc(var(--width-w-8) * 1px)",
      height: "calc(var(--height-h-8) * 1px)",
      opacity: 0.5,
      borderRadius: 8,
      backgroundColor: "var(--base-accent)",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "Geist, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 14,
        textAlign: "center",
        lineHeight: "20px",
        color: "var(--base-muted-foreground)",
        flexGrow: 1,
      }}>{props.numberText}</span>
    </div>
  );
  const __impls = {
    // figma: Variant=Outside, State=Default
    "variant=outside|state=default": __body0,
    // figma: Variant=Default, State=Default
    "variant=default|state=default": __body1,
    // figma: Variant=Default, State=Selected
    "variant=default|state=selected": __body2,
    // figma: Variant=Default, State=Selected (Focus)
    "variant=default|state=selected (focus)": __body3,
    // figma: Variant=Current, State=Default
    "variant=current|state=default": __body4,
    // figma: Variant=Outside, State=Pressed
    "variant=outside|state=pressed": __body5,
    // figma: Variant=Default, State=Disabled
    "variant=default|state=disabled": __body6,
    // figma: Variant=Outside, State=Hover
    "variant=outside|state=hover": __body7,
    // figma: Variant=Outside, State=Selected
    "variant=outside|state=selected": __body8,
    // figma: Variant=Default, State=Hover
    "variant=default|state=hover": __body4,
  };
  return (__impls[__vkey(props)] ?? __body1)();
}
export default CalendarDayButton;
