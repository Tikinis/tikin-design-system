// figma node: 2:25828 Icon / Face ID
export function IconFaceID2(_p = {}) {
  const props = _p;
  return (
    <div className={props.className} style={{
      width: 72,
      height: 72,
      position: "relative",
      color: "rgb(0,0,0)",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 72,
        height: 72,
        border: "1px dashed currentColor",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        fontSize: 10,
        opacity: 0.45,
      }}>face id</div>
    </div>
  );
}
export default IconFaceID2;
