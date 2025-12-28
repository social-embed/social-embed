/**
 * Browser-only utilities for DOM execution.
 *
 * @remarks
 * This module is for browser environments only.
 * It will throw if used in Node.js or other non-browser runtimes.
 *
 * For SSR, use `renderOutput()` from the main module instead.
 *
 * @example
 * ```typescript
 * import { MatcherRegistry } from "@social-embed/lib";
 * import { mount } from "@social-embed/lib/browser";
 *
 * const registry = MatcherRegistry.withDefaults();
 * const output = registry.toOutput("https://youtu.be/abc123");
 *
 * // Mount to DOM (handles script loading for script-hydrated embeds)
 * await mount(output, { container: "#embed" });
 * ```
 */

export { clearScriptCache, type MountOptions, mount } from "./mount";
