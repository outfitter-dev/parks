/** Shared JSX readers for the consumer rules. Dynamic values stay unknown. */
export function nameOf(node) {
  if (node?.type === "JSXMemberExpression") {
    return `${nameOf(node.object)}.${nameOf(node.property)}`;
  }
  return typeof node?.name === "string" ? node.name : "";
}

export function attribute(opening, name) {
  return opening.attributes?.find(
    (item) => item.type === "JSXAttribute" && nameOf(item.name) === name
  );
}

export function valueOf(item) {
  return item?.value?.type === "JSXExpressionContainer"
    ? item.value.expression
    : item?.value;
}

export function stringOf(node) {
  return typeof node?.value === "string" ? node.value : undefined;
}

export function stringsOf(node) {
  const literal = stringOf(node);
  if (literal !== undefined) {
    return [literal];
  }
  if (node?.type === "TemplateLiteral" && node.expressions.length === 0) {
    return node.quasis.map((part) => part.value.cooked ?? "");
  }
  if (node?.type === "ConditionalExpression") {
    return [...stringsOf(node.consequent), ...stringsOf(node.alternate)];
  }
  if (node?.type === "LogicalExpression") {
    return stringsOf(node.right);
  }
  if (node?.type === "ArrayExpression") {
    return node.elements.flatMap(stringsOf);
  }
  if (node?.type === "ObjectExpression") {
    return node.properties.flatMap((property) => {
      if (property.type !== "Property" || property.computed) {
        return [];
      }
      return stringsOf(property.key);
    });
  }
  if (
    node?.type === "CallExpression" &&
    ["cn", "cnState", "clsx", "cva", "twMerge"].includes(node.callee.name)
  ) {
    return node.arguments.flatMap(stringsOf);
  }
  return [];
}

/** Tailwind variants may themselves contain colons inside brackets. */
export function utilityOf(token) {
  let depth = 0;
  let start = 0;
  for (let index = 0; index < token.length; index += 1) {
    if (token[index] === "[" || token[index] === "(") {
      depth += 1;
    }
    if (token[index] === "]" || token[index] === ")") {
      depth -= 1;
    }
    if (token[index] === ":" && depth === 0) {
      start = index + 1;
    }
  }
  return token.slice(start).replaceAll(/^!|!$/gu, "");
}

/** Collect package imports before visiting JSX, including aliases and namespaces. */
export function importsOf(context) {
  const imports = new Map();
  function collect(node) {
    const source = stringOf(node.source);
    if (!source || node.importKind === "type") {
      return;
    }
    if (!source.startsWith("@outfitter/parks/components/")) {
      return;
    }
    for (const specifier of node.specifiers) {
      if (specifier.importKind === "type") {
        continue;
      }
      imports.set(specifier.local.name, {
        imported:
          specifier.type === "ImportNamespaceSpecifier"
            ? "*"
            : (specifier.imported?.name ?? "default"),
        source,
        binding: specifier.local,
      });
    }
  }
  return {
    collect,
    program(node) {
      for (const statement of node.body) {
        if (statement.type === "ImportDeclaration") {
          collect(statement);
        }
      }
    },
    resolve(element) {
      const name = nameOf(element);
      const [root, member] = name.split(".");
      const imported = imports.get(root);
      if (!imported) {
        return;
      }
      let scope = context.sourceCode.getScope(element);
      while (scope) {
        const variable = scope.set.get(root);
        if (variable) {
          if (
            !variable.defs.some(
              (definition) => definition.name === imported.binding
            )
          ) {
            return;
          }
          break;
        }
        scope = scope.upper;
      }
      return {
        ...imported,
        imported: imported.imported === "*" ? member : imported.imported,
      };
    },
  };
}
