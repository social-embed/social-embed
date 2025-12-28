import type { EmbedOutput, ScriptRequest } from "../output";
import { renderOutput } from "../registry";

/**
 * Options for mounting an embed to the DOM.
 */
export interface MountOptions {
  /**
   * Container element or CSS selector.
   * If a string, will be passed to document.querySelector().
   */
  container: HTMLElement | string;

  /**
   * How to insert the embed content.
   * - "replace": Replace container contents (default)
   * - "append": Append to existing contents
   */
  mode?: "replace" | "append";

  /**
   * Script loading options.
   */
  scripts?: {
    /**
     * Skip scripts that have already been loaded.
     * Uses the script's dedupeKey for tracking.
     * @default true
     */
    dedupe?: boolean;

    /**
     * Callback when all scripts have finished loading.
     */
    onLoad?: () => void;
  };
}

/**
 * Track loaded scripts by dedupeKey for deduplication.
 */
const loadedScripts = new Set<string>();

/**
 * Mount an EmbedOutput to the DOM.
 *
 * @param output - The EmbedOutput to mount
 * @param options - Mount options
 * @returns Promise that resolves when mounting is complete
 *
 * @remarks
 * This function is browser-only and will throw if called in Node.js.
 *
 * Unlike `renderOutput()` which returns HTML strings, `mount()` properly
 * handles script loading for embeds that require JavaScript execution
 * (future: Twitter, Instagram).
 *
 * For iframe-only embeds (YouTube, Vimeo, etc.), using `renderOutput()`
 * with innerHTML is sufficient. `mount()` is primarily useful for
 * script-hydrated embeds.
 *
 * @example
 * ```typescript
 * import { MatcherRegistry } from "@social-embed/lib";
 * import { mount } from "@social-embed/lib/browser";
 *
 * const registry = MatcherRegistry.withDefaults();
 * const output = registry.toOutput("https://youtu.be/abc123");
 *
 * await mount(output, { container: "#embed" });
 * ```
 */
export async function mount(
  output: EmbedOutput | undefined,
  options: MountOptions,
): Promise<void> {
  if (!output) return;

  // Check for browser environment
  if (typeof document === "undefined") {
    throw new Error("mount() requires a browser environment with DOM access");
  }

  // Resolve container
  const container = resolveContainer(options.container);
  if (!container) {
    throw new Error(`Container not found: ${options.container}`);
  }

  // Render HTML content
  const html = renderOutput(output);

  // Insert into container
  if (options.mode === "append") {
    container.insertAdjacentHTML("beforeend", html);
  } else {
    container.innerHTML = html;
  }

  // Load scripts if present
  if (output.scripts && output.scripts.length > 0) {
    await loadScripts(output.scripts, options.scripts);
  }
}

/**
 * Resolve a container element from an element or selector.
 */
function resolveContainer(container: HTMLElement | string): HTMLElement | null {
  if (typeof container === "string") {
    return document.querySelector(container);
  }
  return container;
}

/**
 * Load scripts with deduplication.
 */
async function loadScripts(
  scripts: ScriptRequest[],
  options?: MountOptions["scripts"],
): Promise<void> {
  const dedupe = options?.dedupe ?? true;
  const onLoad = options?.onLoad;

  const promises: Promise<void>[] = [];

  for (const script of scripts) {
    // Skip if already loaded (by dedupeKey)
    if (dedupe && script.dedupeKey && loadedScripts.has(script.dedupeKey)) {
      continue;
    }

    // Mark as loading
    if (script.dedupeKey) {
      loadedScripts.add(script.dedupeKey);
    }

    promises.push(loadScript(script));
  }

  await Promise.all(promises);

  if (onLoad) {
    onLoad();
  }
}

/**
 * Load a single script.
 */
function loadScript(script: ScriptRequest): Promise<void> {
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = script.src;

    if (script.async !== false) {
      el.async = true;
    }

    if (script.defer) {
      el.defer = true;
    }

    el.onload = () => resolve();
    el.onerror = () =>
      reject(new Error(`Failed to load script: ${script.src}`));

    document.head.appendChild(el);
  });
}

/**
 * Clear the loaded scripts cache.
 * Useful for testing or resetting state.
 */
export function clearScriptCache(): void {
  loadedScripts.clear();
}
