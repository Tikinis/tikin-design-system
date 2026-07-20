import { IconChevronLeft } from "./IconChevronLeft.jsx";
import { IconChevronRight } from "./IconChevronRight.jsx";

// figma node: 2:156649 Calendar / Arrow Button (8 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "variant=" + __venc(p.variant) + "|" + "state=" + __venc(p.state);

export function CalendarArrowButton(_p = {}) {
  const props = { ..._p, variant: _p.variant ?? "next", state: _p.state ?? "default" };
  const __body0 = () => (
    <div
      className={props.className}
      style={{
        width: "calc(var(--width-w-8) * 1px)",
        height: "calc(var(--height-h-8) * 1px)",
        opacity: 0.5,
        borderRadius: 8,
        backgroundColor: "var(--custom-background-dark-input-30)",
        display: "flex",
        flexDirection: "row",
        gap: 10,
        padding: "10px 10px 10px 10px",
        justifyContent: "center",
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
          width: 16,
          height: 16,
          flexShrink: 0,
        }}
      >
        {props.icon1 ?? (
          <IconChevronLeft style={{ transform: "scale(0.667, 0.667)", transformOrigin: "0 0" }} />
        )}
      </div>
    </div>
  );
  const __body1 = () => (
    <div
      className={props.className}
      style={{
        width: "calc(var(--width-w-8) * 1px)",
        height: "calc(var(--height-h-8) * 1px)",
        opacity: 0.5,
        overflow: "hidden",
        borderRadius: 8,
        backgroundColor: "var(--custom-background-dark-input-30)",
        boxShadow: "0px 0px 0px 3px rgba(163,163,163,0.5)",
        display: "flex",
        flexDirection: "row",
        gap: 10,
        padding: "10px 10px 10px 10px",
        justifyContent: "center",
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
          width: 16,
          height: 16,
          flexShrink: 0,
        }}
      >
        {props.icon1 ?? (
          <IconChevronLeft style={{ transform: "scale(0.667, 0.667)", transformOrigin: "0 0" }} />
        )}
      </div>
    </div>
  );
  const __body2 = () => (
    <div
      className={props.className}
      style={{
        width: "calc(var(--width-w-8) * 1px)",
        height: "calc(var(--height-h-8) * 1px)",
        borderRadius: 8,
        backgroundColor: "var(--custom-accent-dark-input-50)",
        display: "flex",
        flexDirection: "row",
        gap: 10,
        padding: "10px 10px 10px 10px",
        justifyContent: "center",
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
          width: 16,
          height: 16,
          flexShrink: 0,
        }}
      >
        {props.icon1 ?? (
          <IconChevronLeft style={{ transform: "scale(0.667, 0.667)", transformOrigin: "0 0" }} />
        )}
      </div>
    </div>
  );
  const __body3 = () => (
    <div
      className={props.className}
      style={{
        width: "calc(var(--width-w-8) * 1px)",
        height: "calc(var(--height-h-8) * 1px)",
        opacity: 0.5,
        borderRadius: 8,
        backgroundColor: "var(--custom-background-dark-input-30)",
        display: "flex",
        flexDirection: "row",
        gap: 10,
        padding: "10px 10px 10px 10px",
        justifyContent: "center",
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
          width: 16,
          height: 16,
          flexShrink: 0,
        }}
      >
        {props.icon1 ?? (
          <IconChevronRight style={{ transform: "scale(0.667, 0.667)", transformOrigin: "0 0" }} />
        )}
      </div>
    </div>
  );
  const __body4 = () => (
    <div
      className={props.className}
      style={{
        width: "calc(var(--width-w-8) * 1px)",
        height: "calc(var(--height-h-8) * 1px)",
        opacity: 0.5,
        overflow: "hidden",
        borderRadius: 8,
        backgroundColor: "var(--custom-background-dark-input-30)",
        boxShadow: "0px 0px 0px 3px rgba(163,163,163,0.5)",
        display: "flex",
        flexDirection: "row",
        gap: 10,
        padding: "10px 10px 10px 10px",
        justifyContent: "center",
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
          width: 16,
          height: 16,
          flexShrink: 0,
        }}
      >
        {props.icon1 ?? (
          <IconChevronRight style={{ transform: "scale(0.667, 0.667)", transformOrigin: "0 0" }} />
        )}
      </div>
    </div>
  );
  const __body5 = () => (
    <div
      className={props.className}
      style={{
        width: "calc(var(--width-w-8) * 1px)",
        height: "calc(var(--height-h-8) * 1px)",
        borderRadius: 8,
        backgroundColor: "var(--custom-accent-dark-input-50)",
        display: "flex",
        flexDirection: "row",
        gap: 10,
        padding: "10px 10px 10px 10px",
        justifyContent: "center",
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
          width: 16,
          height: 16,
          flexShrink: 0,
        }}
      >
        {props.icon1 ?? (
          <IconChevronRight style={{ transform: "scale(0.667, 0.667)", transformOrigin: "0 0" }} />
        )}
      </div>
    </div>
  );
  const __impls = {
    // figma: Variant=Previous, State=Default
    "variant=previous|state=default": __body0,
    // figma: Variant=Previous, State=Focus
    "variant=previous|state=focus": __body1,
    // figma: Variant=Previous, State=Disabled
    "variant=previous|state=disabled": __body0,
    // figma: Variant=Previous, State=Hover
    "variant=previous|state=hover": __body2,
    // figma: Variant=Next, State=Default
    "variant=next|state=default": __body3,
    // figma: Variant=Next, State=Focus
    "variant=next|state=focus": __body4,
    // figma: Variant=Next, State=Disabled
    "variant=next|state=disabled": __body3,
    // figma: Variant=Next, State=Hover
    "variant=next|state=hover": __body5,
  };
  return (__impls[__vkey(props)] ?? __body3)();
}
export default CalendarArrowButton;
