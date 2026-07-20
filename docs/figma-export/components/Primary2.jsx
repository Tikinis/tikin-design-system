import { Value } from "./Value.jsx";

// figma node: 2:135125 Primary (20 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "state=" + __venc(p.state) + "|" + "size=" + __venc(p.size);

export function Primary2(_p = {}) {
  const props = {
    ..._p,
    label: _p.label ?? "Label",
    leftIcon: _p.leftIcon ?? false,
    state: _p.state ?? "default",
    size: _p.size ?? "m",
    rightIcon: _p.rightIcon ?? false,
  };
  const __body0 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        height: "calc(var(--numbers-tailwind-48) * 1px)",
        borderRadius: 10,
        backgroundColor: "rgb(230,230,230)",
        display: "flex",
        flexDirection: "row",
        padding: "16px 24px 16px 24px",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-16) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-16) * 1px)",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--numbers-tailwind-8) * 1px)",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
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
                color: "rgb(255,255,255)",
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
            color: "var(--button-primary-text-disabled)",
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
                color: "rgb(255,255,255)",
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
    </div>
  );
  const __body1 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        height: "calc(var(--numbers-tailwind-48) * 1px)",
        borderRadius: 10,
        backgroundColor: "var(--button-primary-bg-default-2)",
        display: "flex",
        flexDirection: "row",
        padding: "16px 24px 16px 24px",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-16) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-16) * 1px)",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--numbers-tailwind-8) * 1px)",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
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
                color: "var(--button-primary-icon-default-2)",
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
            color: "var(--button-primary-text-default-2)",
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
                color: "var(--button-primary-icon-default-2)",
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
    </div>
  );
  const __body2 = () => (
    <div
      className={props.className}
      style={{
        width: 88,
        height: "calc(var(--numbers-tailwind-48) * 1px)",
        minWidth: 80,
        borderRadius: 10,
        backgroundColor: "rgb(230,230,230)",
        display: "flex",
        flexDirection: "row",
        padding: "16px 24px 16px 24px",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-16) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-16) * 1px)",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 16,
          flexShrink: 0,
          alignSelf: "stretch",
          height: "auto",
          color: "var(--button-primary-icon-loading)",
        }}
      >
        {props.icon1 ?? <Value value={"spinner"} />}
      </div>
    </div>
  );
  const __body3 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        height: "calc(var(--numbers-tailwind-32) * 1px)",
        borderRadius: 6,
        backgroundColor: "var(--button-primary-bg-default-2)",
        display: "flex",
        flexDirection: "row",
        padding: "8px 24px 8px 24px",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-8) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-8) * 1px)",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--numbers-tailwind-4) * 1px)",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
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
                color: "var(--button-primary-icon-default-2)",
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
            color: "var(--button-primary-text-default-2)",
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
                color: "var(--button-primary-icon-default-2)",
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
    </div>
  );
  const __body4 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        height: "calc(var(--numbers-tailwind-32) * 1px)",
        borderRadius: 6,
        backgroundColor: "var(--button-primary-bg-hover)",
        boxShadow: "0px 0px 2px 0px rgba(10,10,10,0.1)",
        display: "flex",
        flexDirection: "row",
        padding: "8px 24px 8px 24px",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-8) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-8) * 1px)",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--numbers-tailwind-4) * 1px)",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
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
                color: "rgb(255,255,255)",
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
            color: "var(--button-primary-text-hover)",
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
                color: "rgb(255,255,255)",
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
    </div>
  );
  const __body5 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        height: "calc(var(--numbers-tailwind-32) * 1px)",
        borderRadius: 6,
        backgroundColor: "var(--button-primary-bg-pressed)",
        display: "flex",
        flexDirection: "row",
        padding: "8px 24px 8px 24px",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-8) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-8) * 1px)",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--numbers-tailwind-4) * 1px)",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
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
                color: "var(--button-primary-icon-pressed)",
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
            color: "var(--button-primary-text-pressed)",
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
                color: "var(--button-primary-icon-pressed)",
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
    </div>
  );
  const __body6 = () => (
    <div
      className={props.className}
      style={{
        width: 82,
        height: "calc(var(--numbers-tailwind-32) * 1px)",
        minWidth: 80,
        borderRadius: 6,
        backgroundColor: "rgb(230,230,230)",
        display: "flex",
        flexDirection: "row",
        padding: "8px 24px 8px 24px",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-8) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-8) * 1px)",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 12,
          height: 12,
          flexShrink: 0,
          color: "var(--button-primary-icon-loading)",
        }}
      >
        {props.icon1 ?? (
          <Value
            value={"spinner"}
            style={{ transform: "scale(0.750, 0.750)", transformOrigin: "0 0" }}
          />
        )}
      </div>
    </div>
  );
  const __body7 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        height: "calc(var(--numbers-tailwind-32) * 1px)",
        borderRadius: 6,
        backgroundColor: "rgb(230,230,230)",
        display: "flex",
        flexDirection: "row",
        padding: "8px 24px 8px 24px",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-8) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-8) * 1px)",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--numbers-tailwind-4) * 1px)",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
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
                color: "rgb(255,255,255)",
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
            color: "var(--button-primary-text-disabled)",
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
                color: "rgb(255,255,255)",
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
    </div>
  );
  const __body8 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        height: "calc(var(--numbers-tailwind-40) * 1px)",
        borderRadius: 8,
        backgroundColor: "var(--button-primary-bg-default-2)",
        display: "flex",
        flexDirection: "row",
        padding: "12px 24px 12px 24px",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-12) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-12) * 1px)",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--numbers-tailwind-4) * 1px)",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
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
                color: "var(--button-primary-icon-default-2)",
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
            color: "var(--button-primary-text-default-2)",
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
                color: "var(--button-primary-icon-default-2)",
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
    </div>
  );
  const __body9 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        height: "calc(var(--numbers-tailwind-40) * 1px)",
        borderRadius: 8,
        backgroundColor: "var(--button-primary-bg-hover)",
        boxShadow: "0px 0px 2px 0px rgba(10,10,10,0.1)",
        display: "flex",
        flexDirection: "row",
        padding: "12px 24px 12px 24px",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-12) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-12) * 1px)",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--numbers-tailwind-4) * 1px)",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
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
                color: "rgb(255,255,255)",
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
            color: "var(--button-primary-text-hover)",
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
                color: "rgb(255,255,255)",
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
    </div>
  );
  const __body10 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        height: "calc(var(--numbers-tailwind-40) * 1px)",
        borderRadius: 8,
        backgroundColor: "var(--button-primary-bg-pressed)",
        display: "flex",
        flexDirection: "row",
        padding: "12px 24px 12px 24px",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-12) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-12) * 1px)",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--numbers-tailwind-4) * 1px)",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
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
                color: "var(--button-primary-icon-pressed)",
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
            color: "var(--button-primary-text-pressed)",
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
                color: "var(--button-primary-icon-pressed)",
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
    </div>
  );
  const __body11 = () => (
    <div
      className={props.className}
      style={{
        width: 88,
        height: "calc(var(--numbers-tailwind-40) * 1px)",
        minWidth: 80,
        borderRadius: 8,
        backgroundColor: "rgb(230,230,230)",
        display: "flex",
        flexDirection: "row",
        padding: "12px 24px 12px 24px",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-12) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-12) * 1px)",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 12,
          height: 12,
          flexShrink: 0,
          color: "var(--button-primary-icon-loading)",
        }}
      >
        {props.icon1 ?? (
          <Value
            value={"spinner"}
            style={{ transform: "scale(0.750, 0.750)", transformOrigin: "0 0" }}
          />
        )}
      </div>
    </div>
  );
  const __body12 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        height: "calc(var(--numbers-tailwind-40) * 1px)",
        borderRadius: 8,
        backgroundColor: "rgb(230,230,230)",
        display: "flex",
        flexDirection: "row",
        padding: "12px 24px 12px 24px",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-12) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-12) * 1px)",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--numbers-tailwind-4) * 1px)",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
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
                color: "rgb(255,255,255)",
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
            color: "var(--button-primary-text-disabled)",
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
                color: "rgb(255,255,255)",
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
    </div>
  );
  const __body13 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        height: "calc(var(--numbers-tailwind-48) * 1px)",
        borderRadius: 10,
        backgroundColor: "var(--button-primary-bg-hover)",
        boxShadow: "0px 0px 2px 0px rgba(10,10,10,0.1)",
        display: "flex",
        flexDirection: "row",
        padding: "16px 24px 16px 24px",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-16) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-16) * 1px)",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--numbers-tailwind-8) * 1px)",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
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
                color: "rgb(255,255,255)",
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
            color: "var(--button-primary-text-hover)",
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
                color: "rgb(255,255,255)",
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
    </div>
  );
  const __body14 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        height: "calc(var(--numbers-tailwind-48) * 1px)",
        borderRadius: 10,
        backgroundColor: "var(--button-primary-bg-pressed)",
        display: "flex",
        flexDirection: "row",
        padding: "16px 24px 16px 24px",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-16) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-16) * 1px)",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--numbers-tailwind-8) * 1px)",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
          alignSelf: "stretch",
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
                color: "var(--button-primary-icon-pressed)",
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
            color: "var(--button-primary-text-pressed)",
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
                color: "var(--button-primary-icon-pressed)",
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
    </div>
  );
  const __body15 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        height: "calc(var(--numbers-tailwind-56) * 1px)",
        borderRadius: 12,
        backgroundColor: "var(--button-primary-bg-default-2)",
        display: "flex",
        flexDirection: "row",
        padding: "16px 24px 16px 24px",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-16) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-16) * 1px)",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--numbers-tailwind-8) * 1px)",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
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
                color: "var(--button-primary-icon-default-2)",
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
            color: "var(--button-primary-text-default-2)",
            textTransform: "uppercase",
            flexShrink: 0,
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
                color: "var(--button-primary-icon-default-2)",
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
    </div>
  );
  const __body16 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        height: "calc(var(--numbers-tailwind-56) * 1px)",
        borderRadius: 12,
        backgroundColor: "var(--button-primary-bg-hover)",
        boxShadow: "0px 0px 2px 0px rgba(10,10,10,0.1)",
        display: "flex",
        flexDirection: "row",
        padding: "16px 24px 16px 24px",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-16) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-16) * 1px)",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--numbers-tailwind-8) * 1px)",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
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
                color: "rgb(255,255,255)",
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
            color: "var(--button-primary-text-hover)",
            textTransform: "uppercase",
            flexShrink: 0,
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
                color: "rgb(255,255,255)",
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
    </div>
  );
  const __body17 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        height: "calc(var(--numbers-tailwind-56) * 1px)",
        borderRadius: 12,
        backgroundColor: "var(--button-primary-bg-pressed)",
        display: "flex",
        flexDirection: "row",
        padding: "16px 24px 16px 24px",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-16) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-16) * 1px)",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--numbers-tailwind-8) * 1px)",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
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
                color: "var(--button-primary-icon-pressed)",
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
            color: "var(--button-primary-text-pressed)",
            textTransform: "uppercase",
            flexShrink: 0,
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
                color: "var(--button-primary-icon-pressed)",
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
    </div>
  );
  const __body18 = () => (
    <div
      className={props.className}
      style={{
        width: 93,
        height: "calc(var(--numbers-tailwind-56) * 1px)",
        minWidth: 80,
        borderRadius: 12,
        backgroundColor: "rgb(230,230,230)",
        display: "flex",
        flexDirection: "row",
        padding: "16px 24px 16px 24px",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-16) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-16) * 1px)",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "var(--button-primary-icon-loading)",
        }}
      >
        {props.icon1 ?? <Value value={"spinner"} />}
      </div>
    </div>
  );
  const __body19 = () => (
    <div
      className={props.className}
      style={{
        width: "fit-content",
        height: "calc(var(--numbers-tailwind-56) * 1px)",
        borderRadius: 12,
        backgroundColor: "rgb(230,230,230)",
        display: "flex",
        flexDirection: "row",
        padding: "16px 24px 16px 24px",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        gap: "calc(var(--numbers-tailwind-0) * 1px)",
        paddingLeft: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingTop: "calc(var(--numbers-tailwind-16) * 1px)",
        paddingRight: "calc(var(--numbers-tailwind-24) * 1px)",
        paddingBottom: "calc(var(--numbers-tailwind-16) * 1px)",
        position: "relative",
        ...props.style,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--numbers-tailwind-8) * 1px)",
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0,
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
                color: "rgb(255,255,255)",
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
            color: "var(--button-primary-text-disabled)",
            textTransform: "uppercase",
            flexShrink: 0,
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
                color: "rgb(255,255,255)",
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
    </div>
  );
  const __impls = {
    // figma: State=Disabled, Size=M
    "state=disabled|size=m": __body0,
    // figma: State=Default, Size=M
    "state=default|size=m": __body1,
    // figma: State=Loading, Size=M
    "state=loading|size=m": __body2,
    // figma: State=Default, Size=Xs
    "state=default|size=xs": __body3,
    // figma: State=Hover, Size=Xs
    "state=hover|size=xs": __body4,
    // figma: State=Pressed, Size=Xs
    "state=pressed|size=xs": __body5,
    // figma: State=Loading, Size=Xs
    "state=loading|size=xs": __body6,
    // figma: State=Disabled, Size=Xs
    "state=disabled|size=xs": __body7,
    // figma: State=Default, Size=S
    "state=default|size=s": __body8,
    // figma: State=Hover, Size=S
    "state=hover|size=s": __body9,
    // figma: State=Pressed, Size=S
    "state=pressed|size=s": __body10,
    // figma: State=Loading, Size=S
    "state=loading|size=s": __body11,
    // figma: State=Disabled, Size=S
    "state=disabled|size=s": __body12,
    // figma: State=Hover, Size=M
    "state=hover|size=m": __body13,
    // figma: State=Pressed, Size=M
    "state=pressed|size=m": __body14,
    // figma: State=Default, Size=L
    "state=default|size=l": __body15,
    // figma: State=Hover, Size=L
    "state=hover|size=l": __body16,
    // figma: State=Pressed, Size=L
    "state=pressed|size=l": __body17,
    // figma: State=Loading, Size=L
    "state=loading|size=l": __body18,
    // figma: State=Disabled, Size=L
    "state=disabled|size=l": __body19,
  };
  return (__impls[__vkey(props)] ?? __body1)();
}
export default Primary2;
