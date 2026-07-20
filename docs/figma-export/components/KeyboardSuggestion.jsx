// figma node: 2:5290 Keyboard/Suggestion (6 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "type=" + __venc(p.type) + '|' + "dark=" + __venc(p.dark);

export function KeyboardSuggestion(_p = {}) {
  const props = { ..._p, type: _p.type ?? "password", dark: _p.dark ?? "on" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 393,
      height: 50,
      backgroundColor: "rgb(212,214,220)",
      position: "relative",
      color: "rgb(0,0,0)",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 144,
        top: 14,
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
      }}>
        <svg width={12.428} height={22.610} viewBox="0 0 12.428 22.610" fill="none" style={{
          position: "relative",
          width: 12.428,
          height: 22.61,
          flexShrink: 0,
        }}>
          <path d={"M 6.214 0 C 2.751 0 0 2.76 0 6.196 C 0 8.604 1.354 10.775 3.516 11.813 L 3.516 19.793 C 3.516 20.171 3.639 20.584 3.946 20.856 L 5.643 22.359 C 6.012 22.685 6.627 22.72 7.04 22.307 L 9.765 19.582 C 10.23 19.116 10.222 18.404 9.756 17.938 L 8.613 16.778 L 10.389 14.994 C 10.837 14.537 10.846 13.816 10.389 13.351 L 8.815 11.777 C 11.145 10.529 12.428 8.525 12.428 6.196 C 12.428 2.769 9.659 0 6.214 0 Z M 6.214 5.221 C 5.396 5.221 4.729 4.553 4.729 3.727 C 4.729 2.9 5.396 2.241 6.214 2.241 C 7.031 2.241 7.699 2.909 7.699 3.727 C 7.699 4.553 7.031 5.221 6.214 5.221 Z"} fill="currentColor" fillRule="nonzero" />
        </svg>
        <span style={{
          position: "relative",
          fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 17,
          whiteSpace: "nowrap",
          lineHeight: "100%",
          letterSpacing: "-0.440px",
          color: "rgb(0,0,0)",
          flexShrink: 0,
        }}>{props.text1 ?? "Passwords"}</span>
      </div>
      <div style={{
        position: "absolute",
        left: 30,
        top: 13,
        width: 1,
        height: 24,
        backgroundColor: "rgb(189,190,195)",
      }} />
      <div style={{
        position: "absolute",
        left: 362,
        top: 13,
        width: 1,
        height: 24,
        backgroundColor: "rgb(189,190,195)",
      }} />
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 393,
      height: 50,
      backdropFilter: "blur(12px)",
      position: "relative",
      color: "rgb(255,255,255)",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 144,
        top: 14,
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
      }}>
        <svg width={12.428} height={22.610} viewBox="0 0 12.428 22.610" fill="none" style={{
          position: "relative",
          width: 12.428,
          height: 22.61,
          flexShrink: 0,
        }}>
          <path d={"M 6.214 0 C 2.751 0 0 2.76 0 6.196 C 0 8.604 1.354 10.775 3.516 11.813 L 3.516 19.793 C 3.516 20.171 3.639 20.584 3.946 20.856 L 5.643 22.359 C 6.012 22.685 6.627 22.72 7.04 22.307 L 9.765 19.582 C 10.23 19.116 10.222 18.404 9.756 17.938 L 8.613 16.778 L 10.389 14.994 C 10.837 14.537 10.846 13.816 10.389 13.351 L 8.815 11.777 C 11.145 10.529 12.428 8.525 12.428 6.196 C 12.428 2.769 9.659 0 6.214 0 Z M 6.214 5.221 C 5.396 5.221 4.729 4.553 4.729 3.727 C 4.729 2.9 5.396 2.241 6.214 2.241 C 7.031 2.241 7.699 2.909 7.699 3.727 C 7.699 4.553 7.031 5.221 6.214 5.221 Z"} fill="currentColor" fillRule="nonzero" />
        </svg>
        <span style={{
          position: "relative",
          fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 17,
          whiteSpace: "nowrap",
          lineHeight: "100%",
          letterSpacing: "-0.440px",
          color: "rgb(255,255,255)",
          flexShrink: 0,
        }}>{props.text1 ?? "Passwords"}</span>
      </div>
      <div style={{
        position: "absolute",
        left: 30,
        top: 13,
        width: 1,
        height: 24,
        backgroundColor: "rgb(106,106,106)",
      }} />
      <div style={{
        position: "absolute",
        left: 362,
        top: 13,
        width: 1,
        height: 24,
        backgroundColor: "rgb(106,106,106)",
      }} />
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 393,
      height: 50,
      backgroundColor: "rgb(212,214,220)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 145.5,
        top: 8,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 13,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: "100%",
          color: "rgb(0,0,0)",
          flexShrink: 0,
        }}>{props.text1 ?? "From Messages"}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 16,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: "100%",
          letterSpacing: "-0.020em",
          color: "rgb(0,0,0)",
          flexShrink: 0,
        }}>{props.text2 ?? "123456"}</span>
      </div>
      <div style={{
        position: "absolute",
        left: 30,
        top: 13,
        width: 1,
        height: 24,
        backgroundColor: "rgb(189,190,195)",
      }} />
      <div style={{
        position: "absolute",
        left: 362,
        top: 13,
        width: 1,
        height: 24,
        backgroundColor: "rgb(189,190,195)",
      }} />
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: 393,
      height: 50,
      backdropFilter: "blur(12px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 30,
        top: 13,
        width: 1,
        height: 24,
        backgroundColor: "rgb(106,106,106)",
      }} />
      <div style={{
        position: "absolute",
        left: 362,
        top: 13,
        width: 1,
        height: 24,
        backgroundColor: "rgb(106,106,106)",
      }} />
      <div style={{
        position: "absolute",
        left: 145.5,
        top: 8,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 13,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: "100%",
          color: "rgb(255,255,255)",
          flexShrink: 0,
        }}>{props.text1 ?? "From Messages"}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 16,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: "100%",
          letterSpacing: "-0.020em",
          color: "rgb(255,255,255)",
          flexShrink: 0,
        }}>{props.text2 ?? "123456"}</span>
      </div>
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: 393,
      height: 44,
      backgroundColor: "rgb(212,214,220)",
      display: "flex",
      flexDirection: "row",
      padding: "13px 0px 6px 0px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 17,
        textAlign: "center",
        lineHeight: "100%",
        color: "rgb(0,0,0)",
        flexGrow: 1,
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "Hi"}</span>
      <div style={{
        position: "relative",
        width: 1,
        borderRadius: 1,
        backgroundColor: "rgb(189,190,195)",
        flexShrink: 0,
        alignSelf: "stretch",
      }} />
      <span style={{
        position: "relative",
        fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 17,
        textAlign: "center",
        lineHeight: "100%",
        color: "rgb(0,0,0)",
        flexGrow: 1,
        whiteSpace: "nowrap",
      }}>{props.text2 ?? "I"}</span>
      <div style={{
        position: "relative",
        width: 1,
        backgroundColor: "rgb(189,190,195)",
        flexShrink: 0,
        alignSelf: "stretch",
      }} />
      <span style={{
        position: "relative",
        fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 17,
        textAlign: "center",
        lineHeight: "100%",
        color: "rgb(0,0,0)",
        flexGrow: 1,
        whiteSpace: "nowrap",
      }}>{props.text3 ?? "Ok"}</span>
    </div>
  );
  const __body5 = () => (
    <div className={props.className} style={{
      width: 393,
      height: 44,
      backdropFilter: "blur(12px)",
      display: "flex",
      flexDirection: "row",
      padding: "13px 0px 6px 0px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 17,
        textAlign: "center",
        lineHeight: "100%",
        color: "rgb(255,255,255)",
        flexGrow: 1,
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "Hi"}</span>
      <div style={{
        position: "relative",
        width: 1,
        borderRadius: 1,
        backgroundColor: "rgb(106,106,106)",
        flexShrink: 0,
        alignSelf: "stretch",
      }} />
      <span style={{
        position: "relative",
        fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 17,
        textAlign: "center",
        lineHeight: "100%",
        color: "rgb(255,255,255)",
        flexGrow: 1,
        whiteSpace: "nowrap",
      }}>{props.text2 ?? "I"}</span>
      <div style={{
        position: "relative",
        width: 1,
        backgroundColor: "rgb(106,106,106)",
        flexShrink: 0,
        alignSelf: "stretch",
      }} />
      <span style={{
        position: "relative",
        fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 400,
        fontSize: 17,
        textAlign: "center",
        lineHeight: "100%",
        color: "rgb(255,255,255)",
        flexGrow: 1,
        whiteSpace: "nowrap",
      }}>{props.text3 ?? "Ok"}</span>
    </div>
  );
  const __impls = {
    // figma: Type=Password,Dark=Off
    "type=password|dark=off": __body0,
    // figma: Type=Password,Dark=On
    "type=password|dark=on": __body1,
    // figma: Type=Messages,Dark=Off
    "type=messages|dark=off": __body2,
    // figma: Type=Messages,Dark=On
    "type=messages|dark=on": __body3,
    // figma: Type=Text,Dark=Off
    "type=text|dark=off": __body4,
    // figma: Type=Text,Dark=On
    "type=text|dark=on": __body5,
  };
  return (__impls[__vkey(props)] ?? __body1)();
}
export default KeyboardSuggestion;
