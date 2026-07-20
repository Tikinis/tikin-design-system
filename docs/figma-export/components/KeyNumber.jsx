// figma node: 2:58 Key/Number (5 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "type=" + __venc(p.type) + "|" + "dark=" + __venc(p.dark);

export function KeyNumber(_p = {}) {
  const props = { ..._p, type: _p.type ?? "decimal", dark: _p.dark ?? "off" };
  const __body0 = () => (
    <div
      className={props.className}
      style={{
        width: 117,
        height: 46,
        borderRadius: 5,
        position: "relative",
        ...props.style,
      }}
    />
  );
  const __body1 = () => (
    <div
      className={props.className}
      style={{
        width: 117,
        height: 46,
        borderRadius: 5,
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 53.5,
          top: 25.5,
          width: 2.5,
          height: 2.5,
          borderRadius: "50%",
          backgroundColor: "rgb(0,0,0)",
        }}
      />
    </div>
  );
  const __body2 = () => (
    <div
      className={props.className}
      style={{
        width: 117,
        height: 46,
        borderRadius: 5,
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 53.5,
          top: 25.5,
          width: 2.5,
          height: 2.5,
          borderRadius: "50%",
          backgroundColor: "rgb(255,255,255)",
        }}
      />
    </div>
  );
  const __body3 = () => (
    <div
      className={props.className}
      style={{
        width: 117,
        height: 46,
        borderRadius: 5,
        position: "relative",
        color: "rgb(0,0,0)",
        ...props.style,
      }}
    >
      <svg
        width={49}
        height={13}
        viewBox="0 0 49 13"
        fill="none"
        style={{
          position: "absolute",
          left: 30.5,
          top: 13.5,
          width: 49,
          height: 13,
        }}
      >
        <path
          d={
            "M 6.5 0 C 6.776 0 7 0.224 7 0.5 L 7 6 L 12.5 6 C 12.776 6 13 6.224 13 6.5 C 13 6.776 12.776 7 12.5 7 L 7 7 L 7 12.5 C 7 12.776 6.776 13 6.5 13 C 6.224 13 6 12.776 6 12.5 L 6 7 L 0.5 7 C 0.224 7 0 6.776 0 6.5 C 0 6.224 0.224 6 0.5 6 L 6 6 L 6 0.5 C 6 0.224 6.224 0 6.5 0 Z"
          }
          fill="currentColor"
          fillRule="nonzero"
        />
        <path
          d={
            "M 40.5 0 C 40.776 0 41 0.224 41 0.5 L 41 4 L 44 4 L 44 0.5 C 44 0.224 44.224 0 44.5 0 C 44.776 0 45 0.224 45 0.5 L 45 4 L 48.5 4 C 48.776 4 49 4.224 49 4.5 C 49 4.776 48.776 5 48.5 5 L 45 5 L 45 8 L 48.5 8 C 48.776 8 49 8.224 49 8.5 C 49 8.776 48.776 9 48.5 9 L 45 9 L 45 12.5 C 45 12.776 44.776 13 44.5 13 C 44.224 13 44 12.776 44 12.5 L 44 9 L 41 9 L 41 12.5 C 41 12.776 40.776 13 40.5 13 C 40.224 13 40 12.776 40 12.5 L 40 9 L 36.5 9 C 36.224 9 36 8.776 36 8.5 C 36 8.224 36.224 8 36.5 8 L 40 8 L 40 5 L 36.5 5 C 36.224 5 36 4.776 36 4.5 C 36 4.224 36.224 4 36.5 4 L 40 4 L 40 0.5 C 40 0.224 40.224 0 40.5 0 Z M 41 8 L 44 8 L 44 5 L 41 5 L 41 8 Z"
          }
          fill="currentColor"
          fillRule="evenodd"
        />
        <path
          d={
            "M 21.744 1.147 C 21.598 0.913 21.29 0.842 21.055 0.988 C 20.821 1.134 20.75 1.443 20.896 1.677 L 23.598 6 L 18.5 6 C 18.224 6 18 6.224 18 6.5 C 18 6.776 18.224 7 18.5 7 L 23.598 7 L 20.897 11.324 C 20.75 11.558 20.821 11.866 21.056 12.013 C 21.29 12.159 21.598 12.088 21.745 11.854 L 24.5 7.444 L 27.255 11.854 C 27.402 12.088 27.71 12.159 27.944 12.013 C 28.179 11.866 28.25 11.558 28.103 11.324 L 25.402 7 L 30.5 7 C 30.776 7 31 6.776 31 6.5 C 31 6.224 30.776 6 30.5 6 L 25.402 6 L 28.104 1.677 C 28.25 1.443 28.179 1.134 27.945 0.988 C 27.71 0.842 27.402 0.913 27.256 1.147 L 24.5 5.557 L 21.744 1.147 Z"
          }
          fill="currentColor"
          fillRule="nonzero"
        />
      </svg>
    </div>
  );
  const __body4 = () => (
    <div
      className={props.className}
      style={{
        width: 117,
        height: 46,
        borderRadius: 5,
        position: "relative",
        color: "rgb(255,255,255)",
        ...props.style,
      }}
    >
      <svg
        width={49}
        height={13}
        viewBox="0 0 49 13"
        fill="none"
        style={{
          position: "absolute",
          left: 30.5,
          top: 13.5,
          width: 49,
          height: 13,
        }}
      >
        <path
          d={
            "M 6.5 0 C 6.776 0 7 0.224 7 0.5 L 7 6 L 12.5 6 C 12.776 6 13 6.224 13 6.5 C 13 6.776 12.776 7 12.5 7 L 7 7 L 7 12.5 C 7 12.776 6.776 13 6.5 13 C 6.224 13 6 12.776 6 12.5 L 6 7 L 0.5 7 C 0.224 7 0 6.776 0 6.5 C 0 6.224 0.224 6 0.5 6 L 6 6 L 6 0.5 C 6 0.224 6.224 0 6.5 0 Z"
          }
          fill="currentColor"
          fillRule="nonzero"
        />
        <path
          d={
            "M 40.5 0 C 40.776 0 41 0.224 41 0.5 L 41 4 L 44 4 L 44 0.5 C 44 0.224 44.224 0 44.5 0 C 44.776 0 45 0.224 45 0.5 L 45 4 L 48.5 4 C 48.776 4 49 4.224 49 4.5 C 49 4.776 48.776 5 48.5 5 L 45 5 L 45 8 L 48.5 8 C 48.776 8 49 8.224 49 8.5 C 49 8.776 48.776 9 48.5 9 L 45 9 L 45 12.5 C 45 12.776 44.776 13 44.5 13 C 44.224 13 44 12.776 44 12.5 L 44 9 L 41 9 L 41 12.5 C 41 12.776 40.776 13 40.5 13 C 40.224 13 40 12.776 40 12.5 L 40 9 L 36.5 9 C 36.224 9 36 8.776 36 8.5 C 36 8.224 36.224 8 36.5 8 L 40 8 L 40 5 L 36.5 5 C 36.224 5 36 4.776 36 4.5 C 36 4.224 36.224 4 36.5 4 L 40 4 L 40 0.5 C 40 0.224 40.224 0 40.5 0 Z M 41 8 L 44 8 L 44 5 L 41 5 L 41 8 Z"
          }
          fill="currentColor"
          fillRule="evenodd"
        />
        <path
          d={
            "M 21.744 1.147 C 21.598 0.913 21.29 0.842 21.055 0.988 C 20.821 1.134 20.75 1.443 20.896 1.677 L 23.598 6 L 18.5 6 C 18.224 6 18 6.224 18 6.5 C 18 6.776 18.224 7 18.5 7 L 23.598 7 L 20.897 11.324 C 20.75 11.558 20.821 11.866 21.056 12.013 C 21.29 12.159 21.598 12.088 21.745 11.854 L 24.5 7.444 L 27.255 11.854 C 27.402 12.088 27.71 12.159 27.944 12.013 C 28.179 11.866 28.25 11.558 28.103 11.324 L 25.402 7 L 30.5 7 C 30.776 7 31 6.776 31 6.5 C 31 6.224 30.776 6 30.5 6 L 25.402 6 L 28.104 1.677 C 28.25 1.443 28.179 1.134 27.945 0.988 C 27.71 0.842 27.402 0.913 27.256 1.147 L 24.5 5.557 L 21.744 1.147 Z"
          }
          fill="currentColor"
          fillRule="nonzero"
        />
      </svg>
    </div>
  );
  const __impls = {
    // figma: Type=placeholder, Dark=Off
    "type=placeholder|dark=off": __body0,
    // figma: Type=decimal,Dark=Off
    "type=decimal|dark=off": __body1,
    // figma: Type=decimal,Dark=On
    "type=decimal|dark=on": __body2,
    // figma: Type=tel,Dark=Off
    "type=tel|dark=off": __body3,
    // figma: Type=tel,Dark=On
    "type=tel|dark=on": __body4,
  };
  return (__impls[__vkey(props)] ?? __body1)();
}
export default KeyNumber;
