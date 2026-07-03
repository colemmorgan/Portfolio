import { r as reactExports } from "./react.mjs";
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none"
};
const HugeiconsIcon = reactExports.forwardRef(({ color = "currentColor", size = 24, strokeWidth, absoluteStrokeWidth = false, className = "", altIcon, showAlt = false, icon, primaryColor, secondaryColor, disableSecondaryOpacity = false, ...rest }, ref) => {
  const calculatedStrokeWidth = strokeWidth !== void 0 ? absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth : void 0;
  const strokeProps = calculatedStrokeWidth !== void 0 ? {
    strokeWidth: calculatedStrokeWidth,
    stroke: "currentColor"
  } : {};
  const elementProps = {
    ref,
    ...defaultAttributes,
    width: size,
    height: size,
    color: primaryColor || color,
    className,
    ...strokeProps,
    ...rest
  };
  const currentIcon = showAlt && altIcon ? altIcon : icon;
  const svgChildren = [...currentIcon].sort(([, a], [, b]) => {
    const hasOpacityA = a.opacity !== void 0;
    const hasOpacityB = b.opacity !== void 0;
    return hasOpacityB ? 1 : hasOpacityA ? -1 : 0;
  }).map(([tag, attrs]) => {
    const isSecondaryPath = attrs.opacity !== void 0;
    const pathOpacity = isSecondaryPath && !disableSecondaryOpacity ? attrs.opacity : void 0;
    const fillProps = secondaryColor ? {
      ...attrs.stroke !== void 0 ? {
        stroke: isSecondaryPath ? secondaryColor : primaryColor || color
      } : {
        fill: isSecondaryPath ? secondaryColor : primaryColor || color
      }
    } : {};
    return reactExports.createElement(tag, {
      ...attrs,
      ...strokeProps,
      ...fillProps,
      opacity: pathOpacity,
      key: attrs.key
    });
  });
  return reactExports.createElement("svg", elementProps, svgChildren);
});
HugeiconsIcon.displayName = "HugeiconsIcon";
export {
  HugeiconsIcon as H
};
