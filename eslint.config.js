import antfu from "@antfu/eslint-config"

export default antfu({
  unocss: true,
  vue: true,
  ignores: ["**/*.test.{j,t}s", "**/*.spec.{j,t}s", "**/*.d.ts", "**/*.gen.{j,t}s"],
  stylistic: {
    quotes: "double",
  },
}, {
  rules: {
    "node/prefer-global/process": ["off"],
    "no-console": ["warn"],
    "no-var": ["off"],
    "no-restricted-syntax": ["off", "TSEnumDeclaration[const=true]"],
    "unicorn/new-for-builtins": ["off"],
  },
})
