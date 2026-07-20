// figma node: 2:165 Action arrow
export function ActionArrow(_p = {}) {
  const props = _p;
  return (
    <div
      className={props.className}
      style={{
        width: "calc(var(--2) * 1px)",
        height: "calc(var(--2) * 1px)",
        position: "relative",
        color: "rgb(36,39,41)",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 3,
          top: 3,
          width: 10.535,
          height: 10.9,
          border: "1px dashed currentColor",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          fontSize: 10,
          opacity: 0.45,
        }}
      >
        Union
      </div>
    </div>
  );
}
export default ActionArrow;
