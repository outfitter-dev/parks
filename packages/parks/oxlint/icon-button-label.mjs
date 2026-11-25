import { attribute, importsOf, nameOf, stringOf, valueOf } from "./jsx.mjs";

function hasLabel(opening) {
  return ["aria-label", "aria-labelledby"].some((name) => {
    const label = attribute(opening, name);
    if (!label) {
      return false;
    }
    const value = valueOf(label);
    if (!value || value.type === "JSXEmptyExpression") {
      return false;
    }
    if (value.type === "Literal" && typeof value.value !== "string") {
      return false;
    }
    if (value.type === "Identifier" && value.name === "undefined") {
      return false;
    }
    const literal = stringOf(value);
    return literal === undefined || literal.trim().length > 0;
  });
}

/** Hidden descendants contribute no text to a button's accessible name. */
function isHidden(opening) {
  const ariaAttribute = attribute(opening, "aria-hidden");
  const ariaValue = valueOf(ariaAttribute);
  const htmlAttribute = attribute(opening, "hidden");
  const htmlValue = valueOf(htmlAttribute);
  return (
    (ariaAttribute &&
      (!ariaAttribute.value ||
        ariaValue?.value === true ||
        stringOf(ariaValue) === "true")) ||
    (htmlAttribute &&
      (!htmlAttribute.value ||
        htmlValue?.value === true ||
        typeof htmlValue?.value === "string"))
  );
}

function contentOf(node, icons) {
  if (node.type === "JSXText") {
    return node.value.trim() ? "text" : "empty";
  }
  if (node.type === "JSXExpressionContainer") {
    if (node.expression.type === "JSXEmptyExpression") {
      return "empty";
    }
    const text = stringOf(node.expression);
    if (text === undefined) {
      return "unknown";
    }
    return text.trim() ? "text" : "empty";
  }
  if (node.type !== "JSXElement" && node.type !== "JSXFragment") {
    return "unknown";
  }
  if (node.type === "JSXElement") {
    const opening = node.openingElement;
    if (isHidden(opening)) {
      return "icon";
    }
    if (icons.test(nameOf(opening.name))) {
      return "icon";
    }
  }
  const children = new Set(
    node.children.map((child) => contentOf(child, icons))
  );
  if (children.has("text")) {
    return "text";
  }
  if (children.has("unknown")) {
    return "unknown";
  }
  return children.has("icon") ? "icon" : "empty";
}

export default {
  meta: {
    type: "problem",
    schema: [],
  },
  create(context) {
    const imports = importsOf(context);
    const icons = /^Icon|Icon$|^svg$/u;
    return {
      Program: imports.program,
      JSXElement(node) {
        const opening = node.openingElement;
        const component = imports.resolve(opening.name);
        if (component?.imported !== "Button") {
          return;
        }
        if (hasLabel(opening)) {
          return;
        }
        // A spread may supply the accessible name at runtime.
        if (
          opening.attributes.some((item) => item.type === "JSXSpreadAttribute")
        ) {
          return;
        }
        const content = new Set(
          node.children.map((child) => contentOf(child, icons))
        );
        if (content.has("text")) {
          return;
        }
        const size = stringOf(valueOf(attribute(opening, "size")));
        const iconSize = size === "icon" || size?.startsWith("icon-");
        const onlyIcons = content.has("icon") && !content.has("unknown");
        if (!iconSize && !onlyIcons) {
          return;
        }
        context.report({
          node: opening,
          message:
            "Give this icon button an accessible name with aria-label, aria-labelledby, or visually hidden text that names the action.",
        });
      },
    };
  },
};
