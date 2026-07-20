import { KeyboardInputType } from './KeyboardInputType.jsx';
import { KeyboardLayout } from './KeyboardLayout.jsx';
import { KeyboardOption } from './KeyboardOption.jsx';
import { KeyboardSuggestion } from './KeyboardSuggestion.jsx';

// figma node: 2:5642 Keyboard/Default (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "dark=" + __venc(p.dark);

export function KeyboardDefault(_p = {}) {
  const props = { ..._p, option: _p.option ?? false, dark: _p.dark ?? "off", suggestion: _p.suggestion ?? false };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 393,
      backgroundColor: "rgb(212,214,220)",
      display: "flex",
      flexDirection: "column",
      padding: "0px 3px 0px 3px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      {props.option && (
      <KeyboardOption
        style={{
          position: "relative",
          width: 393,
          height: 44,
          flexShrink: 0,
        }}
        dark={false}
      />
      )}
      {props.suggestion && (
      <KeyboardSuggestion
        style={{
          position: "relative",
          width: 393,
          height: 44,
          flexShrink: 0,
        }}
        type={"text"}
        dark={"off"}
      />
      )}
      <div style={{
        position: "relative",
        height: 7,
        flexShrink: 0,
        alignSelf: "stretch",
      }} />
      <KeyboardLayout
        style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          width: "auto",
        }}
        layout={"abc"}
        dark={"off"}
      />
      <div style={{
        position: "relative",
        height: 13,
        flexShrink: 0,
        alignSelf: "stretch",
      }} />
      <KeyboardInputType
        style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          width: "auto",
        }}
        type={"text"}
        dark={"off"}
      />
      <div style={{
        position: "relative",
        height: 75,
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "absolute",
          left: 0,
          top: 41,
          width: 387,
          height: 34,
        }}>
          <div style={{
            position: "absolute",
            left: 124,
            top: 20,
            width: 139,
            height: 5,
            borderRadius: 100,
            backgroundColor: "rgb(0,0,0)",
          }} />
        </div>
      </div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 393,
      backgroundColor: "rgba(51,52,52,0.6)",
      backdropFilter: "blur(12px)",
      display: "flex",
      flexDirection: "column",
      padding: "0px 3px 0px 3px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      {props.option && (
      <KeyboardOption
        style={{
          position: "relative",
          width: 393,
          height: 44,
          flexShrink: 0,
        }}
        dark={true}
      />
      )}
      {props.suggestion && (
      <KeyboardSuggestion
        style={{
          position: "relative",
          width: 393,
          height: 44,
          flexShrink: 0,
        }}
        type={"text"}
        dark={"on"}
      />
      )}
      <div style={{
        position: "relative",
        height: 7,
        flexShrink: 0,
        alignSelf: "stretch",
      }} />
      <KeyboardLayout
        style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          width: "auto",
        }}
        layout={"abc"}
        dark={"on"}
      />
      <div style={{
        position: "relative",
        height: 13,
        flexShrink: 0,
        alignSelf: "stretch",
      }} />
      <KeyboardInputType
        style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          width: "auto",
        }}
        type={"text"}
        dark={"on"}
      />
      <div style={{
        position: "relative",
        height: 75,
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "absolute",
          left: 0,
          top: 41,
          width: 387,
          height: 34,
        }}>
          <div style={{
            position: "absolute",
            left: 124,
            top: 20,
            width: 139,
            height: 5,
            borderRadius: 100,
            backgroundColor: "rgb(255,255,255)",
          }} />
        </div>
      </div>
    </div>
  );
  const __impls = {
    // figma: Dark=Off
    "dark=off": __body0,
    // figma: Dark=On
    "dark=on": __body1,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default KeyboardDefault;
