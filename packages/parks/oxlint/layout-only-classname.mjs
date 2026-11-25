import {
  attribute,
  importsOf,
  nameOf,
  stringsOf,
  utilityOf,
  valueOf,
} from "./jsx.mjs";

// Padding changes a component's density and belongs in its size API.
const layout =
  /^(?:-?(?:m[xytrblse]?|w|h|min-w|max-w|min-h|max-h|size|inset(?:-[xy])?|top|right|bottom|left|start|end|z|order|col|row|gap(?:-[xy])?|space-[xy]|basis|justify-items|grid-cols|grid-rows|grid-flow|auto-cols|auto-rows|items|justify|content|place-items|place-content|self|justify-self|place-self|aspect|translate(?:-[xy])?|scroll-m[xytrblse]?)-.+|flex(?:-(?:1|auto|none|initial|row|col|row-reverse|col-reverse|wrap|nowrap|wrap-reverse))?|grid|inline-flex|inline-grid|grow(?:-.+)?|shrink(?:-.+)?|absolute|relative|fixed|sticky|static|hidden|block|inline|inline-block|contents|sr-only|not-sr-only|(?:group|peer)(?:\/.+)?)$/u;

export default {
  meta: {
    type: "suggestion",
    schema: [],
  },
  create(context) {
    const imports = importsOf(context);
    return {
      Program: imports.program,
      JSXOpeningElement(node) {
        const component = imports.resolve(node.name);
        const className = attribute(node, "className");
        if (!component || !className) {
          return;
        }
        const restyles = stringsOf(valueOf(className))
          .flatMap((value) => value.split(/\s+/u))
          .filter(Boolean)
          .filter((token) => {
            const utility = utilityOf(token);
            return !layout.test(utility);
          });
        if (restyles.length === 0) {
          return;
        }
        context.report({
          node: className,
          message: `Use a Parks prop or variant for ${[...new Set(restyles)].join(", ")} on <${nameOf(node.name)}>. className may place the component or arrange its children.`,
        });
      },
    };
  },
};
