// figma node: 2:84571 tab item (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "state=" + __venc(p.state);

export function TabItem(_p = {}) {
  const props = { ..._p, state: _p.state ?? "selected" };
  const __body0 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        borderRadius: 3,
        backgroundColor: "rgb(255,255,255)",
        display: "flex",
        flexDirection: "row",
        gap: 10,
        padding: "6px 12px 6px 12px",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "relative",
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontWeight: 500,
          fontSize: 14,
          whiteSpace: "nowrap",
          lineHeight: "20px",
          color: "rgb(15,23,42)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.text1 ?? "Selected"}
      </span>
    </div>
  );
  const __body1 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        borderRadius: 3,
        display: "flex",
        flexDirection: "row",
        gap: 10,
        padding: "6px 12px 6px 12px",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        position: "relative",
        ...props.style,
      }}
    >
      <span
        style={{
          position: "relative",
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontWeight: 500,
          fontSize: 14,
          whiteSpace: "nowrap",
          lineHeight: "20px",
          color: "rgb(51,65,85)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.text1 ?? "Unselected"}
      </span>
    </div>
  );
  const __impls = {
    // figma: state=selected
    "state=selected": __body0,
    // figma: state=unselected
    "state=unselected": __body1,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default TabItem;
