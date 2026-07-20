// figma node: 2:163052 Dialog details (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "darkMode=" + __venc(p.darkMode);

export function DialogDetails(_p = {}) {
  const props = { ..._p, darkMode: _p.darkMode ?? true };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 270,
      borderRadius: "14px 14px 0px 0px",
      backgroundColor: "rgba(248,248,248,0.92)",
      backdropFilter: "blur(27.183px)",
      boxShadow: "inset 0px -1px 0px 0px rgba(0,0,0,0.15)",
      display: "flex",
      flexDirection: "column",
      gap: 5,
      padding: "16px 16px 16px 16px",
      alignItems: "flex-start",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 600,
        fontSize: 17,
        textAlign: "center",
        lineHeight: "22px",
        letterSpacing: "-0.410px",
        color: "rgb(0,0,0)",
        textTransform: "capitalize",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "Update Available"}</span>
      <span style={{
        position: "relative",
        fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 500,
        fontSize: 13,
        textAlign: "center",
        lineHeight: "18px",
        letterSpacing: "-0.080px",
        color: "rgb(0,0,0)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.text2 ?? "There are newer version available. Update Now?"}</span>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 270,
      borderRadius: "14px 14px 0px 0px",
      backgroundColor: "rgba(49,49,49,0.92)",
      backdropFilter: "blur(27.183px)",
      boxShadow: "inset 0px -1px 0px 0px rgba(130,130,130,0.25)",
      display: "flex",
      flexDirection: "column",
      gap: 5,
      padding: "16px 16px 16px 16px",
      alignItems: "flex-start",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 600,
        fontSize: 17,
        textAlign: "center",
        lineHeight: "22px",
        letterSpacing: "-0.410px",
        color: "rgb(255,255,255)",
        textTransform: "capitalize",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "Update Available"}</span>
      <span style={{
        position: "relative",
        fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 500,
        fontSize: 13,
        textAlign: "center",
        lineHeight: "18px",
        letterSpacing: "-0.080px",
        color: "rgb(255,255,255)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>{props.text2 ?? "There are newer version available. Update Now?"}</span>
    </div>
  );
  const __impls = {
    // figma: Dark Mode=No
    "darkMode=false": __body0,
    // figma: Dark Mode=Yes
    "darkMode=true": __body1,
  };
  return (__impls[__vkey(props)] ?? __body1)();
}
export default DialogDetails;
