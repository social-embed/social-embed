/**
 * Ambient `*.astro` module shim for the TS7-native `type-check` script
 * (`tsc --noEmit -p tsconfig.typecheck.json`).
 *
 * Why this exists: `astro check` is broken under the TypeScript 7 native
 * compiler because @astrojs/language-server needs the TS programmatic JS
 * API that TS7 does not ship (upstream: TypeScript roadmap#1321, expected
 * ~TS 7.1). Until then, plain `tsc` checks all .ts/.tsx sources, but it
 * cannot resolve imports of `.astro` files (only the Astro language
 * server can virtualize those). This shim types any `.astro` import as a
 * generic Astro component factory so the rest of the graph type-checks.
 *
 * Trade-offs (documented, deliberate):
 * - `.astro` frontmatter and template bodies are UNCHECKED.
 * - Props passed to imported `.astro` components are UNCHECKED
 *   (`AstroComponentFactory` carries no per-component props type).
 *
 * This file lives in `types/`, which is excluded from `tsconfig.json`,
 * so the default project graph that `astro check` sees is unchanged.
 * Only `tsconfig.typecheck.json` includes it. When `astro check` works
 * again, delete this file together with tsconfig.typecheck.json and
 * point the `type-check` script back at `astro check`.
 */
declare module "*.astro" {
  const Component: import("astro/runtime/server/index.js").AstroComponentFactory;
  export default Component;
}
