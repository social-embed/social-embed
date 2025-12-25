/**
 * @license
 * See LICENSE. Copyright 2021- Tony Narlock, license MIT.
 *
 * This component is part of the @social-embed/wc package.
 */

import {
  MatcherRegistry,
  type OutputOptions,
  renderOutput,
  type SpotifyOutputOptions,
  type SpotifySize,
  type SpotifyTheme,
  type SpotifyView,
} from "@social-embed/lib";
import { html, LitElement, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

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
@customElement("o-embed")
export class OEmbedElement extends LitElement {
  /**
   * The URL for the embedded media.
   * Commonly points to a YouTube, Vimeo, Spotify, or other recognized service link.
   */
  @property({ type: String })
  public url = "";

  /**
   * Width for the iframe. Can be a number (pixels) or string (e.g., "100%").
   * @defaultValue `"560"`
   */
  @property({ type: String })
  public width: string | number = "560";

  /**
   * Height for the iframe. Can be a number (pixels) or string (e.g., "100%").
   * @defaultValue `"315"`
   */
  @property({ type: String })
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
  @property({ type: Boolean })
  public allowfullscreen = true;

  /**
   * Enable privacy-enhanced mode (e.g., YouTube uses youtube-nocookie.com).
   * @defaultValue `true`
   */
  @property({ type: Boolean })
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
  @property({ type: String, attribute: "spotify-size" })
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
  @property({ type: String, attribute: "spotify-theme" })
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
  @property({ type: String, attribute: "spotify-view" })
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
  @property({ type: Number, attribute: "spotify-start" })
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
  @property({
    type: String,
    attribute: "provider-options",
    converter: {
      fromAttribute(value: string | null): Record<string, unknown> | undefined {
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
  })
  public providerOptions?: Record<string, unknown>;

  /**
   * The matched provider name, available after matching.
   */
  @state()
  private providerName: string | undefined;

  /**
   * Registry instance for URL matching.
   * Can be replaced with a custom registry for testing or custom matchers.
   */
  public registry: MatcherRegistry = MatcherRegistry.withDefaults();

  /**
   * Main LitElement render cycle method.
   * Uses MatcherRegistry to match the URL and generate embed output.
   */
  public render(): TemplateResult {
    // Return early if no URL
    if (!this.url) {
      return html``;
    }

    const result = this.registry.match(this.url);

    if (!result.ok) {
      this.providerName = undefined;
      return html`No provider found for ${this.url}`;
    }

    this.providerName = result.matcher.name;

    // Build base output options
    const options: OutputOptions &
      SpotifyOutputOptions &
      Record<string, unknown> = {
      attributes: this.allowfullscreen ? { allowfullscreen: "" } : {},
      privacy: this.privacy,
      width: this.width,
      ...this.providerOptions, // Escape hatch
    };

    // Add Spotify-specific options when provider is Spotify
    if (this.providerName === "Spotify") {
      if (this.spotifySize) options.size = this.spotifySize;
      if (this.spotifyTheme) options.theme = this.spotifyTheme;
      if (this.spotifyView) options.view = this.spotifyView;
      if (this.spotifyStart !== undefined) options.start = this.spotifyStart;

      // Only pass height if explicitly set (not default "315")
      // When spotifySize is set, let the lib calculate the height
      if (!this.spotifySize || this.height !== "315") {
        options.height = this.height;
      }
    } else {
      // For non-Spotify providers, always pass height
      options.height = this.height;
    }

    const output = result.matcher.toOutput(result.data, options);

    const embedHtml = renderOutput(output);

    return html`
      ${this.instanceStyle()}
      ${unsafeHTML(embedHtml)}
      <slot></slot>
    `;
  }

  /**
   * Creates a `<style>` block for the component.
   */
  private instanceStyle(): TemplateResult {
    const widthStyle =
      typeof this.width === "number" ? `${this.width}px` : this.width;
    const heightStyle =
      typeof this.height === "number" ? `${this.height}px` : this.height;

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
