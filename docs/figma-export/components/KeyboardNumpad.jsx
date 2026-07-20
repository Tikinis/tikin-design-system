import { KeyNum } from './KeyNum.jsx';
import { KeyNumber } from './KeyNumber.jsx';
import { KeyRemove } from './KeyRemove.jsx';
import { KeyboardHomeBar } from './KeyboardHomeBar.jsx';

// figma node: 2:124 Keyboard/Numpad (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "dark=" + __venc(p.dark);

export function KeyboardNumpad(_p = {}) {
  const props = { ..._p, dark: _p.dark ?? "off" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 393,
      height: 289,
      backgroundColor: "rgb(212,214,220)",
      display: "flex",
      flexDirection: "column",
      padding: "6px 6px 6px 6px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "center",
        flexWrap: "nowrap",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 6,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <KeyNum
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"1"}
            abc={"on"}
            dark={"off"}
          />
          <KeyNum
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"2"}
            abc={"on"}
            dark={"off"}
          />
          <KeyNum
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"3"}
            abc={"on"}
            dark={"off"}
          />
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 6,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <KeyNum
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"4"}
            abc={"on"}
            dark={"off"}
          />
          <KeyNum
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"5"}
            abc={"on"}
            dark={"off"}
          />
          <KeyNum
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"6"}
            abc={"on"}
            dark={"off"}
          />
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 6,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <KeyNum
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"7"}
            abc={"on"}
            dark={"off"}
          />
          <KeyNum
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"8"}
            abc={"on"}
            dark={"off"}
          />
          <KeyNum
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"9"}
            abc={"on"}
            dark={"off"}
          />
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 6,
          alignItems: "flex-start",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <KeyNumber
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            type={"placeholder"}
            dark={"off"}
          />
          <KeyNum
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            abc={"off"}
            dark={"off"}
          />
          <KeyRemove
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            dark={"off"}
          />
        </div>
      </div>
      <KeyboardHomeBar
        style={{
          position: "relative",
          height: 75,
          flexShrink: 0,
          alignSelf: "stretch",
          width: "auto",
        }}
        iconLeft={false}
        iconRight={false}
        dark={"off"}
      />
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 393,
      height: 289,
      backgroundColor: "rgba(51,52,52,0.6)",
      backdropFilter: "blur(12px)",
      display: "flex",
      flexDirection: "column",
      padding: "6px 6px 6px 6px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "center",
        flexWrap: "nowrap",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 6,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <KeyNum
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"1"}
            abc={"on"}
            dark={"on"}
          />
          <KeyNum
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"2"}
            abc={"on"}
            dark={"on"}
          />
          <KeyNum
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"3"}
            abc={"on"}
            dark={"on"}
          />
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 6,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <KeyNum
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"4"}
            abc={"on"}
            dark={"on"}
          />
          <KeyNum
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"5"}
            abc={"on"}
            dark={"on"}
          />
          <KeyNum
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"6"}
            abc={"on"}
            dark={"on"}
          />
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 6,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <KeyNum
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"7"}
            abc={"on"}
            dark={"on"}
          />
          <KeyNum
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"8"}
            abc={"on"}
            dark={"on"}
          />
          <KeyNum
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"9"}
            abc={"on"}
            dark={"on"}
          />
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 6,
          alignItems: "flex-start",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <KeyNumber
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            type={"placeholder"}
            dark={"off"}
          />
          <KeyNum
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            abc={"off"}
            dark={"on"}
          />
          <KeyRemove
            style={{
              position: "relative",
              height: 46,
              flexGrow: 1,
              width: "auto",
            }}
            dark={"on"}
          />
        </div>
      </div>
      <KeyboardHomeBar
        style={{
          position: "relative",
          height: 75,
          flexShrink: 0,
          alignSelf: "stretch",
          width: "auto",
        }}
        iconLeft={false}
        iconRight={false}
        dark={"on"}
      />
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
export default KeyboardNumpad;
