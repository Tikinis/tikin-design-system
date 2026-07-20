// figma node: 2:5672 Ghost (16 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "state=" + __venc(p.state) + "|" + "size=" + __venc(p.size);

export function Ghost(_p = {}) {
  const props = {
    ..._p,
    label: _p.label ?? "Label",
    state: _p.state ?? "deault",
    leftIcon: _p.leftIcon ?? false,
    size: _p.size ?? "xs",
    rightIcon: _p.rightIcon ?? false,
  };
  const __body0 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-4) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      {props.leftIcon && (
        <div
          style={{
            position: "relative",
            width: 12,
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          <svg
            width={10.5}
            height={8.998}
            viewBox="0 0 10.500 8.998"
            fill="none"
            style={{
              position: "absolute",
              left: 0.75,
              top: 1.875,
              width: 10.5,
              height: 8.998,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 7.594 0 C 6.626 0 5.778 0.416 5.25 1.12 C 4.722 0.416 3.874 0 2.906 0 C 2.136 0.001 1.397 0.307 0.852 0.852 C 0.307 1.397 0.001 2.136 0 2.906 C 0 6.188 4.865 8.843 5.072 8.953 C 5.127 8.983 5.188 8.998 5.25 8.998 C 5.312 8.998 5.373 8.983 5.428 8.953 C 5.635 8.843 10.5 6.188 10.5 2.906 C 10.499 2.136 10.193 1.397 9.648 0.852 C 9.103 0.307 8.364 0.001 7.594 0 Z M 5.25 8.194 C 4.394 7.695 0.75 5.423 0.75 2.906 C 0.751 2.335 0.978 1.787 1.382 1.382 C 1.787 0.978 2.335 0.751 2.906 0.75 C 3.818 0.75 4.583 1.236 4.903 2.016 C 4.931 2.084 4.979 2.143 5.041 2.185 C 5.103 2.226 5.176 2.248 5.25 2.248 C 5.324 2.248 5.397 2.226 5.459 2.185 C 5.521 2.143 5.569 2.084 5.597 2.016 C 5.917 1.234 6.682 0.75 7.594 0.75 C 8.165 0.751 8.713 0.978 9.118 1.382 C 9.522 1.787 9.749 2.335 9.75 2.906 C 9.75 5.419 6.105 7.695 5.25 8.194 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 500,
          fontSize: "calc(var(--button-typo-size-xs) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--button-ghost-text-default)",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
      {props.rightIcon && (
        <div
          style={{
            position: "relative",
            width: 12,
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          <svg
            width={10.5}
            height={8.998}
            viewBox="0 0 10.500 8.998"
            fill="none"
            style={{
              position: "absolute",
              left: 0.75,
              top: 1.875,
              width: 10.5,
              height: 8.998,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 7.594 0 C 6.626 0 5.778 0.416 5.25 1.12 C 4.722 0.416 3.874 0 2.906 0 C 2.136 0.001 1.397 0.307 0.852 0.852 C 0.307 1.397 0.001 2.136 0 2.906 C 0 6.188 4.865 8.843 5.072 8.953 C 5.127 8.983 5.188 8.998 5.25 8.998 C 5.312 8.998 5.373 8.983 5.428 8.953 C 5.635 8.843 10.5 6.188 10.5 2.906 C 10.499 2.136 10.193 1.397 9.648 0.852 C 9.103 0.307 8.364 0.001 7.594 0 Z M 5.25 8.194 C 4.394 7.695 0.75 5.423 0.75 2.906 C 0.751 2.335 0.978 1.787 1.382 1.382 C 1.787 0.978 2.335 0.751 2.906 0.75 C 3.818 0.75 4.583 1.236 4.903 2.016 C 4.931 2.084 4.979 2.143 5.041 2.185 C 5.103 2.226 5.176 2.248 5.25 2.248 C 5.324 2.248 5.397 2.226 5.459 2.185 C 5.521 2.143 5.569 2.084 5.597 2.016 C 5.917 1.234 6.682 0.75 7.594 0.75 C 8.165 0.751 8.713 0.978 9.118 1.382 C 9.522 1.787 9.749 2.335 9.75 2.906 C 9.75 5.419 6.105 7.695 5.25 8.194 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
    </div>
  );
  const __body1 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "var(--button-ghost-bg-hover)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-4) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      {props.leftIcon && (
        <div
          style={{
            position: "relative",
            width: 12,
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          <svg
            width={10.5}
            height={8.998}
            viewBox="0 0 10.500 8.998"
            fill="none"
            style={{
              position: "absolute",
              left: 0.75,
              top: 1.875,
              width: 10.5,
              height: 8.998,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 7.594 0 C 6.626 0 5.778 0.416 5.25 1.12 C 4.722 0.416 3.874 0 2.906 0 C 2.136 0.001 1.397 0.307 0.852 0.852 C 0.307 1.397 0.001 2.136 0 2.906 C 0 6.188 4.865 8.843 5.072 8.953 C 5.127 8.983 5.188 8.998 5.25 8.998 C 5.312 8.998 5.373 8.983 5.428 8.953 C 5.635 8.843 10.5 6.188 10.5 2.906 C 10.499 2.136 10.193 1.397 9.648 0.852 C 9.103 0.307 8.364 0.001 7.594 0 Z M 5.25 8.194 C 4.394 7.695 0.75 5.423 0.75 2.906 C 0.751 2.335 0.978 1.787 1.382 1.382 C 1.787 0.978 2.335 0.751 2.906 0.75 C 3.818 0.75 4.583 1.236 4.903 2.016 C 4.931 2.084 4.979 2.143 5.041 2.185 C 5.103 2.226 5.176 2.248 5.25 2.248 C 5.324 2.248 5.397 2.226 5.459 2.185 C 5.521 2.143 5.569 2.084 5.597 2.016 C 5.917 1.234 6.682 0.75 7.594 0.75 C 8.165 0.751 8.713 0.978 9.118 1.382 C 9.522 1.787 9.749 2.335 9.75 2.906 C 9.75 5.419 6.105 7.695 5.25 8.194 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 500,
          fontSize: "calc(var(--button-typo-size-xs) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--button-ghost-text-hover)",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
      {props.rightIcon && (
        <div
          style={{
            position: "relative",
            width: 12,
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          <svg
            width={10.5}
            height={8.998}
            viewBox="0 0 10.500 8.998"
            fill="none"
            style={{
              position: "absolute",
              left: 0.75,
              top: 1.875,
              width: 10.5,
              height: 8.998,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 7.594 0 C 6.626 0 5.778 0.416 5.25 1.12 C 4.722 0.416 3.874 0 2.906 0 C 2.136 0.001 1.397 0.307 0.852 0.852 C 0.307 1.397 0.001 2.136 0 2.906 C 0 6.188 4.865 8.843 5.072 8.953 C 5.127 8.983 5.188 8.998 5.25 8.998 C 5.312 8.998 5.373 8.983 5.428 8.953 C 5.635 8.843 10.5 6.188 10.5 2.906 C 10.499 2.136 10.193 1.397 9.648 0.852 C 9.103 0.307 8.364 0.001 7.594 0 Z M 5.25 8.194 C 4.394 7.695 0.75 5.423 0.75 2.906 C 0.751 2.335 0.978 1.787 1.382 1.382 C 1.787 0.978 2.335 0.751 2.906 0.75 C 3.818 0.75 4.583 1.236 4.903 2.016 C 4.931 2.084 4.979 2.143 5.041 2.185 C 5.103 2.226 5.176 2.248 5.25 2.248 C 5.324 2.248 5.397 2.226 5.459 2.185 C 5.521 2.143 5.569 2.084 5.597 2.016 C 5.917 1.234 6.682 0.75 7.594 0.75 C 8.165 0.751 8.713 0.978 9.118 1.382 C 9.522 1.787 9.749 2.335 9.75 2.906 C 9.75 5.419 6.105 7.695 5.25 8.194 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
    </div>
  );
  const __body2 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-4) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      {props.leftIcon && (
        <div
          style={{
            position: "relative",
            width: 12,
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          <svg
            width={10.5}
            height={8.998}
            viewBox="0 0 10.500 8.998"
            fill="none"
            style={{
              position: "absolute",
              left: 0.75,
              top: 1.875,
              width: 10.5,
              height: 8.998,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 7.594 0 C 6.626 0 5.778 0.416 5.25 1.12 C 4.722 0.416 3.874 0 2.906 0 C 2.136 0.001 1.397 0.307 0.852 0.852 C 0.307 1.397 0.001 2.136 0 2.906 C 0 6.188 4.865 8.843 5.072 8.953 C 5.127 8.983 5.188 8.998 5.25 8.998 C 5.312 8.998 5.373 8.983 5.428 8.953 C 5.635 8.843 10.5 6.188 10.5 2.906 C 10.499 2.136 10.193 1.397 9.648 0.852 C 9.103 0.307 8.364 0.001 7.594 0 Z M 5.25 8.194 C 4.394 7.695 0.75 5.423 0.75 2.906 C 0.751 2.335 0.978 1.787 1.382 1.382 C 1.787 0.978 2.335 0.751 2.906 0.75 C 3.818 0.75 4.583 1.236 4.903 2.016 C 4.931 2.084 4.979 2.143 5.041 2.185 C 5.103 2.226 5.176 2.248 5.25 2.248 C 5.324 2.248 5.397 2.226 5.459 2.185 C 5.521 2.143 5.569 2.084 5.597 2.016 C 5.917 1.234 6.682 0.75 7.594 0.75 C 8.165 0.751 8.713 0.978 9.118 1.382 C 9.522 1.787 9.749 2.335 9.75 2.906 C 9.75 5.419 6.105 7.695 5.25 8.194 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 600,
          fontSize: "calc(var(--button-typo-size-xs) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--button-ghost-text-pressed)",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
      {props.rightIcon && (
        <div
          style={{
            position: "relative",
            width: 12,
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          <svg
            width={10.5}
            height={8.998}
            viewBox="0 0 10.500 8.998"
            fill="none"
            style={{
              position: "absolute",
              left: 0.75,
              top: 1.875,
              width: 10.5,
              height: 8.998,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 7.594 0 C 6.626 0 5.778 0.416 5.25 1.12 C 4.722 0.416 3.874 0 2.906 0 C 2.136 0.001 1.397 0.307 0.852 0.852 C 0.307 1.397 0.001 2.136 0 2.906 C 0 6.188 4.865 8.843 5.072 8.953 C 5.127 8.983 5.188 8.998 5.25 8.998 C 5.312 8.998 5.373 8.983 5.428 8.953 C 5.635 8.843 10.5 6.188 10.5 2.906 C 10.499 2.136 10.193 1.397 9.648 0.852 C 9.103 0.307 8.364 0.001 7.594 0 Z M 5.25 8.194 C 4.394 7.695 0.75 5.423 0.75 2.906 C 0.751 2.335 0.978 1.787 1.382 1.382 C 1.787 0.978 2.335 0.751 2.906 0.75 C 3.818 0.75 4.583 1.236 4.903 2.016 C 4.931 2.084 4.979 2.143 5.041 2.185 C 5.103 2.226 5.176 2.248 5.25 2.248 C 5.324 2.248 5.397 2.226 5.459 2.185 C 5.521 2.143 5.569 2.084 5.597 2.016 C 5.917 1.234 6.682 0.75 7.594 0.75 C 8.165 0.751 8.713 0.978 9.118 1.382 C 9.522 1.787 9.749 2.335 9.75 2.906 C 9.75 5.419 6.105 7.695 5.25 8.194 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
    </div>
  );
  const __body3 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-4) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      {props.leftIcon && (
        <div
          style={{
            position: "relative",
            width: 12,
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          <svg
            width={10.5}
            height={8.998}
            viewBox="0 0 10.500 8.998"
            fill="none"
            style={{
              position: "absolute",
              left: 0.75,
              top: 1.875,
              width: 10.5,
              height: 8.998,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 7.594 0 C 6.626 0 5.778 0.416 5.25 1.12 C 4.722 0.416 3.874 0 2.906 0 C 2.136 0.001 1.397 0.307 0.852 0.852 C 0.307 1.397 0.001 2.136 0 2.906 C 0 6.188 4.865 8.843 5.072 8.953 C 5.127 8.983 5.188 8.998 5.25 8.998 C 5.312 8.998 5.373 8.983 5.428 8.953 C 5.635 8.843 10.5 6.188 10.5 2.906 C 10.499 2.136 10.193 1.397 9.648 0.852 C 9.103 0.307 8.364 0.001 7.594 0 Z M 5.25 8.194 C 4.394 7.695 0.75 5.423 0.75 2.906 C 0.751 2.335 0.978 1.787 1.382 1.382 C 1.787 0.978 2.335 0.751 2.906 0.75 C 3.818 0.75 4.583 1.236 4.903 2.016 C 4.931 2.084 4.979 2.143 5.041 2.185 C 5.103 2.226 5.176 2.248 5.25 2.248 C 5.324 2.248 5.397 2.226 5.459 2.185 C 5.521 2.143 5.569 2.084 5.597 2.016 C 5.917 1.234 6.682 0.75 7.594 0.75 C 8.165 0.751 8.713 0.978 9.118 1.382 C 9.522 1.787 9.749 2.335 9.75 2.906 C 9.75 5.419 6.105 7.695 5.25 8.194 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 400,
          fontSize: "calc(var(--button-typo-size-xs) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--button-ghost-text-disabled)",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
      {props.rightIcon && (
        <div
          style={{
            position: "relative",
            width: 12,
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          <svg
            width={10.5}
            height={8.998}
            viewBox="0 0 10.500 8.998"
            fill="none"
            style={{
              position: "absolute",
              left: 0.75,
              top: 1.875,
              width: 10.5,
              height: 8.998,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 7.594 0 C 6.626 0 5.778 0.416 5.25 1.12 C 4.722 0.416 3.874 0 2.906 0 C 2.136 0.001 1.397 0.307 0.852 0.852 C 0.307 1.397 0.001 2.136 0 2.906 C 0 6.188 4.865 8.843 5.072 8.953 C 5.127 8.983 5.188 8.998 5.25 8.998 C 5.312 8.998 5.373 8.983 5.428 8.953 C 5.635 8.843 10.5 6.188 10.5 2.906 C 10.499 2.136 10.193 1.397 9.648 0.852 C 9.103 0.307 8.364 0.001 7.594 0 Z M 5.25 8.194 C 4.394 7.695 0.75 5.423 0.75 2.906 C 0.751 2.335 0.978 1.787 1.382 1.382 C 1.787 0.978 2.335 0.751 2.906 0.75 C 3.818 0.75 4.583 1.236 4.903 2.016 C 4.931 2.084 4.979 2.143 5.041 2.185 C 5.103 2.226 5.176 2.248 5.25 2.248 C 5.324 2.248 5.397 2.226 5.459 2.185 C 5.521 2.143 5.569 2.084 5.597 2.016 C 5.917 1.234 6.682 0.75 7.594 0.75 C 8.165 0.751 8.713 0.978 9.118 1.382 C 9.522 1.787 9.749 2.335 9.75 2.906 C 9.75 5.419 6.105 7.695 5.25 8.194 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
    </div>
  );
  const __body4 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-4) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      {props.leftIcon && (
        <div
          style={{
            position: "relative",
            width: 12,
            height: "calc(var(--button-iconsize-s) * 1px)",
            flexShrink: 0,
          }}
        >
          <svg
            width={10.5}
            height={8.998}
            viewBox="0 0 10.500 8.998"
            fill="none"
            style={{
              position: "absolute",
              left: 0.75,
              top: 1.875,
              width: 10.5,
              height: 8.998,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 7.594 0 C 6.626 0 5.778 0.416 5.25 1.12 C 4.722 0.416 3.874 0 2.906 0 C 2.136 0.001 1.397 0.307 0.852 0.852 C 0.307 1.397 0.001 2.136 0 2.906 C 0 6.188 4.865 8.843 5.072 8.953 C 5.127 8.983 5.188 8.998 5.25 8.998 C 5.312 8.998 5.373 8.983 5.428 8.953 C 5.635 8.843 10.5 6.188 10.5 2.906 C 10.499 2.136 10.193 1.397 9.648 0.852 C 9.103 0.307 8.364 0.001 7.594 0 Z M 5.25 8.194 C 4.394 7.695 0.75 5.423 0.75 2.906 C 0.751 2.335 0.978 1.787 1.382 1.382 C 1.787 0.978 2.335 0.751 2.906 0.75 C 3.818 0.75 4.583 1.236 4.903 2.016 C 4.931 2.084 4.979 2.143 5.041 2.185 C 5.103 2.226 5.176 2.248 5.25 2.248 C 5.324 2.248 5.397 2.226 5.459 2.185 C 5.521 2.143 5.569 2.084 5.597 2.016 C 5.917 1.234 6.682 0.75 7.594 0.75 C 8.165 0.751 8.713 0.978 9.118 1.382 C 9.522 1.787 9.749 2.335 9.75 2.906 C 9.75 5.419 6.105 7.695 5.25 8.194 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 500,
          fontSize: "calc(var(--button-typo-size-s) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--button-ghost-text-default)",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
      {props.rightIcon && (
        <div
          style={{
            position: "relative",
            width: 12,
            height: "calc(var(--button-iconsize-s) * 1px)",
            flexShrink: 0,
          }}
        >
          <svg
            width={10.5}
            height={8.998}
            viewBox="0 0 10.500 8.998"
            fill="none"
            style={{
              position: "absolute",
              left: 0.75,
              top: 1.875,
              width: 10.5,
              height: 8.998,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 7.594 0 C 6.626 0 5.778 0.416 5.25 1.12 C 4.722 0.416 3.874 0 2.906 0 C 2.136 0.001 1.397 0.307 0.852 0.852 C 0.307 1.397 0.001 2.136 0 2.906 C 0 6.188 4.865 8.843 5.072 8.953 C 5.127 8.983 5.188 8.998 5.25 8.998 C 5.312 8.998 5.373 8.983 5.428 8.953 C 5.635 8.843 10.5 6.188 10.5 2.906 C 10.499 2.136 10.193 1.397 9.648 0.852 C 9.103 0.307 8.364 0.001 7.594 0 Z M 5.25 8.194 C 4.394 7.695 0.75 5.423 0.75 2.906 C 0.751 2.335 0.978 1.787 1.382 1.382 C 1.787 0.978 2.335 0.751 2.906 0.75 C 3.818 0.75 4.583 1.236 4.903 2.016 C 4.931 2.084 4.979 2.143 5.041 2.185 C 5.103 2.226 5.176 2.248 5.25 2.248 C 5.324 2.248 5.397 2.226 5.459 2.185 C 5.521 2.143 5.569 2.084 5.597 2.016 C 5.917 1.234 6.682 0.75 7.594 0.75 C 8.165 0.751 8.713 0.978 9.118 1.382 C 9.522 1.787 9.749 2.335 9.75 2.906 C 9.75 5.419 6.105 7.695 5.25 8.194 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
    </div>
  );
  const __body5 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "var(--button-ghost-bg-hover)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-4) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      {props.leftIcon && (
        <div
          style={{
            position: "relative",
            width: 12,
            height: "calc(var(--button-iconsize-s) * 1px)",
            flexShrink: 0,
          }}
        >
          <svg
            width={10.5}
            height={8.998}
            viewBox="0 0 10.500 8.998"
            fill="none"
            style={{
              position: "absolute",
              left: 0.75,
              top: 1.875,
              width: 10.5,
              height: 8.998,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 7.594 0 C 6.626 0 5.778 0.416 5.25 1.12 C 4.722 0.416 3.874 0 2.906 0 C 2.136 0.001 1.397 0.307 0.852 0.852 C 0.307 1.397 0.001 2.136 0 2.906 C 0 6.188 4.865 8.843 5.072 8.953 C 5.127 8.983 5.188 8.998 5.25 8.998 C 5.312 8.998 5.373 8.983 5.428 8.953 C 5.635 8.843 10.5 6.188 10.5 2.906 C 10.499 2.136 10.193 1.397 9.648 0.852 C 9.103 0.307 8.364 0.001 7.594 0 Z M 5.25 8.194 C 4.394 7.695 0.75 5.423 0.75 2.906 C 0.751 2.335 0.978 1.787 1.382 1.382 C 1.787 0.978 2.335 0.751 2.906 0.75 C 3.818 0.75 4.583 1.236 4.903 2.016 C 4.931 2.084 4.979 2.143 5.041 2.185 C 5.103 2.226 5.176 2.248 5.25 2.248 C 5.324 2.248 5.397 2.226 5.459 2.185 C 5.521 2.143 5.569 2.084 5.597 2.016 C 5.917 1.234 6.682 0.75 7.594 0.75 C 8.165 0.751 8.713 0.978 9.118 1.382 C 9.522 1.787 9.749 2.335 9.75 2.906 C 9.75 5.419 6.105 7.695 5.25 8.194 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 500,
          fontSize: "calc(var(--button-typo-size-s) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--button-ghost-text-hover)",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
      {props.rightIcon && (
        <div
          style={{
            position: "relative",
            width: 12,
            height: "calc(var(--button-iconsize-s) * 1px)",
            flexShrink: 0,
          }}
        >
          <svg
            width={10.5}
            height={8.998}
            viewBox="0 0 10.500 8.998"
            fill="none"
            style={{
              position: "absolute",
              left: 0.75,
              top: 1.875,
              width: 10.5,
              height: 8.998,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 7.594 0 C 6.626 0 5.778 0.416 5.25 1.12 C 4.722 0.416 3.874 0 2.906 0 C 2.136 0.001 1.397 0.307 0.852 0.852 C 0.307 1.397 0.001 2.136 0 2.906 C 0 6.188 4.865 8.843 5.072 8.953 C 5.127 8.983 5.188 8.998 5.25 8.998 C 5.312 8.998 5.373 8.983 5.428 8.953 C 5.635 8.843 10.5 6.188 10.5 2.906 C 10.499 2.136 10.193 1.397 9.648 0.852 C 9.103 0.307 8.364 0.001 7.594 0 Z M 5.25 8.194 C 4.394 7.695 0.75 5.423 0.75 2.906 C 0.751 2.335 0.978 1.787 1.382 1.382 C 1.787 0.978 2.335 0.751 2.906 0.75 C 3.818 0.75 4.583 1.236 4.903 2.016 C 4.931 2.084 4.979 2.143 5.041 2.185 C 5.103 2.226 5.176 2.248 5.25 2.248 C 5.324 2.248 5.397 2.226 5.459 2.185 C 5.521 2.143 5.569 2.084 5.597 2.016 C 5.917 1.234 6.682 0.75 7.594 0.75 C 8.165 0.751 8.713 0.978 9.118 1.382 C 9.522 1.787 9.749 2.335 9.75 2.906 C 9.75 5.419 6.105 7.695 5.25 8.194 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
    </div>
  );
  const __body6 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-4) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      {props.leftIcon && (
        <div
          style={{
            position: "relative",
            width: 12,
            height: "calc(var(--button-iconsize-s) * 1px)",
            flexShrink: 0,
          }}
        >
          <svg
            width={10.5}
            height={8.998}
            viewBox="0 0 10.500 8.998"
            fill="none"
            style={{
              position: "absolute",
              left: 0.75,
              top: 1.875,
              width: 10.5,
              height: 8.998,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 7.594 0 C 6.626 0 5.778 0.416 5.25 1.12 C 4.722 0.416 3.874 0 2.906 0 C 2.136 0.001 1.397 0.307 0.852 0.852 C 0.307 1.397 0.001 2.136 0 2.906 C 0 6.188 4.865 8.843 5.072 8.953 C 5.127 8.983 5.188 8.998 5.25 8.998 C 5.312 8.998 5.373 8.983 5.428 8.953 C 5.635 8.843 10.5 6.188 10.5 2.906 C 10.499 2.136 10.193 1.397 9.648 0.852 C 9.103 0.307 8.364 0.001 7.594 0 Z M 5.25 8.194 C 4.394 7.695 0.75 5.423 0.75 2.906 C 0.751 2.335 0.978 1.787 1.382 1.382 C 1.787 0.978 2.335 0.751 2.906 0.75 C 3.818 0.75 4.583 1.236 4.903 2.016 C 4.931 2.084 4.979 2.143 5.041 2.185 C 5.103 2.226 5.176 2.248 5.25 2.248 C 5.324 2.248 5.397 2.226 5.459 2.185 C 5.521 2.143 5.569 2.084 5.597 2.016 C 5.917 1.234 6.682 0.75 7.594 0.75 C 8.165 0.751 8.713 0.978 9.118 1.382 C 9.522 1.787 9.749 2.335 9.75 2.906 C 9.75 5.419 6.105 7.695 5.25 8.194 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 600,
          fontSize: "calc(var(--button-typo-size-s) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--button-ghost-text-pressed)",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
      {props.rightIcon && (
        <div
          style={{
            position: "relative",
            width: 12,
            height: "calc(var(--button-iconsize-s) * 1px)",
            flexShrink: 0,
          }}
        >
          <svg
            width={10.5}
            height={8.998}
            viewBox="0 0 10.500 8.998"
            fill="none"
            style={{
              position: "absolute",
              left: 0.75,
              top: 1.875,
              width: 10.5,
              height: 8.998,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 7.594 0 C 6.626 0 5.778 0.416 5.25 1.12 C 4.722 0.416 3.874 0 2.906 0 C 2.136 0.001 1.397 0.307 0.852 0.852 C 0.307 1.397 0.001 2.136 0 2.906 C 0 6.188 4.865 8.843 5.072 8.953 C 5.127 8.983 5.188 8.998 5.25 8.998 C 5.312 8.998 5.373 8.983 5.428 8.953 C 5.635 8.843 10.5 6.188 10.5 2.906 C 10.499 2.136 10.193 1.397 9.648 0.852 C 9.103 0.307 8.364 0.001 7.594 0 Z M 5.25 8.194 C 4.394 7.695 0.75 5.423 0.75 2.906 C 0.751 2.335 0.978 1.787 1.382 1.382 C 1.787 0.978 2.335 0.751 2.906 0.75 C 3.818 0.75 4.583 1.236 4.903 2.016 C 4.931 2.084 4.979 2.143 5.041 2.185 C 5.103 2.226 5.176 2.248 5.25 2.248 C 5.324 2.248 5.397 2.226 5.459 2.185 C 5.521 2.143 5.569 2.084 5.597 2.016 C 5.917 1.234 6.682 0.75 7.594 0.75 C 8.165 0.751 8.713 0.978 9.118 1.382 C 9.522 1.787 9.749 2.335 9.75 2.906 C 9.75 5.419 6.105 7.695 5.25 8.194 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
    </div>
  );
  const __body7 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-4) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      {props.leftIcon && (
        <div
          style={{
            position: "relative",
            width: 12,
            height: "calc(var(--button-iconsize-s) * 1px)",
            flexShrink: 0,
          }}
        >
          <svg
            width={10.5}
            height={8.998}
            viewBox="0 0 10.500 8.998"
            fill="none"
            style={{
              position: "absolute",
              left: 0.75,
              top: 1.875,
              width: 10.5,
              height: 8.998,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 7.594 0 C 6.626 0 5.778 0.416 5.25 1.12 C 4.722 0.416 3.874 0 2.906 0 C 2.136 0.001 1.397 0.307 0.852 0.852 C 0.307 1.397 0.001 2.136 0 2.906 C 0 6.188 4.865 8.843 5.072 8.953 C 5.127 8.983 5.188 8.998 5.25 8.998 C 5.312 8.998 5.373 8.983 5.428 8.953 C 5.635 8.843 10.5 6.188 10.5 2.906 C 10.499 2.136 10.193 1.397 9.648 0.852 C 9.103 0.307 8.364 0.001 7.594 0 Z M 5.25 8.194 C 4.394 7.695 0.75 5.423 0.75 2.906 C 0.751 2.335 0.978 1.787 1.382 1.382 C 1.787 0.978 2.335 0.751 2.906 0.75 C 3.818 0.75 4.583 1.236 4.903 2.016 C 4.931 2.084 4.979 2.143 5.041 2.185 C 5.103 2.226 5.176 2.248 5.25 2.248 C 5.324 2.248 5.397 2.226 5.459 2.185 C 5.521 2.143 5.569 2.084 5.597 2.016 C 5.917 1.234 6.682 0.75 7.594 0.75 C 8.165 0.751 8.713 0.978 9.118 1.382 C 9.522 1.787 9.749 2.335 9.75 2.906 C 9.75 5.419 6.105 7.695 5.25 8.194 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 400,
          fontSize: "calc(var(--button-typo-size-s) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--button-ghost-text-disabled)",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
      {props.rightIcon && (
        <div
          style={{
            position: "relative",
            width: 12,
            height: "calc(var(--button-iconsize-s) * 1px)",
            flexShrink: 0,
          }}
        >
          <svg
            width={10.5}
            height={8.998}
            viewBox="0 0 10.500 8.998"
            fill="none"
            style={{
              position: "absolute",
              left: 0.75,
              top: 1.875,
              width: 10.5,
              height: 8.998,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 7.594 0 C 6.626 0 5.778 0.416 5.25 1.12 C 4.722 0.416 3.874 0 2.906 0 C 2.136 0.001 1.397 0.307 0.852 0.852 C 0.307 1.397 0.001 2.136 0 2.906 C 0 6.188 4.865 8.843 5.072 8.953 C 5.127 8.983 5.188 8.998 5.25 8.998 C 5.312 8.998 5.373 8.983 5.428 8.953 C 5.635 8.843 10.5 6.188 10.5 2.906 C 10.499 2.136 10.193 1.397 9.648 0.852 C 9.103 0.307 8.364 0.001 7.594 0 Z M 5.25 8.194 C 4.394 7.695 0.75 5.423 0.75 2.906 C 0.751 2.335 0.978 1.787 1.382 1.382 C 1.787 0.978 2.335 0.751 2.906 0.75 C 3.818 0.75 4.583 1.236 4.903 2.016 C 4.931 2.084 4.979 2.143 5.041 2.185 C 5.103 2.226 5.176 2.248 5.25 2.248 C 5.324 2.248 5.397 2.226 5.459 2.185 C 5.521 2.143 5.569 2.084 5.597 2.016 C 5.917 1.234 6.682 0.75 7.594 0.75 C 8.165 0.751 8.713 0.978 9.118 1.382 C 9.522 1.787 9.749 2.335 9.75 2.906 C 9.75 5.419 6.105 7.695 5.25 8.194 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
    </div>
  );
  const __body8 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-8) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      {props.leftIcon && (
        <div
          style={{
            position: "relative",
            width: 16,
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          <svg
            width={14}
            height={11.997}
            viewBox="0 0 14 11.997"
            fill="none"
            style={{
              position: "absolute",
              left: 1,
              top: 2.5,
              width: 14,
              height: 11.997,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 10.125 0 C 8.834 0 7.704 0.555 7 1.493 C 6.296 0.555 5.166 0 3.875 0 C 2.848 0.001 1.863 0.41 1.136 1.136 C 0.41 1.863 0.001 2.848 0 3.875 C 0 8.25 6.487 11.791 6.763 11.938 C 6.836 11.977 6.917 11.997 7 11.997 C 7.083 11.997 7.164 11.977 7.237 11.938 C 7.513 11.791 14 8.25 14 3.875 C 13.999 2.848 13.59 1.863 12.864 1.136 C 12.137 0.41 11.152 0.001 10.125 0 Z M 7 10.925 C 5.859 10.26 1 7.231 1 3.875 C 1.001 3.113 1.304 2.382 1.843 1.843 C 2.382 1.304 3.113 1.001 3.875 1 C 5.091 1 6.111 1.648 6.537 2.688 C 6.575 2.779 6.639 2.858 6.722 2.913 C 6.804 2.968 6.901 2.998 7 2.998 C 7.099 2.998 7.196 2.968 7.278 2.913 C 7.361 2.858 7.425 2.779 7.462 2.688 C 7.889 1.646 8.909 1 10.125 1 C 10.887 1.001 11.618 1.304 12.157 1.843 C 12.696 2.382 12.999 3.113 13 3.875 C 13 7.226 8.14 10.259 7 10.925 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 500,
          fontSize: "calc(var(--button-typo-size-m) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--button-ghost-text-default)",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
      {props.rightIcon && (
        <div
          style={{
            position: "relative",
            width: 16,
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          <svg
            width={14}
            height={11.997}
            viewBox="0 0 14 11.997"
            fill="none"
            style={{
              position: "absolute",
              left: 1,
              top: 2.5,
              width: 14,
              height: 11.997,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 10.125 0 C 8.834 0 7.704 0.555 7 1.493 C 6.296 0.555 5.166 0 3.875 0 C 2.848 0.001 1.863 0.41 1.136 1.136 C 0.41 1.863 0.001 2.848 0 3.875 C 0 8.25 6.487 11.791 6.763 11.938 C 6.836 11.977 6.917 11.997 7 11.997 C 7.083 11.997 7.164 11.977 7.237 11.938 C 7.513 11.791 14 8.25 14 3.875 C 13.999 2.848 13.59 1.863 12.864 1.136 C 12.137 0.41 11.152 0.001 10.125 0 Z M 7 10.925 C 5.859 10.26 1 7.231 1 3.875 C 1.001 3.113 1.304 2.382 1.843 1.843 C 2.382 1.304 3.113 1.001 3.875 1 C 5.091 1 6.111 1.648 6.537 2.688 C 6.575 2.779 6.639 2.858 6.722 2.913 C 6.804 2.968 6.901 2.998 7 2.998 C 7.099 2.998 7.196 2.968 7.278 2.913 C 7.361 2.858 7.425 2.779 7.462 2.688 C 7.889 1.646 8.909 1 10.125 1 C 10.887 1.001 11.618 1.304 12.157 1.843 C 12.696 2.382 12.999 3.113 13 3.875 C 13 7.226 8.14 10.259 7 10.925 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
    </div>
  );
  const __body9 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "var(--button-ghost-bg-hover)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-8) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      {props.leftIcon && (
        <div
          style={{
            position: "relative",
            width: 16,
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          <svg
            width={14}
            height={11.997}
            viewBox="0 0 14 11.997"
            fill="none"
            style={{
              position: "absolute",
              left: 1,
              top: 2.5,
              width: 14,
              height: 11.997,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 10.125 0 C 8.834 0 7.704 0.555 7 1.493 C 6.296 0.555 5.166 0 3.875 0 C 2.848 0.001 1.863 0.41 1.136 1.136 C 0.41 1.863 0.001 2.848 0 3.875 C 0 8.25 6.487 11.791 6.763 11.938 C 6.836 11.977 6.917 11.997 7 11.997 C 7.083 11.997 7.164 11.977 7.237 11.938 C 7.513 11.791 14 8.25 14 3.875 C 13.999 2.848 13.59 1.863 12.864 1.136 C 12.137 0.41 11.152 0.001 10.125 0 Z M 7 10.925 C 5.859 10.26 1 7.231 1 3.875 C 1.001 3.113 1.304 2.382 1.843 1.843 C 2.382 1.304 3.113 1.001 3.875 1 C 5.091 1 6.111 1.648 6.537 2.688 C 6.575 2.779 6.639 2.858 6.722 2.913 C 6.804 2.968 6.901 2.998 7 2.998 C 7.099 2.998 7.196 2.968 7.278 2.913 C 7.361 2.858 7.425 2.779 7.462 2.688 C 7.889 1.646 8.909 1 10.125 1 C 10.887 1.001 11.618 1.304 12.157 1.843 C 12.696 2.382 12.999 3.113 13 3.875 C 13 7.226 8.14 10.259 7 10.925 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 500,
          fontSize: "calc(var(--button-typo-size-m) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--button-ghost-text-hover)",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
      {props.rightIcon && (
        <div
          style={{
            position: "relative",
            width: 16,
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          <svg
            width={14}
            height={11.997}
            viewBox="0 0 14 11.997"
            fill="none"
            style={{
              position: "absolute",
              left: 1,
              top: 2.5,
              width: 14,
              height: 11.997,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 10.125 0 C 8.834 0 7.704 0.555 7 1.493 C 6.296 0.555 5.166 0 3.875 0 C 2.848 0.001 1.863 0.41 1.136 1.136 C 0.41 1.863 0.001 2.848 0 3.875 C 0 8.25 6.487 11.791 6.763 11.938 C 6.836 11.977 6.917 11.997 7 11.997 C 7.083 11.997 7.164 11.977 7.237 11.938 C 7.513 11.791 14 8.25 14 3.875 C 13.999 2.848 13.59 1.863 12.864 1.136 C 12.137 0.41 11.152 0.001 10.125 0 Z M 7 10.925 C 5.859 10.26 1 7.231 1 3.875 C 1.001 3.113 1.304 2.382 1.843 1.843 C 2.382 1.304 3.113 1.001 3.875 1 C 5.091 1 6.111 1.648 6.537 2.688 C 6.575 2.779 6.639 2.858 6.722 2.913 C 6.804 2.968 6.901 2.998 7 2.998 C 7.099 2.998 7.196 2.968 7.278 2.913 C 7.361 2.858 7.425 2.779 7.462 2.688 C 7.889 1.646 8.909 1 10.125 1 C 10.887 1.001 11.618 1.304 12.157 1.843 C 12.696 2.382 12.999 3.113 13 3.875 C 13 7.226 8.14 10.259 7 10.925 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
    </div>
  );
  const __body10 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-8) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      {props.leftIcon && (
        <div
          style={{
            position: "relative",
            width: 16,
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          <svg
            width={14}
            height={11.997}
            viewBox="0 0 14 11.997"
            fill="none"
            style={{
              position: "absolute",
              left: 1,
              top: 2.5,
              width: 14,
              height: 11.997,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 10.125 0 C 8.834 0 7.704 0.555 7 1.493 C 6.296 0.555 5.166 0 3.875 0 C 2.848 0.001 1.863 0.41 1.136 1.136 C 0.41 1.863 0.001 2.848 0 3.875 C 0 8.25 6.487 11.791 6.763 11.938 C 6.836 11.977 6.917 11.997 7 11.997 C 7.083 11.997 7.164 11.977 7.237 11.938 C 7.513 11.791 14 8.25 14 3.875 C 13.999 2.848 13.59 1.863 12.864 1.136 C 12.137 0.41 11.152 0.001 10.125 0 Z M 7 10.925 C 5.859 10.26 1 7.231 1 3.875 C 1.001 3.113 1.304 2.382 1.843 1.843 C 2.382 1.304 3.113 1.001 3.875 1 C 5.091 1 6.111 1.648 6.537 2.688 C 6.575 2.779 6.639 2.858 6.722 2.913 C 6.804 2.968 6.901 2.998 7 2.998 C 7.099 2.998 7.196 2.968 7.278 2.913 C 7.361 2.858 7.425 2.779 7.462 2.688 C 7.889 1.646 8.909 1 10.125 1 C 10.887 1.001 11.618 1.304 12.157 1.843 C 12.696 2.382 12.999 3.113 13 3.875 C 13 7.226 8.14 10.259 7 10.925 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 600,
          fontSize: "calc(var(--button-typo-size-m) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--button-ghost-text-pressed)",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
      {props.rightIcon && (
        <div
          style={{
            position: "relative",
            width: 16,
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          <svg
            width={14}
            height={11.997}
            viewBox="0 0 14 11.997"
            fill="none"
            style={{
              position: "absolute",
              left: 1,
              top: 2.5,
              width: 14,
              height: 11.997,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 10.125 0 C 8.834 0 7.704 0.555 7 1.493 C 6.296 0.555 5.166 0 3.875 0 C 2.848 0.001 1.863 0.41 1.136 1.136 C 0.41 1.863 0.001 2.848 0 3.875 C 0 8.25 6.487 11.791 6.763 11.938 C 6.836 11.977 6.917 11.997 7 11.997 C 7.083 11.997 7.164 11.977 7.237 11.938 C 7.513 11.791 14 8.25 14 3.875 C 13.999 2.848 13.59 1.863 12.864 1.136 C 12.137 0.41 11.152 0.001 10.125 0 Z M 7 10.925 C 5.859 10.26 1 7.231 1 3.875 C 1.001 3.113 1.304 2.382 1.843 1.843 C 2.382 1.304 3.113 1.001 3.875 1 C 5.091 1 6.111 1.648 6.537 2.688 C 6.575 2.779 6.639 2.858 6.722 2.913 C 6.804 2.968 6.901 2.998 7 2.998 C 7.099 2.998 7.196 2.968 7.278 2.913 C 7.361 2.858 7.425 2.779 7.462 2.688 C 7.889 1.646 8.909 1 10.125 1 C 10.887 1.001 11.618 1.304 12.157 1.843 C 12.696 2.382 12.999 3.113 13 3.875 C 13 7.226 8.14 10.259 7 10.925 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
    </div>
  );
  const __body11 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-8) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      {props.leftIcon && (
        <div
          style={{
            position: "relative",
            width: 16,
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          <svg
            width={14}
            height={11.997}
            viewBox="0 0 14 11.997"
            fill="none"
            style={{
              position: "absolute",
              left: 1,
              top: 2.5,
              width: 14,
              height: 11.997,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 10.125 0 C 8.834 0 7.704 0.555 7 1.493 C 6.296 0.555 5.166 0 3.875 0 C 2.848 0.001 1.863 0.41 1.136 1.136 C 0.41 1.863 0.001 2.848 0 3.875 C 0 8.25 6.487 11.791 6.763 11.938 C 6.836 11.977 6.917 11.997 7 11.997 C 7.083 11.997 7.164 11.977 7.237 11.938 C 7.513 11.791 14 8.25 14 3.875 C 13.999 2.848 13.59 1.863 12.864 1.136 C 12.137 0.41 11.152 0.001 10.125 0 Z M 7 10.925 C 5.859 10.26 1 7.231 1 3.875 C 1.001 3.113 1.304 2.382 1.843 1.843 C 2.382 1.304 3.113 1.001 3.875 1 C 5.091 1 6.111 1.648 6.537 2.688 C 6.575 2.779 6.639 2.858 6.722 2.913 C 6.804 2.968 6.901 2.998 7 2.998 C 7.099 2.998 7.196 2.968 7.278 2.913 C 7.361 2.858 7.425 2.779 7.462 2.688 C 7.889 1.646 8.909 1 10.125 1 C 10.887 1.001 11.618 1.304 12.157 1.843 C 12.696 2.382 12.999 3.113 13 3.875 C 13 7.226 8.14 10.259 7 10.925 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 400,
          fontSize: "calc(var(--button-typo-size-m) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--button-ghost-text-disabled)",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
      {props.rightIcon && (
        <div
          style={{
            position: "relative",
            width: 16,
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          <svg
            width={14}
            height={11.997}
            viewBox="0 0 14 11.997"
            fill="none"
            style={{
              position: "absolute",
              left: 1,
              top: 2.5,
              width: 14,
              height: 11.997,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 10.125 0 C 8.834 0 7.704 0.555 7 1.493 C 6.296 0.555 5.166 0 3.875 0 C 2.848 0.001 1.863 0.41 1.136 1.136 C 0.41 1.863 0.001 2.848 0 3.875 C 0 8.25 6.487 11.791 6.763 11.938 C 6.836 11.977 6.917 11.997 7 11.997 C 7.083 11.997 7.164 11.977 7.237 11.938 C 7.513 11.791 14 8.25 14 3.875 C 13.999 2.848 13.59 1.863 12.864 1.136 C 12.137 0.41 11.152 0.001 10.125 0 Z M 7 10.925 C 5.859 10.26 1 7.231 1 3.875 C 1.001 3.113 1.304 2.382 1.843 1.843 C 2.382 1.304 3.113 1.001 3.875 1 C 5.091 1 6.111 1.648 6.537 2.688 C 6.575 2.779 6.639 2.858 6.722 2.913 C 6.804 2.968 6.901 2.998 7 2.998 C 7.099 2.998 7.196 2.968 7.278 2.913 C 7.361 2.858 7.425 2.779 7.462 2.688 C 7.889 1.646 8.909 1 10.125 1 C 10.887 1.001 11.618 1.304 12.157 1.843 C 12.696 2.382 12.999 3.113 13 3.875 C 13 7.226 8.14 10.259 7 10.925 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
    </div>
  );
  const __body12 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-8) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      {props.leftIcon && (
        <div
          style={{
            position: "relative",
            width: 16,
            height: "calc(var(--button-iconsize-l) * 1px)",
            flexShrink: 0,
          }}
        >
          <svg
            width={14}
            height={11.997}
            viewBox="0 0 14 11.997"
            fill="none"
            style={{
              position: "absolute",
              left: 1,
              top: 2.5,
              width: 14,
              height: 11.997,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 10.125 0 C 8.834 0 7.704 0.555 7 1.493 C 6.296 0.555 5.166 0 3.875 0 C 2.848 0.001 1.863 0.41 1.136 1.136 C 0.41 1.863 0.001 2.848 0 3.875 C 0 8.25 6.487 11.791 6.763 11.938 C 6.836 11.977 6.917 11.997 7 11.997 C 7.083 11.997 7.164 11.977 7.237 11.938 C 7.513 11.791 14 8.25 14 3.875 C 13.999 2.848 13.59 1.863 12.864 1.136 C 12.137 0.41 11.152 0.001 10.125 0 Z M 7 10.925 C 5.859 10.26 1 7.231 1 3.875 C 1.001 3.113 1.304 2.382 1.843 1.843 C 2.382 1.304 3.113 1.001 3.875 1 C 5.091 1 6.111 1.648 6.537 2.688 C 6.575 2.779 6.639 2.858 6.722 2.913 C 6.804 2.968 6.901 2.998 7 2.998 C 7.099 2.998 7.196 2.968 7.278 2.913 C 7.361 2.858 7.425 2.779 7.462 2.688 C 7.889 1.646 8.909 1 10.125 1 C 10.887 1.001 11.618 1.304 12.157 1.843 C 12.696 2.382 12.999 3.113 13 3.875 C 13 7.226 8.14 10.259 7 10.925 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 500,
          fontSize: "calc(var(--button-typo-size-l) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--button-ghost-text-default)",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
      {props.rightIcon && (
        <div
          style={{
            position: "relative",
            width: 16,
            height: "calc(var(--button-iconsize-l) * 1px)",
            flexShrink: 0,
          }}
        >
          <svg
            width={14}
            height={11.997}
            viewBox="0 0 14 11.997"
            fill="none"
            style={{
              position: "absolute",
              left: 1,
              top: 2.5,
              width: 14,
              height: 11.997,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 10.125 0 C 8.834 0 7.704 0.555 7 1.493 C 6.296 0.555 5.166 0 3.875 0 C 2.848 0.001 1.863 0.41 1.136 1.136 C 0.41 1.863 0.001 2.848 0 3.875 C 0 8.25 6.487 11.791 6.763 11.938 C 6.836 11.977 6.917 11.997 7 11.997 C 7.083 11.997 7.164 11.977 7.237 11.938 C 7.513 11.791 14 8.25 14 3.875 C 13.999 2.848 13.59 1.863 12.864 1.136 C 12.137 0.41 11.152 0.001 10.125 0 Z M 7 10.925 C 5.859 10.26 1 7.231 1 3.875 C 1.001 3.113 1.304 2.382 1.843 1.843 C 2.382 1.304 3.113 1.001 3.875 1 C 5.091 1 6.111 1.648 6.537 2.688 C 6.575 2.779 6.639 2.858 6.722 2.913 C 6.804 2.968 6.901 2.998 7 2.998 C 7.099 2.998 7.196 2.968 7.278 2.913 C 7.361 2.858 7.425 2.779 7.462 2.688 C 7.889 1.646 8.909 1 10.125 1 C 10.887 1.001 11.618 1.304 12.157 1.843 C 12.696 2.382 12.999 3.113 13 3.875 C 13 7.226 8.14 10.259 7 10.925 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
    </div>
  );
  const __body13 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "var(--button-ghost-bg-hover)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-8) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      {props.leftIcon && (
        <div
          style={{
            position: "relative",
            width: 16,
            height: "calc(var(--button-iconsize-l) * 1px)",
            flexShrink: 0,
          }}
        >
          <svg
            width={14}
            height={11.997}
            viewBox="0 0 14 11.997"
            fill="none"
            style={{
              position: "absolute",
              left: 1,
              top: 2.5,
              width: 14,
              height: 11.997,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 10.125 0 C 8.834 0 7.704 0.555 7 1.493 C 6.296 0.555 5.166 0 3.875 0 C 2.848 0.001 1.863 0.41 1.136 1.136 C 0.41 1.863 0.001 2.848 0 3.875 C 0 8.25 6.487 11.791 6.763 11.938 C 6.836 11.977 6.917 11.997 7 11.997 C 7.083 11.997 7.164 11.977 7.237 11.938 C 7.513 11.791 14 8.25 14 3.875 C 13.999 2.848 13.59 1.863 12.864 1.136 C 12.137 0.41 11.152 0.001 10.125 0 Z M 7 10.925 C 5.859 10.26 1 7.231 1 3.875 C 1.001 3.113 1.304 2.382 1.843 1.843 C 2.382 1.304 3.113 1.001 3.875 1 C 5.091 1 6.111 1.648 6.537 2.688 C 6.575 2.779 6.639 2.858 6.722 2.913 C 6.804 2.968 6.901 2.998 7 2.998 C 7.099 2.998 7.196 2.968 7.278 2.913 C 7.361 2.858 7.425 2.779 7.462 2.688 C 7.889 1.646 8.909 1 10.125 1 C 10.887 1.001 11.618 1.304 12.157 1.843 C 12.696 2.382 12.999 3.113 13 3.875 C 13 7.226 8.14 10.259 7 10.925 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 500,
          fontSize: "calc(var(--button-typo-size-l) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--button-ghost-text-hover)",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
      {props.rightIcon && (
        <div
          style={{
            position: "relative",
            width: 16,
            height: "calc(var(--button-iconsize-l) * 1px)",
            flexShrink: 0,
          }}
        >
          <svg
            width={14}
            height={11.997}
            viewBox="0 0 14 11.997"
            fill="none"
            style={{
              position: "absolute",
              left: 1,
              top: 2.5,
              width: 14,
              height: 11.997,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 10.125 0 C 8.834 0 7.704 0.555 7 1.493 C 6.296 0.555 5.166 0 3.875 0 C 2.848 0.001 1.863 0.41 1.136 1.136 C 0.41 1.863 0.001 2.848 0 3.875 C 0 8.25 6.487 11.791 6.763 11.938 C 6.836 11.977 6.917 11.997 7 11.997 C 7.083 11.997 7.164 11.977 7.237 11.938 C 7.513 11.791 14 8.25 14 3.875 C 13.999 2.848 13.59 1.863 12.864 1.136 C 12.137 0.41 11.152 0.001 10.125 0 Z M 7 10.925 C 5.859 10.26 1 7.231 1 3.875 C 1.001 3.113 1.304 2.382 1.843 1.843 C 2.382 1.304 3.113 1.001 3.875 1 C 5.091 1 6.111 1.648 6.537 2.688 C 6.575 2.779 6.639 2.858 6.722 2.913 C 6.804 2.968 6.901 2.998 7 2.998 C 7.099 2.998 7.196 2.968 7.278 2.913 C 7.361 2.858 7.425 2.779 7.462 2.688 C 7.889 1.646 8.909 1 10.125 1 C 10.887 1.001 11.618 1.304 12.157 1.843 C 12.696 2.382 12.999 3.113 13 3.875 C 13 7.226 8.14 10.259 7 10.925 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
    </div>
  );
  const __body14 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-8) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      {props.leftIcon && (
        <div
          style={{
            position: "relative",
            width: 16,
            height: "calc(var(--button-iconsize-l) * 1px)",
            flexShrink: 0,
          }}
        >
          <svg
            width={14}
            height={11.997}
            viewBox="0 0 14 11.997"
            fill="none"
            style={{
              position: "absolute",
              left: 1,
              top: 2.5,
              width: 14,
              height: 11.997,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 10.125 0 C 8.834 0 7.704 0.555 7 1.493 C 6.296 0.555 5.166 0 3.875 0 C 2.848 0.001 1.863 0.41 1.136 1.136 C 0.41 1.863 0.001 2.848 0 3.875 C 0 8.25 6.487 11.791 6.763 11.938 C 6.836 11.977 6.917 11.997 7 11.997 C 7.083 11.997 7.164 11.977 7.237 11.938 C 7.513 11.791 14 8.25 14 3.875 C 13.999 2.848 13.59 1.863 12.864 1.136 C 12.137 0.41 11.152 0.001 10.125 0 Z M 7 10.925 C 5.859 10.26 1 7.231 1 3.875 C 1.001 3.113 1.304 2.382 1.843 1.843 C 2.382 1.304 3.113 1.001 3.875 1 C 5.091 1 6.111 1.648 6.537 2.688 C 6.575 2.779 6.639 2.858 6.722 2.913 C 6.804 2.968 6.901 2.998 7 2.998 C 7.099 2.998 7.196 2.968 7.278 2.913 C 7.361 2.858 7.425 2.779 7.462 2.688 C 7.889 1.646 8.909 1 10.125 1 C 10.887 1.001 11.618 1.304 12.157 1.843 C 12.696 2.382 12.999 3.113 13 3.875 C 13 7.226 8.14 10.259 7 10.925 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 600,
          fontSize: "calc(var(--button-typo-size-l) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--button-ghost-text-pressed)",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
      {props.rightIcon && (
        <div
          style={{
            position: "relative",
            width: 16,
            height: "calc(var(--button-iconsize-l) * 1px)",
            flexShrink: 0,
          }}
        >
          <svg
            width={14}
            height={11.997}
            viewBox="0 0 14 11.997"
            fill="none"
            style={{
              position: "absolute",
              left: 1,
              top: 2.5,
              width: 14,
              height: 11.997,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 10.125 0 C 8.834 0 7.704 0.555 7 1.493 C 6.296 0.555 5.166 0 3.875 0 C 2.848 0.001 1.863 0.41 1.136 1.136 C 0.41 1.863 0.001 2.848 0 3.875 C 0 8.25 6.487 11.791 6.763 11.938 C 6.836 11.977 6.917 11.997 7 11.997 C 7.083 11.997 7.164 11.977 7.237 11.938 C 7.513 11.791 14 8.25 14 3.875 C 13.999 2.848 13.59 1.863 12.864 1.136 C 12.137 0.41 11.152 0.001 10.125 0 Z M 7 10.925 C 5.859 10.26 1 7.231 1 3.875 C 1.001 3.113 1.304 2.382 1.843 1.843 C 2.382 1.304 3.113 1.001 3.875 1 C 5.091 1 6.111 1.648 6.537 2.688 C 6.575 2.779 6.639 2.858 6.722 2.913 C 6.804 2.968 6.901 2.998 7 2.998 C 7.099 2.998 7.196 2.968 7.278 2.913 C 7.361 2.858 7.425 2.779 7.462 2.688 C 7.889 1.646 8.909 1 10.125 1 C 10.887 1.001 11.618 1.304 12.157 1.843 C 12.696 2.382 12.999 3.113 13 3.875 C 13 7.226 8.14 10.259 7 10.925 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
    </div>
  );
  const __body15 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        backgroundColor: "rgba(255,255,255,0)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--numbers-tailwind-8) * 1px)",
        alignItems: "center",
        flexWrap: "nowrap",
        position: "relative",
        ...props.style,
      }}
    >
      {props.leftIcon && (
        <div
          style={{
            position: "relative",
            width: 16,
            height: "calc(var(--button-iconsize-l) * 1px)",
            flexShrink: 0,
          }}
        >
          <svg
            width={14}
            height={11.997}
            viewBox="0 0 14 11.997"
            fill="none"
            style={{
              position: "absolute",
              left: 1,
              top: 2.5,
              width: 14,
              height: 11.997,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 10.125 0 C 8.834 0 7.704 0.555 7 1.493 C 6.296 0.555 5.166 0 3.875 0 C 2.848 0.001 1.863 0.41 1.136 1.136 C 0.41 1.863 0.001 2.848 0 3.875 C 0 8.25 6.487 11.791 6.763 11.938 C 6.836 11.977 6.917 11.997 7 11.997 C 7.083 11.997 7.164 11.977 7.237 11.938 C 7.513 11.791 14 8.25 14 3.875 C 13.999 2.848 13.59 1.863 12.864 1.136 C 12.137 0.41 11.152 0.001 10.125 0 Z M 7 10.925 C 5.859 10.26 1 7.231 1 3.875 C 1.001 3.113 1.304 2.382 1.843 1.843 C 2.382 1.304 3.113 1.001 3.875 1 C 5.091 1 6.111 1.648 6.537 2.688 C 6.575 2.779 6.639 2.858 6.722 2.913 C 6.804 2.968 6.901 2.998 7 2.998 C 7.099 2.998 7.196 2.968 7.278 2.913 C 7.361 2.858 7.425 2.779 7.462 2.688 C 7.889 1.646 8.909 1 10.125 1 C 10.887 1.001 11.618 1.304 12.157 1.843 C 12.696 2.382 12.999 3.113 13 3.875 C 13 7.226 8.14 10.259 7 10.925 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
      <span
        style={{
          position: "relative",
          fontFamily: '"Ubuntu Sans Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 400,
          fontSize: "calc(var(--button-typo-size-l) * 1px)",
          textAlign: "center",
          whiteSpace: "nowrap",
          lineHeight: 1.2000000476837158,
          color: "var(--button-ghost-text-disabled)",
          textTransform: "uppercase",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {props.label}
      </span>
      {props.rightIcon && (
        <div
          style={{
            position: "relative",
            width: 16,
            height: "calc(var(--button-iconsize-l) * 1px)",
            flexShrink: 0,
          }}
        >
          <svg
            width={14}
            height={11.997}
            viewBox="0 0 14 11.997"
            fill="none"
            style={{
              position: "absolute",
              left: 1,
              top: 2.5,
              width: 14,
              height: 11.997,
              color: "rgb(10,10,10)",
            }}
          >
            <path
              d={
                "M 10.125 0 C 8.834 0 7.704 0.555 7 1.493 C 6.296 0.555 5.166 0 3.875 0 C 2.848 0.001 1.863 0.41 1.136 1.136 C 0.41 1.863 0.001 2.848 0 3.875 C 0 8.25 6.487 11.791 6.763 11.938 C 6.836 11.977 6.917 11.997 7 11.997 C 7.083 11.997 7.164 11.977 7.237 11.938 C 7.513 11.791 14 8.25 14 3.875 C 13.999 2.848 13.59 1.863 12.864 1.136 C 12.137 0.41 11.152 0.001 10.125 0 Z M 7 10.925 C 5.859 10.26 1 7.231 1 3.875 C 1.001 3.113 1.304 2.382 1.843 1.843 C 2.382 1.304 3.113 1.001 3.875 1 C 5.091 1 6.111 1.648 6.537 2.688 C 6.575 2.779 6.639 2.858 6.722 2.913 C 6.804 2.968 6.901 2.998 7 2.998 C 7.099 2.998 7.196 2.968 7.278 2.913 C 7.361 2.858 7.425 2.779 7.462 2.688 C 7.889 1.646 8.909 1 10.125 1 C 10.887 1.001 11.618 1.304 12.157 1.843 C 12.696 2.382 12.999 3.113 13 3.875 C 13 7.226 8.14 10.259 7 10.925 Z"
              }
              fill="currentColor"
              fillRule="nonzero"
            />
          </svg>
        </div>
      )}
    </div>
  );
  const __impls = {
    // figma: State=Deault, Size=Xs
    "state=deault|size=xs": __body0,
    // figma: State=Hover, Size=Xs
    "state=hover|size=xs": __body1,
    // figma: State=Pressed, Size=Xs
    "state=pressed|size=xs": __body2,
    // figma: State=Disabled, Size=Xs
    "state=disabled|size=xs": __body3,
    // figma: State=Deault, Size=S
    "state=deault|size=s": __body4,
    // figma: State=Hover, Size=S
    "state=hover|size=s": __body5,
    // figma: State=Pressed, Size=S
    "state=pressed|size=s": __body6,
    // figma: State=Disabled, Size=S
    "state=disabled|size=s": __body7,
    // figma: State=Deault, Size=M
    "state=deault|size=m": __body8,
    // figma: State=Hover, Size=M
    "state=hover|size=m": __body9,
    // figma: State=Pressed, Size=M
    "state=pressed|size=m": __body10,
    // figma: State=Disabled, Size=M
    "state=disabled|size=m": __body11,
    // figma: State=Deault, Size=L
    "state=deault|size=l": __body12,
    // figma: State=Hover, Size=L
    "state=hover|size=l": __body13,
    // figma: State=Pressed, Size=L
    "state=pressed|size=l": __body14,
    // figma: State=Disabled, Size=L
    "state=disabled|size=l": __body15,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Ghost;
