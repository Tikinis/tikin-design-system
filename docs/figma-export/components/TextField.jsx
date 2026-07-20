import { Value2 } from './Value2.jsx';

// figma node: 2:5155 TextField (24 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "state=" + __venc(p.state) + '|' + "feedback=" + __venc(p.feedback) + '|' + "size=" + __venc(p.size);

export function TextField(_p = {}) {
  const props = { ..._p, label: _p.label ?? "Label", state: _p.state ?? "deafult", placeholder: _p.placeholder ?? "Placeholder", feedback: _p.feedback ?? "default", error: _p.error ?? "Feedback error", showIcon: _p.showIcon ?? true, size: _p.size ?? "xs" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 325,
      height: "calc(var(--numbers-tailwind-56) * 1px)",
      borderRadius: 12,
      backgroundColor: "var(--textfield-bg-default)",
      borderTop: "0.500px solid var(--textfield-stroke-default)",
      borderRight: "0.500px solid var(--textfield-stroke-default)",
      borderBottom: "0.500px solid var(--textfield-stroke-default)",
      borderLeft: "0.500px solid var(--textfield-stroke-default)",
      display: "flex",
      flexDirection: "row",
      padding: "16px 16px 16px 16px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-16) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-16) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-16) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-16) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 16,
        lineHeight: 1.2000000476837158,
        color: "var(--textfield-text-label-default)",
        flexGrow: 1,
      }}>{props.label}</span>
      {props.showIcon && (
      <div style={{
          position: "relative",
          width: 20,
          height: 20,
          flexShrink: 0,
          color: "rgb(110,110,110)",
        }}>{props.icon1 ?? <Value2 value={"eye"} style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
      )}
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 325,
      height: "calc(var(--numbers-tailwind-48) * 1px)",
      borderRadius: 10,
      backgroundColor: "var(--textfield-bg-default)",
      borderTop: "0.500px solid var(--textfield-stroke-default)",
      borderRight: "0.500px solid var(--textfield-stroke-default)",
      borderBottom: "0.500px solid var(--textfield-stroke-default)",
      borderLeft: "0.500px solid var(--textfield-stroke-default)",
      display: "flex",
      flexDirection: "row",
      padding: "12px 12px 12px 12px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-12) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 16,
        lineHeight: 1.2000000476837158,
        color: "var(--textfield-text-label-default)",
        flexGrow: 1,
      }}>{props.label}</span>
      {props.showIcon && (
      <div style={{
          position: "relative",
          width: 20,
          height: 20,
          flexShrink: 0,
          color: "rgb(110,110,110)",
        }}>{props.icon1 ?? <Value2 value={"eye"} style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
      )}
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 325,
      height: "calc(var(--numbers-tailwind-40) * 1px)",
      borderRadius: 8,
      backgroundColor: "var(--textfield-bg-default)",
      borderTop: "0.500px solid var(--textfield-stroke-default)",
      borderRight: "0.500px solid var(--textfield-stroke-default)",
      borderBottom: "0.500px solid var(--textfield-stroke-default)",
      borderLeft: "0.500px solid var(--textfield-stroke-default)",
      display: "flex",
      flexDirection: "row",
      padding: "8px 8px 8px 8px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-8) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 14,
        lineHeight: 1.2000000476837158,
        color: "var(--textfield-text-label-default)",
        flexGrow: 1,
      }}>{props.label}</span>
      {props.showIcon && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "rgb(110,110,110)",
        }}>{props.icon1 ?? <Value2 value={"eye"} />}</div>
      )}
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: 325,
      height: 32,
      borderRadius: 6,
      backgroundColor: "var(--textfield-bg-default)",
      borderTop: "0.500px solid var(--textfield-stroke-default)",
      borderRight: "0.500px solid var(--textfield-stroke-default)",
      borderBottom: "0.500px solid var(--textfield-stroke-default)",
      borderLeft: "0.500px solid var(--textfield-stroke-default)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
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
        fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 12,
        lineHeight: 1.2000000476837158,
        color: "var(--textfield-text-label-default)",
        flexGrow: 1,
      }}>{props.label}</span>
      {props.showIcon && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "rgb(110,110,110)",
        }}>{props.icon1 ?? <Value2 value={"eye"} />}</div>
      )}
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: 325,
      height: "calc(var(--numbers-tailwind-56) * 1px)",
      borderRadius: 12,
      backgroundColor: "var(--textfield-bg-pressed)",
      borderTop: "1px solid var(--textfield-stroke-pressed)",
      borderRight: "1px solid var(--textfield-stroke-pressed)",
      borderBottom: "1px solid var(--textfield-stroke-pressed)",
      borderLeft: "1px solid var(--textfield-stroke-pressed)",
      display: "flex",
      flexDirection: "row",
      padding: "16px 16px 16px 16px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-16) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-16) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-16) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-16) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 10,
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-label-pressed)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>{props.label}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-placeholder-pressed)",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "|"}</span>
      </div>
      {props.showIcon && (
      <div style={{
          position: "relative",
          width: 20,
          height: 20,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.icon1 ?? <Value2 value={"eye"} style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
      )}
    </div>
  );
  const __body5 = () => (
    <div className={props.className} style={{
      width: 325,
      height: "calc(var(--numbers-tailwind-48) * 1px)",
      borderRadius: 10,
      backgroundColor: "var(--textfield-bg-pressed)",
      borderTop: "1px solid var(--textfield-stroke-pressed)",
      borderRight: "1px solid var(--textfield-stroke-pressed)",
      borderBottom: "1px solid var(--textfield-stroke-pressed)",
      borderLeft: "1px solid var(--textfield-stroke-pressed)",
      display: "flex",
      flexDirection: "row",
      padding: "12px 12px 12px 12px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-12) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 10,
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-label-pressed)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>{props.label}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-placeholder-pressed)",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "|"}</span>
      </div>
      {props.showIcon && (
      <div style={{
          position: "relative",
          width: 20,
          height: 20,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.icon1 ?? <Value2 value={"eye"} style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
      )}
    </div>
  );
  const __body6 = () => (
    <div className={props.className} style={{
      width: 325,
      height: "calc(var(--numbers-tailwind-40) * 1px)",
      borderRadius: 8,
      backgroundColor: "var(--textfield-bg-pressed)",
      borderTop: "1px solid var(--textfield-stroke-pressed)",
      borderRight: "1px solid var(--textfield-stroke-pressed)",
      borderBottom: "1px solid var(--textfield-stroke-pressed)",
      borderLeft: "1px solid var(--textfield-stroke-pressed)",
      display: "flex",
      flexDirection: "row",
      padding: "8px 8px 8px 8px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-8) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 10,
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-label-pressed)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>{props.label}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-placeholder-pressed)",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "|"}</span>
      </div>
      {props.showIcon && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.icon1 ?? <Value2 value={"eye"} />}</div>
      )}
    </div>
  );
  const __body7 = () => (
    <div className={props.className} style={{
      width: 325,
      height: 32,
      borderRadius: 6,
      backgroundColor: "var(--textfield-bg-pressed)",
      borderTop: "1px solid var(--textfield-stroke-pressed)",
      borderRight: "1px solid var(--textfield-stroke-pressed)",
      borderBottom: "1px solid var(--textfield-stroke-pressed)",
      borderLeft: "1px solid var(--textfield-stroke-pressed)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
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
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 10,
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-label-pressed)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>{props.label}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-placeholder-pressed)",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "|"}</span>
      </div>
      {props.showIcon && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.icon1 ?? <Value2 value={"eye"} />}</div>
      )}
    </div>
  );
  const __body8 = () => (
    <div className={props.className} style={{
      width: 325,
      height: "calc(var(--numbers-tailwind-56) * 1px)",
      borderRadius: 12,
      backgroundColor: "var(--textfield-bg-active)",
      borderTop: "1px solid var(--textfield-stroke-active)",
      borderRight: "1px solid var(--textfield-stroke-active)",
      borderBottom: "1px solid var(--textfield-stroke-active)",
      borderLeft: "1px solid var(--textfield-stroke-active)",
      display: "flex",
      flexDirection: "row",
      padding: "16px 16px 16px 16px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-16) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-16) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-16) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-16) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 10,
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-label-active)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>{props.label}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-placeholder-active)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>{props.placeholder}</span>
      </div>
      {props.showIcon && (
      <div style={{
          position: "relative",
          width: 20,
          height: 20,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.icon1 ?? <Value2 value={"eye"} style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
      )}
    </div>
  );
  const __body9 = () => (
    <div className={props.className} style={{
      width: 325,
      height: "calc(var(--numbers-tailwind-48) * 1px)",
      borderRadius: 10,
      backgroundColor: "var(--textfield-bg-active)",
      borderTop: "1px solid var(--textfield-stroke-active)",
      borderRight: "1px solid var(--textfield-stroke-active)",
      borderBottom: "1px solid var(--textfield-stroke-active)",
      borderLeft: "1px solid var(--textfield-stroke-active)",
      display: "flex",
      flexDirection: "row",
      padding: "12px 12px 12px 12px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-12) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 10,
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-label-active)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>{props.label}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-placeholder-active)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>{props.placeholder}</span>
      </div>
      {props.showIcon && (
      <div style={{
          position: "relative",
          width: 20,
          height: 20,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.icon1 ?? <Value2 value={"eye"} style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
      )}
    </div>
  );
  const __body10 = () => (
    <div className={props.className} style={{
      width: 325,
      height: "calc(var(--numbers-tailwind-40) * 1px)",
      borderRadius: 8,
      backgroundColor: "var(--textfield-bg-active)",
      borderTop: "1px solid var(--textfield-stroke-active)",
      borderRight: "1px solid var(--textfield-stroke-active)",
      borderBottom: "1px solid var(--textfield-stroke-active)",
      borderLeft: "1px solid var(--textfield-stroke-active)",
      display: "flex",
      flexDirection: "row",
      padding: "8px 8px 8px 8px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-8) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 10,
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-label-active)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>{props.label}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-placeholder-active)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>{props.placeholder}</span>
      </div>
      {props.showIcon && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.icon1 ?? <Value2 value={"eye"} />}</div>
      )}
    </div>
  );
  const __body11 = () => (
    <div className={props.className} style={{
      width: 325,
      height: 32,
      borderRadius: 6,
      backgroundColor: "var(--textfield-bg-active)",
      borderTop: "1px solid var(--textfield-stroke-active)",
      borderRight: "1px solid var(--textfield-stroke-active)",
      borderBottom: "1px solid var(--textfield-stroke-active)",
      borderLeft: "1px solid var(--textfield-stroke-active)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
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
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 10,
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-label-active)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>{props.label}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-placeholder-active)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>{props.placeholder}</span>
      </div>
      {props.showIcon && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.icon1 ?? <Value2 value={"eye"} />}</div>
      )}
    </div>
  );
  const __body12 = () => (
    <div className={props.className} style={{
      width: 325,
      height: "calc(var(--numbers-tailwind-56) * 1px)",
      borderRadius: 12,
      backgroundColor: "var(--textfield-bg-active)",
      borderTop: "0.500px solid var(--textfield-stroke-active-success)",
      borderRight: "0.500px solid var(--textfield-stroke-active-success)",
      borderBottom: "0.500px solid var(--textfield-stroke-active-success)",
      borderLeft: "0.500px solid var(--textfield-stroke-active-success)",
      display: "flex",
      flexDirection: "row",
      padding: "16px 16px 16px 16px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-16) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-16) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-16) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-16) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 10,
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-label-active-success)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>{props.label}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 12,
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-placeholder-active-success)",
          flexShrink: 0,
        }}>{props.placeholder}</span>
      </div>
      {props.showIcon && (
      <div style={{
          position: "relative",
          width: 20,
          height: 20,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.icon1 ?? <Value2 value={"eye"} style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
      )}
    </div>
  );
  const __body13 = () => (
    <div className={props.className} style={{
      width: 325,
      height: "calc(var(--numbers-tailwind-48) * 1px)",
      borderRadius: 10,
      backgroundColor: "var(--textfield-bg-active)",
      borderTop: "0.500px solid var(--textfield-stroke-active-success)",
      borderRight: "0.500px solid var(--textfield-stroke-active-success)",
      borderBottom: "0.500px solid var(--textfield-stroke-active-success)",
      borderLeft: "0.500px solid var(--textfield-stroke-active-success)",
      display: "flex",
      flexDirection: "row",
      padding: "12px 12px 12px 12px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-12) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 10,
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-label-active-success)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>{props.label}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 12,
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-placeholder-active-success)",
          flexShrink: 0,
        }}>{props.placeholder}</span>
      </div>
      {props.showIcon && (
      <div style={{
          position: "relative",
          width: 20,
          height: 20,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.icon1 ?? <Value2 value={"eye"} style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
      )}
    </div>
  );
  const __body14 = () => (
    <div className={props.className} style={{
      width: 325,
      height: "calc(var(--numbers-tailwind-40) * 1px)",
      borderRadius: 8,
      backgroundColor: "var(--textfield-bg-active)",
      borderTop: "0.500px solid var(--textfield-stroke-active-success)",
      borderRight: "0.500px solid var(--textfield-stroke-active-success)",
      borderBottom: "0.500px solid var(--textfield-stroke-active-success)",
      borderLeft: "0.500px solid var(--textfield-stroke-active-success)",
      display: "flex",
      flexDirection: "row",
      padding: "8px 8px 8px 8px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-8) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 10,
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-label-active-success)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>{props.label}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 12,
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-placeholder-active-success)",
          flexShrink: 0,
        }}>{props.placeholder}</span>
      </div>
      {props.showIcon && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.icon1 ?? <Value2 value={"eye"} />}</div>
      )}
    </div>
  );
  const __body15 = () => (
    <div className={props.className} style={{
      width: 325,
      height: 32,
      borderRadius: 6,
      backgroundColor: "var(--textfield-bg-active)",
      borderTop: "0.500px solid var(--textfield-stroke-active-success)",
      borderRight: "0.500px solid var(--textfield-stroke-active-success)",
      borderBottom: "0.500px solid var(--textfield-stroke-active-success)",
      borderLeft: "0.500px solid var(--textfield-stroke-active-success)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
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
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 10,
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-label-active-success)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>{props.label}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 12,
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-placeholder-active-success)",
          flexShrink: 0,
        }}>{props.placeholder}</span>
      </div>
      {props.showIcon && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.icon1 ?? <Value2 value={"eye"} />}</div>
      )}
    </div>
  );
  const __body16 = () => (
    <div className={props.className} style={{
      width: 325,
      height: "calc(var(--numbers-tailwind-56) * 1px)",
      borderRadius: 12,
      backgroundColor: "var(--textfield-bg-disabled)",
      borderTop: "0.500px solid var(--textfield-stroke-disabled)",
      borderRight: "0.500px solid var(--textfield-stroke-disabled)",
      borderBottom: "0.500px solid var(--textfield-stroke-disabled)",
      borderLeft: "0.500px solid var(--textfield-stroke-disabled)",
      display: "flex",
      flexDirection: "row",
      padding: "16px 16px 16px 16px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-16) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-16) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-16) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-16) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 10,
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-label-disabled)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>{props.label}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-placeholder-disabled)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>{props.placeholder}</span>
      </div>
      {props.showIcon && (
      <div style={{
          position: "relative",
          width: 20,
          height: 20,
          flexShrink: 0,
          color: "rgb(110,110,110)",
        }}>{props.icon1 ?? <Value2 value={"eye"} style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
      )}
    </div>
  );
  const __body17 = () => (
    <div className={props.className} style={{
      width: 325,
      height: "calc(var(--numbers-tailwind-48) * 1px)",
      borderRadius: 10,
      backgroundColor: "var(--textfield-bg-disabled)",
      borderTop: "0.500px solid var(--textfield-stroke-disabled)",
      borderRight: "0.500px solid var(--textfield-stroke-disabled)",
      borderBottom: "0.500px solid var(--textfield-stroke-disabled)",
      borderLeft: "0.500px solid var(--textfield-stroke-disabled)",
      display: "flex",
      flexDirection: "row",
      padding: "12px 12px 12px 12px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-12) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-12) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 10,
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-label-disabled)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>{props.label}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-placeholder-disabled)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>{props.placeholder}</span>
      </div>
      {props.showIcon && (
      <div style={{
          position: "relative",
          width: 20,
          height: 20,
          flexShrink: 0,
          color: "rgb(110,110,110)",
        }}>{props.icon1 ?? <Value2 value={"eye"} style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
      )}
    </div>
  );
  const __body18 = () => (
    <div className={props.className} style={{
      width: 325,
      height: "calc(var(--numbers-tailwind-40) * 1px)",
      borderRadius: 8,
      backgroundColor: "var(--textfield-bg-disabled)",
      borderTop: "0.500px solid var(--textfield-stroke-disabled)",
      borderRight: "0.500px solid var(--textfield-stroke-disabled)",
      borderBottom: "0.500px solid var(--textfield-stroke-disabled)",
      borderLeft: "0.500px solid var(--textfield-stroke-disabled)",
      display: "flex",
      flexDirection: "row",
      padding: "8px 8px 8px 8px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      gap: "calc(var(--numbers-tailwind-0) * 1px)",
      paddingLeft: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingTop: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingRight: "calc(var(--numbers-tailwind-8) * 1px)",
      paddingBottom: "calc(var(--numbers-tailwind-8) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 10,
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-label-disabled)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>{props.label}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-placeholder-disabled)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>{props.placeholder}</span>
      </div>
      {props.showIcon && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "rgb(110,110,110)",
        }}>{props.icon1 ?? <Value2 value={"eye"} />}</div>
      )}
    </div>
  );
  const __body19 = () => (
    <div className={props.className} style={{
      width: 325,
      height: 32,
      borderRadius: 6,
      backgroundColor: "var(--textfield-bg-disabled)",
      borderTop: "0.500px solid var(--textfield-stroke-disabled)",
      borderRight: "0.500px solid var(--textfield-stroke-disabled)",
      borderBottom: "0.500px solid var(--textfield-stroke-disabled)",
      borderLeft: "0.500px solid var(--textfield-stroke-disabled)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
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
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 10,
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-label-disabled)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>{props.label}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-placeholder-disabled)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>{props.placeholder}</span>
      </div>
      {props.showIcon && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "rgb(110,110,110)",
        }}>{props.icon1 ?? <Value2 value={"eye"} />}</div>
      )}
    </div>
  );
  const __body20 = () => (
    <div className={props.className} style={{
      width: 325,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--numbers-tailwind-4) * 1px)",
      alignItems: "flex-start",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        height: 32,
        borderRadius: 6,
        backgroundColor: "rgba(255,46,46,0.05)",
        borderTop: "1px solid var(--textfield-stroke-active-error)",
        borderRight: "1px solid var(--textfield-stroke-active-error)",
        borderBottom: "1px solid var(--textfield-stroke-active-error)",
        borderLeft: "1px solid var(--textfield-stroke-active-error)",
        display: "flex",
        flexDirection: "row",
        padding: "4px 8px 4px 8px",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-8) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-4) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-8) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-4) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          flexWrap: "nowrap",
          gap: "calc(var(--numbers-tailwind-0) * 1px)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 10,
            whiteSpace: "nowrap",
            lineHeight: 1.2000000476837158,
            color: "var(--textfield-text-label-active-success)",
            flexGrow: 1,
            alignSelf: "stretch",
          }}>{props.label}</span>
          <span style={{
            position: "relative",
            fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 12,
            whiteSpace: "nowrap",
            lineHeight: 1.2000000476837158,
            color: "var(--textfield-text-placeholder-active-error)",
            flexShrink: 0,
          }}>{props.placeholder}</span>
        </div>
        {props.showIcon && (
        <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
            color: "rgb(255,255,255)",
          }}>{props.icon1 ?? <Value2 value={"eye"} />}</div>
        )}
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        flexWrap: "nowrap",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 500,
          fontSize: 12,
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-feedback-color)",
          flexGrow: 1,
        }}>{props.error}</span>
      </div>
    </div>
  );
  const __body21 = () => (
    <div className={props.className} style={{
      width: 325,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--numbers-tailwind-4) * 1px)",
      alignItems: "flex-start",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        height: "calc(var(--numbers-tailwind-40) * 1px)",
        borderRadius: 8,
        backgroundColor: "rgba(255,46,46,0.05)",
        borderTop: "1px solid var(--textfield-stroke-active-error)",
        borderRight: "1px solid var(--textfield-stroke-active-error)",
        borderBottom: "1px solid var(--textfield-stroke-active-error)",
        borderLeft: "1px solid var(--textfield-stroke-active-error)",
        display: "flex",
        flexDirection: "row",
        padding: "8px 8px 8px 8px",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-8) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-8) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-8) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-8) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          flexWrap: "nowrap",
          gap: "calc(var(--numbers-tailwind-0) * 1px)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 10,
            whiteSpace: "nowrap",
            lineHeight: 1.2000000476837158,
            color: "var(--textfield-text-label-active-error)",
            flexGrow: 1,
            alignSelf: "stretch",
          }}>{props.label}</span>
          <span style={{
            position: "relative",
            fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 12,
            whiteSpace: "nowrap",
            lineHeight: 1.2000000476837158,
            color: "var(--textfield-text-placeholder-active-error)",
            flexShrink: 0,
          }}>{props.placeholder}</span>
        </div>
        {props.showIcon && (
        <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
            color: "var(--textfield-icon-active-error)",
          }}>{props.icon1 ?? <Value2 value={"eye"} />}</div>
        )}
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        flexWrap: "nowrap",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 500,
          fontSize: 12,
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-feedback-color)",
          flexGrow: 1,
        }}>{props.error}</span>
      </div>
    </div>
  );
  const __body22 = () => (
    <div className={props.className} style={{
      width: 325,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--numbers-tailwind-8) * 1px)",
      alignItems: "flex-start",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        height: "calc(var(--numbers-tailwind-48) * 1px)",
        borderRadius: 10,
        backgroundColor: "rgba(255,46,46,0.05)",
        borderTop: "1px solid var(--textfield-stroke-active-error)",
        borderRight: "1px solid var(--textfield-stroke-active-error)",
        borderBottom: "1px solid var(--textfield-stroke-active-error)",
        borderLeft: "1px solid var(--textfield-stroke-active-error)",
        display: "flex",
        flexDirection: "row",
        padding: "12px 12px 12px 12px",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-12) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-12) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-12) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-12) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          flexWrap: "nowrap",
          gap: "calc(var(--numbers-tailwind-0) * 1px)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 10,
            whiteSpace: "nowrap",
            lineHeight: 1.2000000476837158,
            color: "var(--textfield-text-label-active-error)",
            flexGrow: 1,
            alignSelf: "stretch",
          }}>{props.label}</span>
          <span style={{
            position: "relative",
            fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 12,
            whiteSpace: "nowrap",
            lineHeight: 1.2000000476837158,
            color: "var(--textfield-text-placeholder-active-error)",
            flexShrink: 0,
          }}>{props.placeholder}</span>
        </div>
        {props.showIcon && (
        <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
            color: "var(--textfield-icon-active-error)",
          }}>{props.icon1 ?? <Value2 value={"eye"} />}</div>
        )}
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        flexWrap: "nowrap",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 500,
          fontSize: 12,
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-feedback-color)",
          flexGrow: 1,
        }}>{props.error}</span>
      </div>
    </div>
  );
  const __body23 = () => (
    <div className={props.className} style={{
      width: 325,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--numbers-tailwind-8) * 1px)",
      alignItems: "flex-start",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        height: "calc(var(--numbers-tailwind-56) * 1px)",
        borderRadius: 12,
        backgroundColor: "rgba(255,46,46,0.05)",
        borderTop: "1px solid var(--textfield-stroke-active-error)",
        borderRight: "1px solid var(--textfield-stroke-active-error)",
        borderBottom: "1px solid var(--textfield-stroke-active-error)",
        borderLeft: "1px solid var(--textfield-stroke-active-error)",
        display: "flex",
        flexDirection: "row",
        padding: "16px 16px 16px 16px",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-16) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-16) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-16) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-16) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          flexWrap: "nowrap",
          gap: "calc(var(--numbers-tailwind-0) * 1px)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 10,
            whiteSpace: "nowrap",
            lineHeight: 1.2000000476837158,
            color: "var(--textfield-text-label-active-error)",
            flexGrow: 1,
            alignSelf: "stretch",
          }}>{props.label}</span>
          <span style={{
            position: "relative",
            fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 12,
            whiteSpace: "nowrap",
            lineHeight: 1.2000000476837158,
            color: "var(--textfield-text-placeholder-active-error)",
            flexShrink: 0,
          }}>{props.placeholder}</span>
        </div>
        {props.showIcon && (
        <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
            color: "var(--textfield-icon-active-error)",
          }}>{props.icon1 ?? <Value2 value={"eye"} />}</div>
        )}
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        flexWrap: "nowrap",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Ubuntu Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 500,
          fontSize: 12,
          lineHeight: 1.2000000476837158,
          color: "var(--textfield-text-feedback-color)",
          flexGrow: 1,
        }}>{props.error}</span>
      </div>
    </div>
  );
  const __impls = {
    // figma: State=Deafult, Feedback=Default, Size=L
    "state=deafult|feedback=default|size=l": __body0,
    // figma: State=Deafult, Feedback=Default, Size=M
    "state=deafult|feedback=default|size=m": __body1,
    // figma: State=Deafult, Feedback=Default, Size=S
    "state=deafult|feedback=default|size=s": __body2,
    // figma: State=Deafult, Feedback=Default, Size=Xs
    "state=deafult|feedback=default|size=xs": __body3,
    // figma: State=Pressed, Feedback=Default, Size=L
    "state=pressed|feedback=default|size=l": __body4,
    // figma: State=Pressed, Feedback=Default, Size=M
    "state=pressed|feedback=default|size=m": __body5,
    // figma: State=Pressed, Feedback=Default, Size=S
    "state=pressed|feedback=default|size=s": __body6,
    // figma: State=Pressed, Feedback=Default, Size=Xs
    "state=pressed|feedback=default|size=xs": __body7,
    // figma: State=Active, Feedback=Default, Size=L
    "state=active|feedback=default|size=l": __body8,
    // figma: State=Active, Feedback=Default, Size=M
    "state=active|feedback=default|size=m": __body9,
    // figma: State=Active, Feedback=Default, Size=S
    "state=active|feedback=default|size=s": __body10,
    // figma: State=Active, Feedback=Default, Size=Xs
    "state=active|feedback=default|size=xs": __body11,
    // figma: State=Active, Feedback=Success, Size=L
    "state=active|feedback=success|size=l": __body12,
    // figma: State=Active, Feedback=Success, Size=M
    "state=active|feedback=success|size=m": __body13,
    // figma: State=Active, Feedback=Success, Size=S
    "state=active|feedback=success|size=s": __body14,
    // figma: State=Active, Feedback=Success, Size=Xs
    "state=active|feedback=success|size=xs": __body15,
    // figma: State=Disabled, Feedback=Default, Size=L
    "state=disabled|feedback=default|size=l": __body16,
    // figma: State=Disabled, Feedback=Default, Size=M
    "state=disabled|feedback=default|size=m": __body17,
    // figma: State=Disabled, Feedback=Default, Size=S
    "state=disabled|feedback=default|size=s": __body18,
    // figma: State=Disabled, Feedback=Default, Size=Xs
    "state=disabled|feedback=default|size=xs": __body19,
    // figma: State=Active, Feedback=Error, Size=Xs
    "state=active|feedback=error|size=xs": __body20,
    // figma: State=Active, Feedback=Error, Size=S
    "state=active|feedback=error|size=s": __body21,
    // figma: State=Active, Feedback=Error, Size=M
    "state=active|feedback=error|size=m": __body22,
    // figma: State=Active, Feedback=Error, Size=L
    "state=active|feedback=error|size=l": __body23,
  };
  return (__impls[__vkey(props)] ?? __body3)();
}
export default TextField;
