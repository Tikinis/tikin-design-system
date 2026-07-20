import { Container } from './Container.jsx';

// figma node: 2:163011 Component 2 (6 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "darkMode=" + __venc(p.darkMode) + '|' + "actions=" + __venc(p.actions);

export function Component2(_p = {}) {
  const props = { ..._p, darkMode: _p.darkMode ?? false, actions: _p.actions ?? "single" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 270,
      height: 44,
      position: "relative",
      ...props.style,
    }}>
      <Container
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 270,
          height: 44,
        }}
        darkMode={false}
        bottomVar={"default"}
        top={false}
        bottom={true}
        stack={false}
      />
      <span style={{
        position: "absolute",
        left: 110,
        top: 11,
        width: 51,
        height: 22,
        fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 500,
        fontSize: 17,
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: "22px",
        letterSpacing: "-0.410px",
        color: "rgb(28,152,243)",
        textTransform: "capitalize",
      }}>{props.text1 ?? "Action"}</span>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 270,
      height: 44,
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 135,
        height: 44,
      }}>
        <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 135,
            height: 44,
          }}>
          <Container
            style={{ transform: "scale(0.500, 1)", transformOrigin: "0 0" }}
            darkMode={false}
            bottomVar={"left"}
            top={false}
            bottom={true}
            stack={false}
          />
        </div>
        <span style={{
          position: "absolute",
          left: 41,
          top: 11,
          width: 53,
          height: 22,
          fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 17,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: "22px",
          letterSpacing: "-0.410px",
          color: "rgb(28,152,243)",
          textTransform: "capitalize",
        }}>{props.text1 ?? "Cancel"}</span>
      </div>
      <div style={{
        position: "absolute",
        left: 135,
        top: 0,
        width: 135,
        height: 44,
      }}>
        <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 135,
            height: 44,
          }}>
          <Container
            style={{ transform: "scale(0.500, 1)", transformOrigin: "0 0" }}
            darkMode={false}
            bottomVar={"right"}
            top={false}
            bottom={true}
            stack={false}
          />
        </div>
        <span style={{
          position: "absolute",
          left: 43,
          top: 11,
          width: 51,
          height: 22,
          fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 500,
          fontSize: 17,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: "22px",
          letterSpacing: "-0.410px",
          color: "rgb(28,152,243)",
          textTransform: "capitalize",
        }}>{props.text2 ?? "Action"}</span>
      </div>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        height: 44,
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Container
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 270,
            height: 44,
          }}
          darkMode={false}
          bottomVar={"default"}
          top={false}
          bottom={false}
          stack={true}
        />
        <span style={{
          position: "absolute",
          left: 103,
          top: 11,
          width: 64,
          height: 22,
          fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 17,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: "22px",
          letterSpacing: "-0.410px",
          color: "rgb(28,152,243)",
          textTransform: "capitalize",
        }}>{props.text1 ?? "Option 1"}</span>
      </div>
      <div style={{
        position: "relative",
        height: 44,
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Container
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 270,
            height: 44,
          }}
          darkMode={false}
          bottomVar={"default"}
          top={false}
          bottom={false}
          stack={true}
        />
        <span style={{
          position: "absolute",
          left: 102,
          top: 11,
          width: 66,
          height: 22,
          fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 17,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: "22px",
          letterSpacing: "-0.410px",
          color: "rgb(28,152,243)",
          textTransform: "capitalize",
        }}>{props.text2 ?? "Option 2"}</span>
      </div>
      <div style={{
        position: "relative",
        height: 44,
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Container
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 270,
            height: 44,
          }}
          darkMode={false}
          bottomVar={"default"}
          top={false}
          bottom={true}
          stack={false}
        />
        <span style={{
          position: "absolute",
          left: 110,
          top: 11,
          width: 51,
          height: 22,
          fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 500,
          fontSize: 17,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: "22px",
          letterSpacing: "-0.410px",
          color: "rgb(28,152,243)",
          textTransform: "capitalize",
        }}>{props.text3 ?? "Action"}</span>
      </div>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: 270,
      height: 44,
      position: "relative",
      ...props.style,
    }}>
      <Container
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 270,
          height: 44,
        }}
        darkMode={true}
        bottomVar={"default"}
        top={false}
        bottom={true}
        stack={false}
      />
      <span style={{
        position: "absolute",
        left: 110,
        top: 11,
        width: 51,
        height: 22,
        fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 500,
        fontSize: 17,
        textAlign: "center",
        whiteSpace: "nowrap",
        lineHeight: "22px",
        letterSpacing: "-0.410px",
        color: "rgb(28,152,243)",
        textTransform: "capitalize",
      }}>{props.text1 ?? "Action"}</span>
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: 270,
      height: 44,
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 135,
        height: 44,
      }}>
        <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 135,
            height: 44,
          }}>
          <Container
            style={{ transform: "scale(0.500, 1)", transformOrigin: "0 0" }}
            darkMode={true}
            bottomVar={"left"}
            top={false}
            bottom={true}
            stack={false}
          />
        </div>
        <span style={{
          position: "absolute",
          left: 41,
          top: 11,
          width: 53,
          height: 22,
          fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 17,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: "22px",
          letterSpacing: "-0.410px",
          color: "rgb(28,152,243)",
          textTransform: "capitalize",
        }}>{props.text1 ?? "Cancel"}</span>
      </div>
      <div style={{
        position: "absolute",
        left: 135,
        top: 0,
        width: 135,
        height: 44,
      }}>
        <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 135,
            height: 44,
          }}>
          <Container
            style={{ transform: "scale(0.500, 1)", transformOrigin: "0 0" }}
            darkMode={true}
            bottomVar={"right"}
            top={false}
            bottom={true}
            stack={false}
          />
        </div>
        <span style={{
          position: "absolute",
          left: 43,
          top: 11,
          width: 51,
          height: 22,
          fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 500,
          fontSize: 17,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: "22px",
          letterSpacing: "-0.410px",
          color: "rgb(28,152,243)",
          textTransform: "capitalize",
        }}>{props.text2 ?? "Action"}</span>
      </div>
    </div>
  );
  const __body5 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        height: 44,
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Container
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 270,
            height: 44,
          }}
          darkMode={true}
          bottomVar={"default"}
          top={false}
          bottom={false}
          stack={true}
        />
        <span style={{
          position: "absolute",
          left: 103,
          top: 11,
          width: 64,
          height: 22,
          fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 17,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: "22px",
          letterSpacing: "-0.410px",
          color: "rgb(28,152,243)",
          textTransform: "capitalize",
        }}>{props.text1 ?? "Option 1"}</span>
      </div>
      <div style={{
        position: "relative",
        height: 44,
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Container
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 270,
            height: 44,
          }}
          darkMode={true}
          bottomVar={"default"}
          top={false}
          bottom={false}
          stack={true}
        />
        <span style={{
          position: "absolute",
          left: 102,
          top: 11,
          width: 66,
          height: 22,
          fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 17,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: "22px",
          letterSpacing: "-0.410px",
          color: "rgb(28,152,243)",
          textTransform: "capitalize",
        }}>{props.text2 ?? "Option 2"}</span>
      </div>
      <div style={{
        position: "relative",
        height: 44,
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Container
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 270,
            height: 44,
          }}
          darkMode={true}
          bottomVar={"default"}
          top={false}
          bottom={true}
          stack={false}
        />
        <span style={{
          position: "absolute",
          left: 110,
          top: 11,
          width: 51,
          height: 22,
          fontFamily: "\"SF Pro Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 500,
          fontSize: 17,
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: "22px",
          letterSpacing: "-0.410px",
          color: "rgb(28,152,243)",
          textTransform: "capitalize",
        }}>{props.text3 ?? "Action"}</span>
      </div>
    </div>
  );
  const __impls = {
    // figma: Dark Mode=No, Actions=Single
    "darkMode=false|actions=single": __body0,
    // figma: Dark Mode=No, Actions=Double
    "darkMode=false|actions=double": __body1,
    // figma: Dark Mode=No, Actions=Triple
    "darkMode=false|actions=triple": __body2,
    // figma: Dark Mode=Yes, Actions=Single
    "darkMode=true|actions=single": __body3,
    // figma: Dark Mode=Yes, Actions=Double
    "darkMode=true|actions=double": __body4,
    // figma: Dark Mode=Yes, Actions=Triple
    "darkMode=true|actions=triple": __body5,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Component2;
