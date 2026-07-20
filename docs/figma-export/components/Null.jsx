// figma node: 2:173 Null
export function Null(_p = {}) {
  const props = _p;
  return (
    <div
      className={props.className}
      style={{
        width: 16,
        height: 16,
        display: "flex",
        flexDirection: "row",
        gap: 8,
        padding: "2px 2px 2px 2px",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 12,
          borderRadius: 2,
          outline: "1px dashed rgb(36,39,41)",
          outlineOffset: "-1px",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      />
    </div>
  );
}
export default Null;
