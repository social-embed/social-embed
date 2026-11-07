// stylelint-config-tailwindcss allows the Tailwind v4 at-rules (@theme,
// @utility, @custom-variant, @plugin, @source, @reference, @variant) plus
// @apply/@layer and theme(). It must come after standard so it overrides
// standard's at-rule-no-unknown / function-no-unknown.
/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard", "stylelint-config-tailwindcss"],
  ignoreFiles: [
    "**/node_modules/**",
    "**/dist/**",
    "**/.astro/**",
    "**/public/**",
    "**/docs/**",
  ],
  rules: {
    // Tailwind v4 emits and documents oklch(0.7 0.1 30 / 0.5): plain numbers.
    // Keep the notation consistent rather than forcing %/deg.
    "lightness-notation": "number",
    "alpha-value-notation": "number",
    "hue-degree-notation": "number",
    // `@apply cursor-pointer` has a utility-name prelude, not a CSS grammar.
    "at-rule-prelude-no-invalid": [true, { ignoreAtRules: ["apply"] }],
    // Keep grid-template-areas/rows/columns as separate declarations; the
    // one-line shorthand is harder to read.
    "declaration-block-no-redundant-longhand-properties": [
      true,
      { ignoreShorthands: ["grid-template"] },
    ],
    // BEM-style `--modifier` suffixes are allowed.
    "selector-class-pattern": [
      "^[a-z][a-z0-9]*(?:-{1,2}[a-z0-9]+)*$",
      {
        message: (name) =>
          `Expected class selector ".${name}" to be kebab-case with optional "--modifier"`,
      },
    ],
  },
};
