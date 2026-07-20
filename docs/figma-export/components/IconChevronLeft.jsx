// figma node: 2:156632 Icon / ChevronLeft
export function IconChevronLeft(_p = {}) {
  const props = _p;
  return (
    <div
      className={props.className}
      style={{
        width: 24,
        height: 24,
        overflow: "hidden",
        position: "relative",
        color: "var(--base-foreground)",
        ...props.style,
      }}
    >
      <svg
        width={6}
        height={12}
        viewBox="0 0 6 12"
        fill="none"
        style={{
          position: "absolute",
          left: 9,
          top: 6,
          width: 6,
          height: 12,
        }}
      >
        <path d={"M 6 12 L 0 6 L 6 0 Z"} fill="currentColor" fillRule="evenodd" />
      </svg>
    </div>
  );
}
export default IconChevronLeft;
