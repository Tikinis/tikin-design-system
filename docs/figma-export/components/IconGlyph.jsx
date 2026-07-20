// Renders icons from ./icon-data.js — <IconGlyph name="ArrowLeftFormatOutlineWeightRegular" size={24} />
const React = window.React;
import data from "./icon-data.js";
export function IconGlyph({ name, size = 24, style, ...rest }) {
  const icon = data[name];
  if (!icon) return null;
  return React.createElement("svg", {
    viewBox: icon.viewBox,
    width: size,
    height: size,
    style: { display: "block", ...style },
    dangerouslySetInnerHTML: { __html: icon.body },
    ...rest,
  });
}
module.exports = { IconGlyph };
