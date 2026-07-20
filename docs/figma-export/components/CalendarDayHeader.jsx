// figma node: 2:156675 Calendar / Day Header
export function CalendarDayHeader(_p = {}) {
  const props = { ..._p, dayText: _p.dayText ?? "Su" };
  return (
    <div
      className={props.className}
      style={{
        width: "calc(var(--width-w-8) * 1px)",
        height: 21,
        borderRadius: 8,
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "relative",
          fontFamily:
            'Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontWeight: 400,
          fontSize: 12,
          whiteSpace: "nowrap",
          lineHeight: "16px",
          color: "var(--base-muted-foreground)",
          flexShrink: 0,
        }}
      >
        {props.dayText}
      </span>
    </div>
  );
}
export default CalendarDayHeader;
