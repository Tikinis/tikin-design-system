import { Icon } from "./Icon.jsx";
import { KeyLetter } from "./KeyLetter.jsx";
import { KeySecondary } from "./KeySecondary.jsx";
import { KeyShift } from "./KeyShift.jsx";

// figma node: 2:5356 Keyboard/Layout (6 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "layout=" + __venc(p.layout) + "|" + "dark=" + __venc(p.dark);

export function KeyboardLayout(_p = {}) {
  const props = { ..._p, layout: _p.layout ?? "ABC", dark: _p.dark ?? "off" };
  const __body0 = () => (
    <div
      className={props.className}
      style={{
        width: 363,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 6,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        <div
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
        >
          {props.icon1 ?? <KeyLetter lowercase={"on"} dark={"off"} />}
        </div>
        <div
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
        >
          {props.icon2 ?? <KeyLetter text1={"W"} lowercase={"on"} dark={"off"} />}
        </div>
        <div
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
        >
          {props.icon3 ?? <KeyLetter text1={"E"} lowercase={"on"} dark={"off"} />}
        </div>
        <div
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
        >
          {props.icon4 ?? <KeyLetter text1={"R"} lowercase={"on"} dark={"off"} />}
        </div>
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"T"}
          lowercase={"on"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"Y"}
          lowercase={"on"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"U"}
          lowercase={"on"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"I"}
          lowercase={"on"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"O"}
          lowercase={"on"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"P"}
          lowercase={"on"}
          dark={"off"}
        />
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 6,
          padding: "0px 16px 0px 16px",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"A"}
          lowercase={"on"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"S"}
          lowercase={"on"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"D"}
          lowercase={"on"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"F"}
          lowercase={"on"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"G"}
          lowercase={"on"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"H"}
          lowercase={"on"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"J"}
          lowercase={"on"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"K"}
          lowercase={"on"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"L"}
          lowercase={"on"}
          dark={"off"}
        />
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 14,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        <KeyShift
          style={{
            position: "relative",
            width: 42,
            height: 42,
            flexShrink: 0,
          }}
          lowercase={"on"}
          dark={"off"}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 6,
            alignItems: "flex-start",
            flexWrap: "nowrap",
            flexGrow: 1,
          }}
        >
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"Z"}
            lowercase={"on"}
            dark={"off"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"X"}
            lowercase={"on"}
            dark={"off"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"C"}
            lowercase={"on"}
            dark={"off"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"V"}
            lowercase={"on"}
            dark={"off"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"B"}
            lowercase={"on"}
            dark={"off"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"N"}
            lowercase={"on"}
            dark={"off"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"M"}
            lowercase={"on"}
            dark={"off"}
          />
        </div>
        <KeySecondary
          style={{
            position: "relative",
            width: 42,
            height: 42,
            flexShrink: 0,
          }}
          icon1={<Icon icon={"delete"} style={{ width: "100%", height: "100%" }} />}
          icon={"on"}
          dark={"off"}
        />
      </div>
    </div>
  );
  const __body1 = () => (
    <div
      className={props.className}
      style={{
        width: 363,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 6,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        <div
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
        >
          {props.icon1 ?? <KeyLetter lowercase={"on"} dark={"on"} />}
        </div>
        <div
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
        >
          {props.icon2 ?? <KeyLetter text1={"W"} lowercase={"on"} dark={"on"} />}
        </div>
        <div
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
        >
          {props.icon3 ?? <KeyLetter text1={"E"} lowercase={"on"} dark={"on"} />}
        </div>
        <div
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
        >
          {props.icon4 ?? <KeyLetter text1={"R"} lowercase={"on"} dark={"on"} />}
        </div>
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"T"}
          lowercase={"on"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"Y"}
          lowercase={"on"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"U"}
          lowercase={"on"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"I"}
          lowercase={"on"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"O"}
          lowercase={"on"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"P"}
          lowercase={"on"}
          dark={"on"}
        />
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 6,
          padding: "0px 16px 0px 16px",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"A"}
          lowercase={"on"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"S"}
          lowercase={"on"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"D"}
          lowercase={"on"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"F"}
          lowercase={"on"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"G"}
          lowercase={"on"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"H"}
          lowercase={"on"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"J"}
          lowercase={"on"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"K"}
          lowercase={"on"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"L"}
          lowercase={"on"}
          dark={"on"}
        />
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 14,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        <KeyShift
          style={{
            position: "relative",
            width: 42,
            height: 42,
            flexShrink: 0,
          }}
          lowercase={"on"}
          dark={"on"}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 6,
            alignItems: "flex-start",
            flexWrap: "nowrap",
            flexGrow: 1,
          }}
        >
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"Z"}
            lowercase={"on"}
            dark={"on"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"X"}
            lowercase={"on"}
            dark={"on"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"C"}
            lowercase={"on"}
            dark={"on"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"V"}
            lowercase={"on"}
            dark={"on"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"B"}
            lowercase={"on"}
            dark={"on"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"N"}
            lowercase={"on"}
            dark={"on"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"M"}
            lowercase={"on"}
            dark={"on"}
          />
        </div>
        <div
          style={{
            position: "relative",
            width: 42,
            height: 42,
            borderRadius: 4.599999904632568,
            backgroundColor: "rgba(255,255,255,0.1)",
            boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.4)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 9,
              top: 9,
              width: 24,
              height: 24,
            }}
          >
            <svg
              width={23}
              height={17}
              viewBox="0 0 23 17"
              fill="none"
              style={{
                position: "absolute",
                left: 0.5,
                top: 3.5,
                width: 23,
                height: 17,
                color: "rgb(255,255,255)",
              }}
            >
              <path
                d={
                  "M 10.714 6.025 C 10.422 5.732 10.422 5.257 10.714 4.964 C 11.007 4.672 11.482 4.672 11.775 4.964 L 14.25 7.439 L 16.725 4.964 C 17.018 4.672 17.493 4.672 17.786 4.964 C 18.078 5.257 18.078 5.732 17.786 6.025 L 15.311 8.5 L 17.786 10.975 C 18.078 11.268 18.078 11.743 17.786 12.036 C 17.493 12.328 17.018 12.328 16.725 12.036 L 14.25 9.561 L 11.775 12.036 C 11.482 12.328 11.007 12.328 10.714 12.036 C 10.422 11.743 10.422 11.268 10.714 10.975 L 13.189 8.5 L 10.714 6.025 Z"
                }
                fill="currentColor"
                fillRule="nonzero"
              />
              <path
                d={
                  "M 7.621 0.879 L 0 8.5 L 7.621 16.121 C 8.184 16.684 8.947 17 9.743 17 L 20 17 C 21.657 17 23 15.657 23 14 L 23 3 C 23 1.343 21.657 0 20 0 L 9.743 0 C 8.947 0 8.184 0.316 7.621 0.879 Z M 20 15.7 L 9.743 15.7 C 9.292 15.7 8.859 15.521 8.541 15.202 L 1.839 8.5 L 8.541 1.798 C 8.859 1.479 9.292 1.3 9.743 1.3 L 20 1.3 C 20.939 1.3 21.7 2.061 21.7 3 L 21.7 14 C 21.7 14.939 20.939 15.7 20 15.7 Z"
                }
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
  const __body2 = () => (
    <div
      className={props.className}
      style={{
        width: 363,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 6,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        <div
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
        >
          {props.icon1 ?? <KeyLetter lowercase={"off"} dark={"off"} />}
        </div>
        <div
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
        >
          {props.icon2 ?? <KeyLetter text1={"W"} lowercase={"off"} dark={"off"} />}
        </div>
        <div
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
        >
          {props.icon3 ?? <KeyLetter text1={"E"} lowercase={"off"} dark={"off"} />}
        </div>
        <div
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
        >
          {props.icon4 ?? <KeyLetter text1={"R"} lowercase={"off"} dark={"off"} />}
        </div>
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"T"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"Y"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"U"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"I"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"O"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"P"}
          lowercase={"off"}
          dark={"off"}
        />
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 6,
          padding: "0px 16px 0px 16px",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"A"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"S"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"D"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"F"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"G"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"H"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"J"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"K"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"L"}
          lowercase={"off"}
          dark={"off"}
        />
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 14,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        <KeyShift
          style={{
            position: "relative",
            width: 42,
            height: 42,
            flexShrink: 0,
          }}
          lowercase={"off"}
          dark={"off"}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 6,
            alignItems: "flex-start",
            flexWrap: "nowrap",
            flexGrow: 1,
          }}
        >
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"Z"}
            lowercase={"off"}
            dark={"off"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"X"}
            lowercase={"off"}
            dark={"off"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"C"}
            lowercase={"off"}
            dark={"off"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"V"}
            lowercase={"off"}
            dark={"off"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"B"}
            lowercase={"off"}
            dark={"off"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"N"}
            lowercase={"off"}
            dark={"off"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"M"}
            lowercase={"off"}
            dark={"off"}
          />
        </div>
        <KeySecondary
          style={{
            position: "relative",
            width: 42,
            height: 42,
            flexShrink: 0,
          }}
          icon1={<Icon icon={"delete"} style={{ width: "100%", height: "100%" }} />}
          icon={"on"}
          dark={"off"}
        />
      </div>
    </div>
  );
  const __body3 = () => (
    <div
      className={props.className}
      style={{
        width: 363,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 6,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        <div
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
        >
          {props.icon1 ?? <KeyLetter lowercase={"off"} dark={"on"} />}
        </div>
        <div
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
        >
          {props.icon2 ?? <KeyLetter text1={"W"} lowercase={"off"} dark={"on"} />}
        </div>
        <div
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
        >
          {props.icon3 ?? <KeyLetter text1={"E"} lowercase={"off"} dark={"on"} />}
        </div>
        <div
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
        >
          {props.icon4 ?? <KeyLetter text1={"R"} lowercase={"off"} dark={"on"} />}
        </div>
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"T"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"Y"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"U"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"I"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"O"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"P"}
          lowercase={"off"}
          dark={"on"}
        />
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 6,
          padding: "0px 16px 0px 16px",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"A"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"S"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"D"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"F"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"G"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"H"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"J"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"K"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            height: 42,
            flexGrow: 1,
            width: "auto",
          }}
          text1={"L"}
          lowercase={"off"}
          dark={"on"}
        />
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 14,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        <KeyShift
          style={{
            position: "relative",
            width: 42,
            height: 42,
            flexShrink: 0,
          }}
          lowercase={"off"}
          dark={"on"}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 6,
            alignItems: "flex-start",
            flexWrap: "nowrap",
            flexGrow: 1,
          }}
        >
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"Z"}
            lowercase={"off"}
            dark={"on"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"X"}
            lowercase={"off"}
            dark={"on"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"C"}
            lowercase={"off"}
            dark={"on"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"V"}
            lowercase={"off"}
            dark={"on"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"B"}
            lowercase={"off"}
            dark={"on"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"N"}
            lowercase={"off"}
            dark={"on"}
          />
          <KeyLetter
            style={{
              position: "relative",
              height: 42,
              flexGrow: 1,
              width: "auto",
            }}
            text1={"M"}
            lowercase={"off"}
            dark={"on"}
          />
        </div>
        <div
          style={{
            position: "relative",
            width: 42,
            height: 42,
            borderRadius: 4.599999904632568,
            backgroundColor: "rgba(255,255,255,0.1)",
            boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.4)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 9,
              top: 9,
              width: 24,
              height: 24,
            }}
          >
            <svg
              width={23}
              height={17}
              viewBox="0 0 23 17"
              fill="none"
              style={{
                position: "absolute",
                left: 0.5,
                top: 3.5,
                width: 23,
                height: 17,
                color: "rgb(255,255,255)",
              }}
            >
              <path
                d={
                  "M 10.714 6.025 C 10.422 5.732 10.422 5.257 10.714 4.964 C 11.007 4.672 11.482 4.672 11.775 4.964 L 14.25 7.439 L 16.725 4.964 C 17.018 4.672 17.493 4.672 17.786 4.964 C 18.078 5.257 18.078 5.732 17.786 6.025 L 15.311 8.5 L 17.786 10.975 C 18.078 11.268 18.078 11.743 17.786 12.036 C 17.493 12.328 17.018 12.328 16.725 12.036 L 14.25 9.561 L 11.775 12.036 C 11.482 12.328 11.007 12.328 10.714 12.036 C 10.422 11.743 10.422 11.268 10.714 10.975 L 13.189 8.5 L 10.714 6.025 Z"
                }
                fill="currentColor"
                fillRule="nonzero"
              />
              <path
                d={
                  "M 7.621 0.879 L 0 8.5 L 7.621 16.121 C 8.184 16.684 8.947 17 9.743 17 L 20 17 C 21.657 17 23 15.657 23 14 L 23 3 C 23 1.343 21.657 0 20 0 L 9.743 0 C 8.947 0 8.184 0.316 7.621 0.879 Z M 20 15.7 L 9.743 15.7 C 9.292 15.7 8.859 15.521 8.541 15.202 L 1.839 8.5 L 8.541 1.798 C 8.859 1.479 9.292 1.3 9.743 1.3 L 20 1.3 C 20.939 1.3 21.7 2.061 21.7 3 L 21.7 14 C 21.7 14.939 20.939 15.7 20 15.7 Z"
                }
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
  const __body4 = () => (
    <div
      className={props.className}
      style={{
        width: 363,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          height: 42,
          display: "flex",
          flexDirection: "row",
          gap: 7,
          alignItems: "flex-start",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        <div
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
        >
          {props.icon1 ?? <KeyLetter text1={"1"} lowercase={"off"} dark={"off"} />}
        </div>
        <div
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
        >
          {props.icon2 ?? <KeyLetter text1={"2"} lowercase={"off"} dark={"off"} />}
        </div>
        <div
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
        >
          {props.icon3 ?? <KeyLetter text1={"3"} lowercase={"off"} dark={"off"} />}
        </div>
        <div
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
        >
          {props.icon4 ?? <KeyLetter text1={"4"} lowercase={"off"} dark={"off"} />}
        </div>
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"5"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"6"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"7"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"8"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"9"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"0"}
          lowercase={"off"}
          dark={"off"}
        />
      </div>
      <div
        style={{
          position: "relative",
          height: 42,
          display: "flex",
          flexDirection: "row",
          gap: 7,
          alignItems: "flex-start",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"-"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"/"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={":"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={";"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"("}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={")"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"€"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"&"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"@"}
          lowercase={"off"}
          dark={"off"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"“"}
          lowercase={"off"}
          dark={"off"}
        />
      </div>
      <div
        style={{
          position: "relative",
          height: 42,
          display: "flex",
          flexDirection: "row",
          gap: 14,
          alignItems: "flex-start",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        <KeySecondary
          style={{
            position: "relative",
            width: 42,
            flexShrink: 0,
            alignSelf: "stretch",
            height: "auto",
          }}
          icon1={<Icon icon={"tel"} style={{ width: "100%", height: "100%" }} />}
          icon={"on"}
          dark={"off"}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 7,
            alignItems: "flex-start",
            flexWrap: "nowrap",
            flexGrow: 1,
            alignSelf: "stretch",
          }}
        >
          <KeyLetter
            style={{
              position: "relative",
              flexGrow: 1,
              alignSelf: "stretch",
              width: "auto",
              height: "auto",
            }}
            text1={"."}
            lowercase={"off"}
            dark={"off"}
          />
          <KeyLetter
            style={{
              position: "relative",
              flexGrow: 1,
              alignSelf: "stretch",
              width: "auto",
              height: "auto",
            }}
            text1={","}
            lowercase={"off"}
            dark={"off"}
          />
          <KeyLetter
            style={{
              position: "relative",
              flexGrow: 1,
              alignSelf: "stretch",
              width: "auto",
              height: "auto",
            }}
            text1={"?"}
            lowercase={"off"}
            dark={"off"}
          />
          <KeyLetter
            style={{
              position: "relative",
              flexGrow: 1,
              alignSelf: "stretch",
              width: "auto",
              height: "auto",
            }}
            text1={"!"}
            lowercase={"off"}
            dark={"off"}
          />
          <KeyLetter
            style={{
              position: "relative",
              flexGrow: 1,
              alignSelf: "stretch",
              width: "auto",
              height: "auto",
            }}
            text1={"‘"}
            lowercase={"off"}
            dark={"off"}
          />
        </div>
        <KeySecondary
          style={{
            position: "relative",
            width: 42,
            flexShrink: 0,
            alignSelf: "stretch",
            height: "auto",
          }}
          icon1={<Icon icon={"delete"} style={{ width: "100%", height: "100%" }} />}
          icon={"on"}
          dark={"off"}
        />
      </div>
    </div>
  );
  const __body5 = () => (
    <div
      className={props.className}
      style={{
        width: 363,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          height: 42,
          display: "flex",
          flexDirection: "row",
          gap: 7,
          alignItems: "flex-start",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        <div
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
        >
          {props.icon1 ?? <KeyLetter text1={"1"} lowercase={"off"} dark={"on"} />}
        </div>
        <div
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
        >
          {props.icon2 ?? <KeyLetter text1={"2"} lowercase={"off"} dark={"on"} />}
        </div>
        <div
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
        >
          {props.icon3 ?? <KeyLetter text1={"3"} lowercase={"off"} dark={"on"} />}
        </div>
        <div
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
        >
          {props.icon4 ?? <KeyLetter text1={"4"} lowercase={"off"} dark={"on"} />}
        </div>
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"5"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"6"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"7"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"8"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"9"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"0"}
          lowercase={"off"}
          dark={"on"}
        />
      </div>
      <div
        style={{
          position: "relative",
          height: 42,
          display: "flex",
          flexDirection: "row",
          gap: 7,
          alignItems: "flex-start",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"-"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"/"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={":"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={";"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"("}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={")"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"€"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"&"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"@"}
          lowercase={"off"}
          dark={"on"}
        />
        <KeyLetter
          style={{
            position: "relative",
            flexGrow: 1,
            alignSelf: "stretch",
            width: "auto",
            height: "auto",
          }}
          text1={"“"}
          lowercase={"off"}
          dark={"on"}
        />
      </div>
      <div
        style={{
          position: "relative",
          height: 42,
          display: "flex",
          flexDirection: "row",
          gap: 14,
          alignItems: "flex-start",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 42,
            borderRadius: 4.599999904632568,
            backgroundColor: "rgba(255,255,255,0.1)",
            boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.4)",
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 9,
              top: 9,
              width: 24,
              height: 24,
            }}
          >
            <svg
              width={23.5}
              height={9.217}
              viewBox="0 0 23.500 9.217"
              fill="none"
              style={{
                position: "absolute",
                left: 0.5,
                top: 7,
                width: 23.5,
                height: 9.217,
                color: "rgb(255,255,255)",
              }}
            >
              <path
                d={
                  "M 1.266 5.608 L 1.71 3.608 L 0.5 3.608 L 0.5 2.608 L 1.932 2.608 L 2.512 0 L 3.488 0.217 L 2.957 2.608 L 4.932 2.608 L 5.512 0 L 6.488 0.217 L 5.957 2.608 L 7 2.608 L 7 3.608 L 5.734 3.608 L 5.29 5.608 L 6.5 5.608 L 6.5 6.608 L 5.068 6.608 L 4.488 9.217 L 3.512 9 L 4.043 6.608 L 2.068 6.608 L 1.488 9.217 L 0.512 9 L 1.043 6.608 L 0 6.608 L 0 5.608 L 1.266 5.608 Z M 2.29 5.608 L 4.266 5.608 L 4.71 3.608 L 2.734 3.608 L 2.29 5.608 Z"
                }
                fill="currentColor"
                fillRule="evenodd"
              />
              <path
                d={
                  "M 11.5 5.108 L 11.5 7.608 L 12.5 7.608 L 12.5 5.108 L 15 5.108 L 15 4.108 L 12.5 4.108 L 12.5 1.608 L 11.5 1.608 L 11.5 4.108 L 9 4.108 L 9 5.108 L 11.5 5.108 Z"
                }
                fill="currentColor"
                fillRule="nonzero"
              />
              <path
                d={"M 17 4.108 L 17 3.108 L 23.5 3.108 L 23.5 4.108 L 17 4.108 Z"}
                fill="currentColor"
                fillRule="nonzero"
              />
              <path
                d={"M 17 6.608 L 23.5 6.608 L 23.5 5.608 L 17 5.608 L 17 6.608 Z"}
                fill="currentColor"
                fillRule="nonzero"
              />
            </svg>
          </div>
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 7,
            alignItems: "flex-start",
            flexWrap: "nowrap",
            flexGrow: 1,
            alignSelf: "stretch",
          }}
        >
          <KeyLetter
            style={{
              position: "relative",
              flexGrow: 1,
              alignSelf: "stretch",
              width: "auto",
              height: "auto",
            }}
            text1={"."}
            lowercase={"off"}
            dark={"on"}
          />
          <KeyLetter
            style={{
              position: "relative",
              flexGrow: 1,
              alignSelf: "stretch",
              width: "auto",
              height: "auto",
            }}
            text1={","}
            lowercase={"off"}
            dark={"on"}
          />
          <KeyLetter
            style={{
              position: "relative",
              flexGrow: 1,
              alignSelf: "stretch",
              width: "auto",
              height: "auto",
            }}
            text1={"?"}
            lowercase={"off"}
            dark={"on"}
          />
          <KeyLetter
            style={{
              position: "relative",
              flexGrow: 1,
              alignSelf: "stretch",
              width: "auto",
              height: "auto",
            }}
            text1={"!"}
            lowercase={"off"}
            dark={"on"}
          />
          <KeyLetter
            style={{
              position: "relative",
              flexGrow: 1,
              alignSelf: "stretch",
              width: "auto",
              height: "auto",
            }}
            text1={"‘"}
            lowercase={"off"}
            dark={"on"}
          />
        </div>
        <div
          style={{
            position: "relative",
            width: 42,
            borderRadius: 4.599999904632568,
            backgroundColor: "rgba(255,255,255,0.1)",
            boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.4)",
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 9,
              top: 9,
              width: 24,
              height: 24,
            }}
          >
            <svg
              width={23}
              height={17}
              viewBox="0 0 23 17"
              fill="none"
              style={{
                position: "absolute",
                left: 0.5,
                top: 3.5,
                width: 23,
                height: 17,
                color: "rgb(255,255,255)",
              }}
            >
              <path
                d={
                  "M 10.714 6.025 C 10.422 5.732 10.422 5.257 10.714 4.964 C 11.007 4.672 11.482 4.672 11.775 4.964 L 14.25 7.439 L 16.725 4.964 C 17.018 4.672 17.493 4.672 17.786 4.964 C 18.078 5.257 18.078 5.732 17.786 6.025 L 15.311 8.5 L 17.786 10.975 C 18.078 11.268 18.078 11.743 17.786 12.036 C 17.493 12.328 17.018 12.328 16.725 12.036 L 14.25 9.561 L 11.775 12.036 C 11.482 12.328 11.007 12.328 10.714 12.036 C 10.422 11.743 10.422 11.268 10.714 10.975 L 13.189 8.5 L 10.714 6.025 Z"
                }
                fill="currentColor"
                fillRule="nonzero"
              />
              <path
                d={
                  "M 7.621 0.879 L 0 8.5 L 7.621 16.121 C 8.184 16.684 8.947 17 9.743 17 L 20 17 C 21.657 17 23 15.657 23 14 L 23 3 C 23 1.343 21.657 0 20 0 L 9.743 0 C 8.947 0 8.184 0.316 7.621 0.879 Z M 20 15.7 L 9.743 15.7 C 9.292 15.7 8.859 15.521 8.541 15.202 L 1.839 8.5 L 8.541 1.798 C 8.859 1.479 9.292 1.3 9.743 1.3 L 20 1.3 C 20.939 1.3 21.7 2.061 21.7 3 L 21.7 14 C 21.7 14.939 20.939 15.7 20 15.7 Z"
                }
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
  const __impls = {
    // figma: Layout=abc,Dark=Off
    "layout=abc|dark=off": __body0,
    // figma: Layout=abc,Dark=On
    "layout=abc|dark=on": __body1,
    // figma: Layout=ABC,Dark=Off
    "layout=ABC|dark=off": __body2,
    // figma: Layout=ABC,Dark=On
    "layout=ABC|dark=on": __body3,
    // figma: Layout=123,Dark=Off
    "layout=123|dark=off": __body4,
    // figma: Layout=123,Dark=On
    "layout=123|dark=on": __body5,
  };
  return (__impls[__vkey(props)] ?? __body2)();
}
export default KeyboardLayout;
