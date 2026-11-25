// Keep this rule independent of app lint so vendored UI follows the icon policy.
const otherLibraries =
  /^(lucide-react|lucide|@tabler\/icons-react|@hugeicons\/|@phosphor-icons\/|@remixicon\/|@radix-ui\/react-icons|@heroicons\/|react-icons)/u;
const glyph =
  /^@solar-icons\/react\/(?:linear|bold|bold-duotone|broken|line-duotone|outline)\/[^/]+$/u;

export default {
  meta: { name: "parks-icons" },
  rules: {
    "solar-imports": {
      meta: { type: "problem", schema: [] },
      create(context) {
        function check(node) {
          const source = node.source;
          const target =
            source?.type === "TemplateLiteral" &&
            source.expressions.length === 0
              ? source.quasis[0]?.value.cooked
              : source?.value;
          if (typeof target !== "string") {
            return;
          }
          if (otherLibraries.test(target)) {
            context.report({
              node: source,
              message: "Use a Solar glyph import for UI icons.",
            });
          } else if (
            target.startsWith("@solar-icons/react") &&
            !glyph.test(target)
          ) {
            context.report({
              node: source,
              message:
                "Import one Solar glyph from @solar-icons/react/<style>/<glyph>.",
            });
          }
        }
        return {
          ImportDeclaration: check,
          ImportExpression: check,
          TSImportType: check,
          ExportNamedDeclaration: check,
          ExportAllDeclaration: check,
        };
      },
    },
  },
};
