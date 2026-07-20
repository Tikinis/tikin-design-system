import { Icon } from './Icon.jsx';
import { KeyGo } from './KeyGo.jsx';
import { KeyPrimary } from './KeyPrimary.jsx';
import { KeyReturn } from './KeyReturn.jsx';
import { KeySecondary } from './KeySecondary.jsx';
import { KeySpace } from './KeySpace.jsx';

// figma node: 2:5581 Keyboard/Input Type (10 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "type=" + __venc(p.type) + '|' + "dark=" + __venc(p.dark);

export function KeyboardInputType(_p = {}) {
  const props = { ..._p, type: _p.type ?? "search", dark: _p.dark ?? "on" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 387,
      display: "flex",
      flexDirection: "row",
      gap: 6,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <KeySecondary
        style={{
          position: "relative",
          width: 91,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}
        icon={"off"}
        dark={"off"}
      />
      <KeySpace
        style={{
          position: "relative",
          flexGrow: 1,
          alignSelf: "stretch",
          width: "auto",
          height: "auto",
        }}
        dark={"off"}
      />
      <KeyReturn
        style={{
          position: "relative",
          width: 91,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}
        icon={"off"}
        dark={"off"}
      />
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 387,
      display: "flex",
      flexDirection: "row",
      gap: 6,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <KeySecondary
        style={{
          position: "relative",
          width: 91,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}
        icon={"off"}
        dark={"on"}
      />
      <KeySpace
        style={{
          position: "relative",
          flexGrow: 1,
          alignSelf: "stretch",
          width: "auto",
          height: "auto",
        }}
        dark={"on"}
      />
      <KeyReturn
        style={{
          position: "relative",
          width: 91,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}
        icon={"off"}
        dark={"on"}
      />
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 387,
      display: "flex",
      flexDirection: "row",
      gap: 6,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <KeySecondary
        style={{
          position: "relative",
          width: 91,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}
        icon={"off"}
        dark={"off"}
      />
      <KeySpace
        style={{
          position: "relative",
          flexGrow: 1,
          alignSelf: "stretch",
          width: "auto",
          height: "auto",
        }}
        dark={"off"}
      />
      <div style={{
          position: "relative",
          width: 32,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon1 ?? <KeyPrimary icon1={<Icon icon={"dot"} style={{ width: "100%", height: "100%" }} />} dark={"off"} />}</div>
      <div style={{
          position: "relative",
          width: 63,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon2 ?? <KeyGo active={"on"} dark={"off"} />}</div>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: 387,
      display: "flex",
      flexDirection: "row",
      gap: 6,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <KeySecondary
        style={{
          position: "relative",
          width: 91,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}
        icon={"off"}
        dark={"on"}
      />
      <KeySpace
        style={{
          position: "relative",
          flexGrow: 1,
          alignSelf: "stretch",
          width: "auto",
          height: "auto",
        }}
        dark={"on"}
      />
      <div style={{
        position: "relative",
        width: 32,
        borderRadius: 4.599999904632568,
        backgroundColor: "rgba(255,255,255,0.3)",
        boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.4)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "absolute",
          left: 4,
          top: 9,
          width: 24,
          height: 24,
        }}>
          <svg width={2} height={2} viewBox="0 0 2 2" fill="none" style={{
            position: "absolute",
            left: 11,
            top: 14.5,
            width: 2,
            height: 2,
            color: "rgb(255,255,255)",
          }}>
            <path d={"M 1 2 C 1.554 2 2 1.546 2 1 C 2 0.446 1.554 0 1 0 C 0.454 0 0 0.446 0 1 C 0 1.546 0.454 2 1 2 Z"} fill="currentColor" fillRule="nonzero" />
          </svg>
        </div>
      </div>
      <div style={{
          position: "relative",
          width: 63,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon2 ?? <KeyGo active={"on"} dark={"on"} />}</div>
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: 387,
      display: "flex",
      flexDirection: "row",
      gap: 6,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <KeySecondary
        style={{
          position: "relative",
          width: 91,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}
        icon={"off"}
        dark={"off"}
      />
      <KeySpace
        style={{
          position: "relative",
          flexGrow: 1,
          alignSelf: "stretch",
          width: "auto",
          height: "auto",
        }}
        dark={"off"}
      />
      <div style={{
          position: "relative",
          width: 42,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon1 ?? <KeyPrimary dark={"off"} />}</div>
      <div style={{
          position: "relative",
          width: 42,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon2 ?? <KeyPrimary icon1={<Icon icon={"dot"} style={{ width: "100%", height: "100%" }} />} dark={"off"} />}</div>
      <KeyReturn
        style={{
          position: "relative",
          width: 91,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}
        icon={"off"}
        dark={"off"}
      />
    </div>
  );
  const __body5 = () => (
    <div className={props.className} style={{
      width: 387,
      display: "flex",
      flexDirection: "row",
      gap: 6,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <KeySecondary
        style={{
          position: "relative",
          width: 91,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}
        icon={"off"}
        dark={"on"}
      />
      <KeySpace
        style={{
          position: "relative",
          flexGrow: 1,
          alignSelf: "stretch",
          width: "auto",
          height: "auto",
        }}
        dark={"on"}
      />
      <div style={{
          position: "relative",
          width: 42,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon1 ?? <KeyPrimary dark={"on"} />}</div>
      <div style={{
        position: "relative",
        width: 42,
        borderRadius: 4.599999904632568,
        backgroundColor: "rgba(255,255,255,0.3)",
        boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.4)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "absolute",
          left: 9,
          top: 9,
          width: 24,
          height: 24,
        }}>
          <svg width={2} height={2} viewBox="0 0 2 2" fill="none" style={{
            position: "absolute",
            left: 11,
            top: 14.5,
            width: 2,
            height: 2,
            color: "rgb(255,255,255)",
          }}>
            <path d={"M 1 2 C 1.554 2 2 1.546 2 1 C 2 0.446 1.554 0 1 0 C 0.454 0 0 0.446 0 1 C 0 1.546 0.454 2 1 2 Z"} fill="currentColor" fillRule="nonzero" />
          </svg>
        </div>
      </div>
      <KeyReturn
        style={{
          position: "relative",
          width: 91,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}
        icon={"off"}
        dark={"on"}
      />
    </div>
  );
  const __body6 = () => (
    <div className={props.className} style={{
      width: 387,
      display: "flex",
      flexDirection: "row",
      gap: 6,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <KeySecondary
        style={{
          position: "relative",
          width: 91,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}
        icon={"off"}
        dark={"off"}
      />
      <div style={{
          position: "relative",
          flexGrow: 1,
          alignSelf: "stretch",
          width: "auto",
          height: "auto",
        }}>{props.icon1 ?? <KeyPrimary icon1={<Icon icon={"dot"} style={{ width: "100%", height: "100%" }} />} dark={"off"} />}</div>
      <div style={{
        position: "relative",
        borderRadius: 4.599999904632568,
        backgroundColor: "rgb(255,255,255)",
        boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.35)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "absolute",
          left: 18,
          top: 9,
          width: 24,
          height: 24,
        }}>
          <svg width={6.388} height={19.134} viewBox="0 0 6.388 19.134" fill="none" style={{
            position: "absolute",
            left: 8.801,
            top: 2.058,
            width: 6.388,
            height: 19.134,
            color: "rgb(0,0,0)",
          }}>
            <path d={"M 6.388 0 L 4.676 0 L 0 19.134 L 1.712 19.134 L 6.388 0 Z"} fill="currentColor" fillRule="nonzero" />
          </svg>
        </div>
      </div>
      <div style={{
          position: "relative",
          flexGrow: 1,
          alignSelf: "stretch",
          width: "auto",
          height: "auto",
        }}>{props.icon3 ?? <KeySpace text1={".com"} dark={"off"} />}</div>
      <KeyReturn
        style={{
          position: "relative",
          width: 91,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}
        icon={"off"}
        dark={"off"}
      />
    </div>
  );
  const __body7 = () => (
    <div className={props.className} style={{
      width: 387,
      display: "flex",
      flexDirection: "row",
      gap: 6,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <KeySecondary
        style={{
          position: "relative",
          width: 91,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}
        icon={"off"}
        dark={"on"}
      />
      <div style={{
        position: "relative",
        borderRadius: 4.599999904632568,
        backgroundColor: "rgba(255,255,255,0.3)",
        boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.4)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "absolute",
          left: 18,
          top: 9,
          width: 24,
          height: 24,
        }}>
          <svg width={2} height={2} viewBox="0 0 2 2" fill="none" style={{
            position: "absolute",
            left: 11,
            top: 14.5,
            width: 2,
            height: 2,
            color: "rgb(255,255,255)",
          }}>
            <path d={"M 1 2 C 1.554 2 2 1.546 2 1 C 2 0.446 1.554 0 1 0 C 0.454 0 0 0.446 0 1 C 0 1.546 0.454 2 1 2 Z"} fill="currentColor" fillRule="nonzero" />
          </svg>
        </div>
      </div>
      <div style={{
        position: "relative",
        borderRadius: 4.599999904632568,
        backgroundColor: "rgba(255,255,255,0.3)",
        boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.4)",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "absolute",
          left: 18,
          top: 9,
          width: 24,
          height: 24,
        }}>
          <svg width={6.388} height={19.134} viewBox="0 0 6.388 19.134" fill="none" style={{
            position: "absolute",
            left: 8.801,
            top: 2.058,
            width: 6.388,
            height: 19.134,
            color: "rgb(255,255,255)",
          }}>
            <path d={"M 6.388 0 L 4.676 0 L 0 19.134 L 1.712 19.134 L 6.388 0 Z"} fill="currentColor" fillRule="nonzero" />
          </svg>
        </div>
      </div>
      <div style={{
          position: "relative",
          flexGrow: 1,
          alignSelf: "stretch",
          width: "auto",
          height: "auto",
        }}>{props.icon3 ?? <KeySpace text1={".com"} dark={"on"} />}</div>
      <KeyReturn
        style={{
          position: "relative",
          width: 91,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}
        icon={"off"}
        dark={"on"}
      />
    </div>
  );
  const __body8 = () => (
    <div className={props.className} style={{
      width: 387,
      display: "flex",
      flexDirection: "row",
      gap: 6,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "relative",
          width: 42,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon1 ?? <KeySecondary icon={"off"} dark={"off"} />}</div>
      <div style={{
          position: "relative",
          width: 42,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon2 ?? <KeySecondary icon={"on"} dark={"off"} />}</div>
      <KeySpace
        style={{
          position: "relative",
          flexGrow: 1,
          alignSelf: "stretch",
          width: "auto",
          height: "auto",
        }}
        dark={"off"}
      />
      <KeySecondary
        style={{
          position: "relative",
          width: 91,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}
        icon1={<Icon icon={"enter"} style={{ width: "100%", height: "100%" }} />}
        icon={"on"}
        dark={"off"}
      />
    </div>
  );
  const __body9 = () => (
    <div className={props.className} style={{
      width: 387,
      display: "flex",
      flexDirection: "row",
      gap: 6,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "relative",
          width: 42,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon1 ?? <KeySecondary icon={"off"} dark={"on"} />}</div>
      <div style={{
          position: "relative",
          width: 41,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
        }}>{props.icon2 ?? <KeySecondary icon={"on"} dark={"on"} />}</div>
      <KeySpace
        style={{
          position: "relative",
          flexGrow: 1,
          alignSelf: "stretch",
          width: "auto",
          height: "auto",
        }}
        dark={"on"}
      />
      <div style={{
        position: "relative",
        width: 91,
        borderRadius: 4.599999904632568,
        backgroundColor: "rgba(255,255,255,0.1)",
        boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.4)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "absolute",
          left: 34,
          top: 9,
          width: 24,
          height: 24,
        }}>
          <svg width={18.500} height={15.500} viewBox="0 0 18.500 15.500" fill="none" style={{
            position: "absolute",
            left: 2.75,
            top: 4.25,
            width: 18.5,
            height: 15.5,
            color: "rgb(255,255,255)",
          }}>
            <path d={"M 0 10 L -0.518 9.458 C -0.666 9.6 -0.75 9.795 -0.75 10 C -0.75 10.205 -0.666 10.4 -0.518 10.542 L 0 10 Z M 10.75 -0.75 C 10.336 -0.75 10 -0.414 10 0 C 10 0.414 10.336 0.75 10.75 0.75 L 10.75 -0.75 Z M 6.268 5.042 C 6.568 4.756 6.578 4.281 6.292 3.982 C 6.006 3.682 5.531 3.672 5.232 3.958 L 6.268 5.042 Z M 5.232 16.042 C 5.531 16.328 6.006 16.318 6.292 16.018 C 6.578 15.719 6.568 15.244 6.268 14.958 L 5.232 16.042 Z M 0 10.75 L 17.5 10.75 L 17.5 9.25 L 0 9.25 L 0 10.75 Z M 19.25 9 L 19.25 1 L 17.75 1 L 17.75 9 L 19.25 9 Z M 17.5 -0.75 L 10.75 -0.75 L 10.75 0.75 L 17.5 0.75 L 17.5 -0.75 Z M 0.518 10.542 L 6.268 5.042 L 5.232 3.958 L -0.518 9.458 L 0.518 10.542 Z M -0.518 10.542 L 5.232 16.042 L 6.268 14.958 L 0.518 9.458 L -0.518 10.542 Z M 19.25 1 C 19.25 0.034 18.466 -0.75 17.5 -0.75 L 17.5 0.75 C 17.638 0.75 17.75 0.862 17.75 1 L 19.25 1 Z M 17.5 10.75 C 18.466 10.75 19.25 9.966 19.25 9 L 17.75 9 C 17.75 9.138 17.638 9.25 17.5 9.25 L 17.5 10.75 Z"} fill="currentColor" fillRule="nonzero" />
          </svg>
        </div>
      </div>
    </div>
  );
  const __impls = {
    // figma: Type=Text,Dark=Off
    "type=text|dark=off": __body0,
    // figma: Type=Text,Dark=On
    "type=text|dark=on": __body1,
    // figma: Type=Search,Dark=Off
    "type=search|dark=off": __body2,
    // figma: Type=Search,Dark=On
    "type=search|dark=on": __body3,
    // figma: Type=E-Mail,Dark=Off
    "type=e-mail|dark=off": __body4,
    // figma: Type=E-Mail,Dark=On
    "type=e-mail|dark=on": __body5,
    // figma: Type=URL,Dark=Off
    "type=url|dark=off": __body6,
    // figma: Type=URL,Dark=On
    "type=url|dark=on": __body7,
    // figma: Type=Emoji,Dark=Off
    "type=emoji|dark=off": __body8,
    // figma: Type=Emoji,Dark=On
    "type=emoji|dark=on": __body9,
  };
  return (__impls[__vkey(props)] ?? __body3)();
}
export default KeyboardInputType;
