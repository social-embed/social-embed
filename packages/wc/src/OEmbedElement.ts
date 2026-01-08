/**
 * @license
 * See LICENSE. Copyright 2021- Tony Narlock, license MIT.
 *
 * This component is part of the @social-embed/wc package.
 */

import {
  defaultStore,
  getSpotifyHeight,
  isYouTubeShortsUrl,
  type MatcherRegistry,
  type OutputOptions,
  type RegistryStore,
  renderOutput,
  type SpotifyData,
  type SpotifyOutputOptions,
  type SpotifySize,
  type SpotifyTheme,
  type SpotifyView,
  type Unsubscribe,
  YOUTUBE_SHORTS_DIMENSIONS,
} from "@social-embed/lib";
import { html, LitElement, type TemplateResult } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

/**
 * Default store for reactive matcher updates.
 *
 * @remarks
 * This is a module-level singleton that all `<o-embed>` elements subscribe to.
 * When `defaultStore.register()` is called, all components re-render.
 *
 * Re-exported from `@social-embed/lib` to ensure a single shared singleton.
 */
export { defaultStore };

/**
 * `<o-embed>` is a LitElement-based web component that automatically detects and
 * renders embeddable `<iframe>`s for media URLs, including YouTube, Vimeo, Spotify, etc.
 *
 * @remarks
 * - Uses `MatcherRegistry` from `@social-embed/lib` for URL matching
 * - If the URL is unrecognized, displays "No provider found"
 * - Supports privacy-enhanced mode (default: enabled)
 *
 * @slot - Optional slot for passing child content (rendered after the iframe).
 *
 * @example
 * ```html
 * <o-embed url="https://youtu.be/FTQbiNvZqaY"></o-embed>
 * ```
 */
export class OEmbedElement extends LitElement {
  /**
   * Reactive properties for the component.
   * Using static properties instead of decorators for CDN compatibility.
   */
  static properties = {
    allowfullscreen: { type: Boolean },
    height: { type: String },
    privacy: { type: Boolean },
    providerOptions: {
      attribute: "provider-options",
      converter: {
        fromAttribute(
          value: string | null,
        ): Record<string, unknown> | undefined {
          if (!value) return undefined;
          try {
            return JSON.parse(value) as Record<string, unknown>;
          } catch {
            return undefined;
          }
        },
        toAttribute(value: Record<string, unknown> | undefined): string | null {
          return value ? JSON.stringify(value) : null;
        },
      },
      type: String,
    },
    spotifySize: { attribute: "spotify-size", type: String },
    spotifyStart: { attribute: "spotify-start", type: Number },
    spotifyTheme: { attribute: "spotify-theme", type: String },
    spotifyView: { attribute: "spotify-view", type: String },
    url: { type: String },
    width: { type: String },
  };

  /**
   * The URL for the embedded media.
   * Commonly points to a YouTube, Vimeo, Spotify, or other recognized service link.
   */
  public url = "";

  /**
   * Width for the iframe. Can be a number (pixels) or string (e.g., "100%").
   * @defaultValue `"560"`
   */
  public width: string | number = "560";

  /**
   * Height for the iframe. Can be a number (pixels) or string (e.g., "100%").
   * @defaultValue `"315"`
   */
  public height: string | number = "315";

  /**
   * Controls the "allowfullscreen" attribute on iframes.
   *
   * @remarks
   * Uses Lit's `type: Boolean` which handles standard HTML attribute patterns:
   * - `<o-embed allowfullscreen>` → true
   * - `<o-embed allowfullscreen="true">` → true
   * - `<o-embed allowfullscreen="1">` → true (truthy string)
   *
   * **Known regression from v1**: The explicit empty string `allowfullscreen=""`
   * now coerces to `false` instead of `true`. This edge case is unlikely in
   * practice since the standard HTML pattern uses presence, not empty string.
   *
   * @defaultValue `true`
   */
  public allowfullscreen = true;

  /**
   * Enable privacy-enhanced mode (e.g., YouTube uses youtube-nocookie.com).
   * @defaultValue `true`
   */
  public privacy = true;

  // ─────────────────────────────────────────────────────────────────────────────
  // Spotify-specific attributes
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Spotify embed size tier.
   *
   * @remarks
   * Controls the height of the Spotify embed player:
   * - `"compact"`: Minimal player (80px for tracks, 152px for others)
   * - `"normal"`: Standard player (default, 152-352px based on content type)
   * - `"large"`: Full-featured player with more details (352-500px)
   *
   * If not specified, the size is auto-detected based on content type
   * (e.g., tracks default to "compact", albums to "normal").
   *
   * Only applies to Spotify URLs; ignored for other providers.
   *
   * @example
   * ```html
   * <o-embed url="spotify:track:..." spotify-size="large"></o-embed>
   * ```
   */
  public spotifySize?: SpotifySize;

  /**
   * Spotify embed theme.
   *
   * @remarks
   * Controls the visual theme of the Spotify embed:
   * - `"dark"`: Dark background (maps to `theme=0`)
   * - `"light"`: Light background (maps to `theme=1`)
   *
   * If not specified, uses Spotify's default (usually dark).
   * Only applies to Spotify URLs; ignored for other providers.
   *
   * @example
   * ```html
   * <o-embed url="spotify:album:..." spotify-theme="light"></o-embed>
   * ```
   */
  public spotifyTheme?: SpotifyTheme;

  /**
   * Spotify embed view mode.
   *
   * @remarks
   * Controls the display mode:
   * - `"list"`: Standard view with track listings (default)
   * - `"coverart"`: Minimal view emphasizing album/track artwork
   *
   * Only applies to Spotify URLs; ignored for other providers.
   *
   * @example
   * ```html
   * <o-embed url="spotify:album:..." spotify-view="coverart"></o-embed>
   * ```
   */
  public spotifyView?: SpotifyView;

  /**
   * Spotify podcast start time in seconds.
   *
   * @remarks
   * Sets the start position for podcast playback.
   * Only works with podcast content (shows and episodes).
   * Ignored for other content types (tracks, albums, etc.)
   *
   * Only applies to Spotify URLs; ignored for other providers.
   *
   * @example
   * ```html
   * <o-embed url="spotify:episode:..." spotify-start="120"></o-embed>
   * ```
   */
  public spotifyStart?: number;

  // ─────────────────────────────────────────────────────────────────────────────
  // Escape hatch
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Provider-specific options as a JSON object.
   *
   * @remarks
   * Escape hatch for passing arbitrary options to the matcher's toOutput method.
   * Useful for future Spotify parameters or other provider-specific options.
   *
   * @example
   * ```html
   * <o-embed
   *   url="spotify:album:..."
   *   provider-options='{"utm_source": "my-site"}'
   * ></o-embed>
   * ```
   */
  public providerOptions?: Record<string, unknown>;

  /**
   * The matched provider name, available after matching.
   * Internal state - not a reactive property.
   */
  private providerName: string | undefined;

  /**
   * Store instance for URL matching.
   * Defaults to the module-level `defaultStore`.
   * Can be replaced with a custom store for testing or isolation.
   */
  public store: RegistryStore = defaultStore;

  /**
   * @deprecated Use `store.current` instead.
   * Registry instance for URL matching (legacy compatibility).
   */
  public get registry(): MatcherRegistry {
    return this.store.current;
  }

  /**
   * @deprecated Use `store` property instead.
   */
  public set registry(value: MatcherRegistry) {
    this.store.setRegistry(value);
  }

  /**
   * Unsubscribe function for store subscription.
   */
  private storeUnsubscribe?: Unsubscribe;

  /**
   * LitElement lifecycle: called when element is added to DOM.
   * Subscribes to the store for reactive updates.
   */
  override connectedCallback(): void {
    super.connectedCallback();

    // Subscribe to store changes
    this.storeUnsubscribe = this.store.subscribe(() => {
      this.requestUpdate();
    });
  }

  /**
   * LitElement lifecycle: called when element is removed from DOM.
   * Cleans up store subscription.
   */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    // Unsubscribe from store
    if (this.storeUnsubscribe) {
      this.storeUnsubscribe();
      this.storeUnsubscribe = undefined;
    }
  }

  /**
   * Force re-render (useful after late matcher registration).
   *
   * @remarks
   * Normally not needed since the component subscribes to store changes.
   * Use this if you have a custom store or need manual control.
   */
  public refresh(): void {
    this.requestUpdate();
  }

  /**
   * Collect `data-opt-*` attributes as provider options.
   *
   * @remarks
   * Provides a universal escape hatch for provider-specific options.
   * Attributes are converted from kebab-case to camelCase.
   *
   * @example
   * ```html
   * <o-embed url="..." data-opt-start="120" data-opt-hide-top-bar="true"></o-embed>
   * ```
   *
   * @returns Object with camelCase keys and string values
   */
  private getDataOptAttributes(): Record<string, unknown> {
    const opts: Record<string, unknown> = {};

    for (const attr of Array.from(this.attributes)) {
      if (attr.name.startsWith("data-opt-")) {
        // Convert data-opt-hide-top-bar -> hideTopBar
        const key = attr.name
          .slice(9) // Remove "data-opt-"
          .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

        // Parse value: try boolean, number, or keep as string
        const value = attr.value;
        if (value === "true") {
          opts[key] = true;
        } else if (value === "false") {
          opts[key] = false;
        } else if (/^-?\d+(?:\.\d+)?$/.test(value)) {
          opts[key] = Number(value);
        } else {
          opts[key] = value;
        }
      }
    }

    return opts;
  }

  /**
   * Main LitElement render cycle method.
   * Uses MatcherRegistry to match the URL and generate embed output.
   */
  public render(): TemplateResult {
    // Return early if no URL
    if (!this.url) {
      return html``;
    }

    const result = this.store.match(this.url);

    if (!result.ok) {
      this.providerName = undefined;
      return html`No provider found for ${this.url}`;
    }

    this.providerName = result.matcher.name;

    // Collect data-opt-* attributes for provider options
    const dataOptAttrs = this.getDataOptAttributes();

    // Build base output options (width/height added conditionally below)
    const options: OutputOptions &
      SpotifyOutputOptions &
      Record<string, unknown> = {
      attributes: this.allowfullscreen ? { allowfullscreen: "" } : {},
      privacy: this.privacy,
      ...dataOptAttrs, // data-opt-* attributes (lower priority)
      ...this.providerOptions, // Escape hatch (higher priority)
    };

    // Track the effective dimensions for CSS styling
    let effectiveWidth: string | number = this.width;
    let effectiveHeight: string | number = this.height;

    // Add Spotify-specific options when provider is Spotify
    if (this.providerName === "Spotify") {
      options.width = this.width; // Spotify always uses user's width
      if (this.spotifySize) options.size = this.spotifySize;
      if (this.spotifyTheme) options.theme = this.spotifyTheme;
      if (this.spotifyView) options.view = this.spotifyView;
      if (this.spotifyStart !== undefined) options.start = this.spotifyStart;

      const data = result.data as SpotifyData;

      // Calculate effective height for CSS styling
      if (this.height !== "315") {
        // User explicitly set height - use it
        effectiveHeight = this.height;
        options.height = this.height;
      } else if (this.spotifySize || this.spotifyView) {
        // Use calculated height from lib based on size/view
        effectiveHeight = getSpotifyHeight(data.contentType, this.spotifySize, {
          video: data.video,
          view: this.spotifyView,
        });
        // Don't pass height to options - let lib calculate it
      } else {
        // Auto-detect: let lib calculate, but also get height for CSS
        effectiveHeight = getSpotifyHeight(data.contentType, undefined, {
          video: data.video,
        });
      }
    } else if (
      this.providerName === "YouTube" &&
      isYouTubeShortsUrl(this.url)
    ) {
      // YouTube Shorts: use portrait dimensions (9:16) unless user explicitly set them
      const userSetWidth = this.getAttribute("width") !== null;
      const userSetHeight = this.getAttribute("height") !== null;

      if (userSetWidth || userSetHeight) {
        // User explicitly set at least one dimension - use their values
        options.width = this.width;
        options.height = this.height;
      } else {
        // Use Shorts portrait dimensions (matcher handles the actual values)
        effectiveWidth = YOUTUBE_SHORTS_DIMENSIONS.width;
        effectiveHeight = YOUTUBE_SHORTS_DIMENSIONS.height;
      }
    } else {
      // For non-Spotify, non-Shorts providers, always pass width/height
      options.width = this.width;
      options.height = this.height;
    }

    const output = result.matcher.toOutput(result.data, options);

    const embedHtml = renderOutput(output);

    return html`
      ${this.instanceStyle(effectiveWidth, effectiveHeight)}
      ${unsafeHTML(embedHtml)}
      <slot></slot>
    `;
  }

  /**
   * Creates a `<style>` block for the component.
   *
   * @param width - The effective width to use (may differ from this.width for Shorts)
   * @param height - The effective height to use (may differ from this.height for Spotify/Shorts)
   */
  private instanceStyle(
    width: string | number = this.width,
    height: string | number = this.height,
  ): TemplateResult {
    // Ensure dimensions have units - numeric values and numeric strings need "px"
    const formatDimension = (value: string | number): string => {
      if (typeof value === "number") return `${value}px`;
      // If string is purely numeric, add px
      if (/^\d+$/.test(value)) return `${value}px`;
      return value;
    };

    const widthStyle = formatDimension(width);
    const heightStyle = formatDimension(height);

    return html`
      <style>
        :host {
          display: block;
          padding: 0;
          border: 0;
        }
        iframe {
          width: var(--social-embed-iframe-width, ${widthStyle});
          height: var(--social-embed-iframe-height, ${heightStyle});
        }
      </style>
    `;
  }

  /**
   * Get the matched provider name (for testing/introspection).
   */
  public get provider(): { name: string } | undefined {
    return this.providerName ? { name: this.providerName } : undefined;
  }
}

// Register the custom element (decorator-free for CDN compatibility)
customElements.define("o-embed", OEmbedElement);

declare global {
  interface HTMLElementTagNameMap {
    /** Provides recognition in TS for the <o-embed> element. */
    "o-embed": OEmbedElement;
  }

  // If you're using JSX/TSX, include a declaration for the custom element:
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "o-embed": Partial<OEmbedElement>;
    }
  }
}
