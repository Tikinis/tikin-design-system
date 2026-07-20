import { Null } from './Null.jsx';

// figma node: 2:191 Button (4 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "variant=" + __venc(p.variant) + '|' + "state=" + __venc(p.state) + '|' + "size=" + __venc(p.size);

export function Button(_p = {}) {
  const props = { ..._p, text: _p.text ?? "Button label", iconRight: _p.iconRight ?? false, variant: _p.variant ?? "primary", state: _p.state ?? "default", size: _p.size ?? "m" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 213,
      height: "calc(var(--7) * 1px)",
      maxWidth: null,
      maxHeight: 56,
      borderRadius: 40,
      backgroundColor: "var(--button-primary-bg-default)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--s) * 1px)",
      padding: "20px 0px 20px 0px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      paddingTop: "calc(var(--2-5) * 1px)",
      paddingBottom: "calc(var(--2-5) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--1) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        flexShrink: 0,
      }}>
        <span style={{
          position: "relative",
          fontFamily: "Roobert, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 500,
          fontSize: 16,
          whiteSpace: "nowrap",
          lineHeight: "100%",
          color: "var(--button-primary-text-default)",
          flexShrink: 0,
        }}>{props.text}</span>
        {props.iconRight && (
        <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>{props.iconValue ?? <Null />}</div>
        )}
      </div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 213,
      height: "calc(var(--7) * 1px)",
      maxWidth: null,
      maxHeight: 56,
      borderRadius: 40,
      backgroundColor: "var(--button-secondary-bg-disable)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--s) * 1px)",
      padding: "20px 0px 20px 0px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      paddingTop: "calc(var(--2-5) * 1px)",
      paddingBottom: "calc(var(--2-5) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        flexWrap: "nowrap",
        flexShrink: 0,
      }}>
        <span style={{
          position: "relative",
          fontFamily: "Roobert, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 500,
          fontSize: 16,
          whiteSpace: "nowrap",
          lineHeight: "100%",
          color: "var(--button-primary-text-disable)",
          flexShrink: 0,
        }}>{props.text}</span>
        {props.iconRight && (
        <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>{props.iconValue ?? <Null />}</div>
        )}
      </div>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 213,
      height: "calc(var(--7) * 1px)",
      maxWidth: null,
      maxHeight: 56,
      borderRadius: 40,
      backgroundColor: "var(--button-secondary-bg-default)",
      borderTop: "1px solid var(--button-secondary-stroke-default)",
      borderRight: "1px solid var(--button-secondary-stroke-default)",
      borderBottom: "1px solid var(--button-secondary-stroke-default)",
      borderLeft: "1px solid var(--button-secondary-stroke-default)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--s) * 1px)",
      padding: "20px 0px 20px 0px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      paddingTop: "calc(var(--2-5) * 1px)",
      paddingBottom: "calc(var(--2-5) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        flexWrap: "nowrap",
        flexShrink: 0,
      }}>
        <span style={{
          position: "relative",
          fontFamily: "Roobert, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 500,
          fontSize: 16,
          whiteSpace: "nowrap",
          lineHeight: "100%",
          color: "var(--button-secondary-text-default)",
          flexShrink: 0,
        }}>{props.text}</span>
        {props.iconRight && (
        <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>{props.iconValue ?? <Null />}</div>
        )}
      </div>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: 213,
      height: "calc(var(--7) * 1px)",
      maxWidth: null,
      maxHeight: 56,
      borderRadius: 40,
      backgroundColor: "var(--button-primary-bg-disable)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--s) * 1px)",
      padding: "20px 0px 20px 0px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      paddingTop: "calc(var(--2-5) * 1px)",
      paddingBottom: "calc(var(--2-5) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        flexWrap: "nowrap",
        flexShrink: 0,
      }}>
        <span style={{
          position: "relative",
          fontFamily: "Roobert, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 500,
          fontSize: 16,
          whiteSpace: "nowrap",
          lineHeight: "100%",
          color: "var(--button-primary-text-disable)",
          flexShrink: 0,
        }}>{props.text}</span>
        {props.iconRight && (
        <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>{props.iconValue ?? <Null />}</div>
        )}
      </div>
    </div>
  );
  const __impls = {
    // figma: Variant=Primary, State=Default, Size=M
    "variant=primary|state=default|size=m": __body0,
    // figma: Variant=Primary, State=Disable, Size=M
    "variant=primary|state=disable|size=m": __body1,
    // figma: Variant=Secondary, State=Default, Size=M
    "variant=secondary|state=default|size=m": __body2,
    // figma: Variant=Secondary, State=Disable, Size=M
    "variant=secondary|state=disable|size=m": __body3,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Button;
