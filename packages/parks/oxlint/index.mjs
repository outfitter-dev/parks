import iconButtonLabel from "./icon-button-label.mjs";
import layoutOnlyClassname from "./layout-only-classname.mjs";
import noRebuiltPrimitives from "./no-rebuilt-primitives.mjs";

export default {
  meta: { name: "parks" },
  rules: {
    "icon-button-label": iconButtonLabel,
    "layout-only-classname": layoutOnlyClassname,
    "no-rebuilt-primitives": noRebuiltPrimitives,
  },
};
