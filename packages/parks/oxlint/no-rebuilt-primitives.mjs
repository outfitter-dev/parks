import { attribute, nameOf, stringOf, valueOf } from "./jsx.mjs";

const elements = {
  button: "Button",
  input: "Input",
  "input[type=checkbox]": "Checkbox",
  "input[type=radio]": "RadioGroupItem",
  "input[type=hidden]": "",
  "input[type=file]": "",
  "input[type=range]": "",
  textarea: "Textarea",
  select: "Select",
};

export default {
  meta: {
    type: "suggestion",
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const tag = nameOf(node.name);
        // Base UI's render prop intentionally receives native elements.
        const container = node.parent?.parent;
        if (
          container?.type === "JSXExpressionContainer" &&
          nameOf(container.parent?.name) === "render"
        ) {
          return;
        }
        const type = stringOf(valueOf(attribute(node, "type")));
        if (tag === "input" && attribute(node, "type") && type === undefined) {
          return;
        }
        const key = `${tag}[type=${type}]`;
        const replacement = elements[Object.hasOwn(elements, key) ? key : tag];
        if (!Object.hasOwn(elements, key) && !Object.hasOwn(elements, tag)) {
          return;
        }
        if (!replacement) {
          return;
        }
        context.report({
          node,
          message: `Use Parks ${replacement} for <${tag}> so its theme, interaction and accessibility behavior stay consistent.`,
        });
      },
    };
  },
};
