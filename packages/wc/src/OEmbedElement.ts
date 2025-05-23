/**
 * @license
 * See LICENSE. Copyright 2021- Tony Narlock, license MIT.
 *
 * This component is part of the @social-embed/wc package.
 */

import type { EmbedProvider } from "@social-embed/lib";
import {
  convertUrlToEmbedUrl,
  getDailyMotionEmbedFromId,
  getDailyMotionIdFromUrl,
  getEdPuzzleEmbedUrlFromId,
  getEdPuzzleIdFromUrl,
  getLoomEmbedUrlFromId,
  getLoomIdFromUrl,
  getProviderFromUrl, // returns an object with `.name` or undefined
  getSpotifyEmbedUrlFromIdAndType,
  getSpotifyIdAndTypeFromUrl,
  getVimeoEmbedUrlFromId,
  getVimeoIdFromUrl,
  getWistiaEmbedUrlFromId,
  getWistiaIdFromUrl,
  getYouTubeEmbedUrlFromId,
  getYouTubeIdFromUrl,
  isValidUrl,
} from "@social-embed/lib";
import { LitElement, type TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

/**
 * Represents dimension properties (width, height) as well as their unit-infused variations.
 */
interface Dimensions {
  /**
   * The raw width setting (e.g. "560" or "100%").
   */
  width: string;

  /**
   * The raw height setting (e.g. "315" or "100%").
   */
  height: string;

  /**
   * The width with explicit units (e.g. "560px"), if needed.
   */
  widthWithUnits?: string;

  /**
   * The height with explicit units (e.g. "315px"), if needed.
   */
  heightWithUnits?: string;
}

/**
 * `<o-embed>` is a LitElement-based web component that automatically detects and
 * renders embeddable `<iframe>`s for media URLs, including YouTube, Vimeo, Spotify, etc.
 *
 * @remarks
 * - If the provided `url` is unrecognized, it falls back to a generic `<iframe>` if valid.
 * - If the `url` is syntactically invalid, it displays a short message: "No provider found."
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
   * The URL or ID (if supported) for the embedded media.
   * Commonly points to a YouTube, Vimeo, or other recognized service link.
   */
  @property({ type: String })
  public url!: string;

  /**
   * A pass-through of the `width` attribute for the `<iframe>`.
   *
   * @defaultValue `"560"`
   */
  @property({ type: String })
  public width = "560";

  /**
   * A pass-through of the `height` attribute for the `<iframe>`.
   *
   * @defaultValue `"315"`
   */
  @property({ type: String })
  public height = "315";

  /**
   * A pass-through of the `frameborder` attribute, only used in certain embeds.
   *
   * @defaultValue `"0"`
   */
  @property({ type: String })
  public frameborder = "0";

  /**
   * Controls the "allowfullscreen" attribute on certain iframes (e.g. YouTube).
   * Passing anything other than `1`/`true` causes the attribute to be omitted.
   *
   * @defaultValue `"true"`
   */
  @property({ type: String })
  public allowfullscreen: string | boolean | undefined = "true";

  /**
   * The matched provider object, determined by calling `getProviderFromUrl(this.url)`.
   * If the URL is recognized, this will be an EmbedProvider object.
   *
   * Use @property for reactivity, but do not reflect to attribute.
   * Always set a new object reference for reactivity.
   */
  @property({ type: Object, attribute: false })
  public get provider(): EmbedProvider | undefined {
    return this._provider;
  }
  public set provider(val: EmbedProvider | undefined) {
    if (val !== this._provider) {
      const old = this._provider;
      // Always use a new object reference for reactivity/immutability
      this._provider = val ? { ...val } : undefined;
      this.requestUpdate("provider", old);
      // Force Lit to also treat url as changed if set, to trigger full update
      if (this.url) {
        this.requestUpdate("url", this.url);
      }
    }
  }
  private _provider: EmbedProvider | undefined = undefined;

  /**
   * Creates a `<style>` block that sets width and height for the iframe based on
   * computed defaults. Called within the main `render()` logic.
   *
   * @returns The lit `<style>` template that sets up the container and iframe dimensions.
   */
  public instanceStyle(): TemplateResult {
    const { widthWithUnits, heightWithUnits } = this.getDefaultDimensions(
      this.provider,
    );
    return html`
      <style>
        :host {
          display: block;
          padding: 0;
          border: 0;
        }
        iframe {
          width: var(--social-embed-iframe-width, ${widthWithUnits});
          height: var(--social-embed-iframe-height, ${heightWithUnits});
        }
      </style>
    `;
  }

  /**
   * Main LitElement render cycle method.
   * Rendering is guarded by shouldUpdate to ensure both provider and url are set.
   *
   * @returns A lit template containing the correct `<iframe>` or an error message.
   */
  public render(): TemplateResult {
    let embedResult: TemplateResult;
    if (!this.provider) {
      embedResult = isValidUrl(this.url)
        ? this.renderIframe()
        : html`No provider found for ${this.url}`;
    } else {
      embedResult = this.renderProvider();
    }
    return html`${this.instanceStyle()}${embedResult}`;
  }

  /**
   * Only update/render when both provider and url are set.
   */
  /**
   * Only update/render when url is set. The _changedProperties parameter is required by Lit,
   * but is not used in this implementation.
   *
   * Note: For custom providers, ensure that both provider and url are set before expecting
   * a rendered iframe.
   *
   * Custom Provider Signature Requirement:
   * - getIdFromUrl(url) MUST return a string (not string[]). If multiple matches are possible, return the first.
   * - getEmbedUrlFromId(id) MUST accept a string id as its argument.
   */
  protected shouldUpdate(_changedProperties: Map<string, unknown>): boolean {
    // Always allow the first update to resolve provider from url
    if (typeof this.provider === "undefined" && this.url) {
      this.provider = getProviderFromUrl(this.url);
    }
    // Render whenever url is present (non-empty)
    return !!this.url;
  }

  /**
   * Compute any derived state or handle interdependent logic before rendering.
   * This is where you can react to changes in provider or url.
   */
  protected willUpdate(changedProperties: Map<string, unknown>): void {
    // If url changes and provider is not set, resolve provider
    if (changedProperties.has("url") && typeof this.provider === "undefined") {
      this.provider = getProviderFromUrl(this.url);
    }
    // If provider changes and url is present, you could precompute embedUrl, etc.
    // (For this component, embedUrl is computed in renderProvider)
  }

  /**
   * Default dimension overrides for Spotify content.
   * Will be used if the user hasn't supplied their own `width`/`height`.
   */
  public static spotifyDefaultDimensions: Dimensions = {
    width: "100%",
    widthWithUnits: "100%",
    height: "352",
    heightWithUnits: "352px",
  };

  /**
   * Renders the `<iframe>` for a Spotify resource (track, album, playlist, artist, show, or episode).
   *
   * @returns A lit template containing a Spotify `<iframe>` with the correct dimensions.
   */
  public renderSpotify(): TemplateResult {
    const [spotifyId, spotifyType] = getSpotifyIdAndTypeFromUrl(this.url);
    const url = getSpotifyEmbedUrlFromIdAndType(spotifyId, spotifyType);

    const { width, height } = this.getDefaultDimensions(this.provider);

    return html`
      <iframe
        src="${url}"
        width="${width}"
        frameborder=${ifDefined(
          this.frameborder ? this.frameborder : undefined,
        )}
        height="${height}"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>
      <slot></slot>
    `;
  }

  /**
   * Computes dimension info for a recognized provider, possibly using specialized defaults
   * (e.g. Vimeo default is 640x268, EdPuzzle 470x404, etc.).
   *
   * @param providerObj - The EmbedProvider object, if any.
   * @returns A `Dimensions` object with `width`, `height`, and optional unit-converted fields.
   */
  public getDefaultDimensions(providerObj?: EmbedProvider): Dimensions {
    // First check if the provider has defaultDimensions
    if (providerObj?.defaultDimensions) {
      return this.calculateDefaultDimensions({
        defaults: {
          width: providerObj.defaultDimensions.width,
          height: providerObj.defaultDimensions.height,
          widthWithUnits: providerObj.defaultDimensions.width,
          heightWithUnits: providerObj.defaultDimensions.height,
        },
      });
    }

    // Fall back to built-in defaults based on provider name
    const providerName = providerObj?.name;
    switch (providerName) {
      case "Vimeo":
        return this.calculateDefaultDimensions({
          defaults: OEmbedElement.vimeoDefaultDimensions,
        });
      case "DailyMotion":
        return this.calculateDefaultDimensions();
      case "EdPuzzle":
        return this.calculateDefaultDimensions({
          defaults: OEmbedElement.edPuzzleDefaultDimensions,
        });
      case "Wistia":
        return this.calculateDefaultDimensions({
          defaults: OEmbedElement.wistiaDefaultDimensions,
        });
      case "Loom":
        return this.calculateDefaultDimensions({
          defaults: OEmbedElement.loomDefaultDimensions,
        });
      case "Spotify":
        return this.calculateDefaultDimensions({
          defaults: OEmbedElement.spotifyDefaultDimensions,
        });
      default:
        return this.calculateDefaultDimensions();
    }
  }

  /**
   * A helper that finalizes width & height, adding `px` if no unit is present.
   *
   * @param options - Optional `defaults` object specifying fallback width/height.
   * @returns A new `Dimensions` object with `widthWithUnits` and `heightWithUnits`.
   */
  public calculateDefaultDimensions({
    defaults,
  }: { defaults?: Dimensions } = {}): Dimensions {
    const width = this.getAttribute("width") || defaults?.width || this.width;
    const widthWithUnits = width.match(/(px|%)/) ? width : `${width}px`;
    const height =
      this.getAttribute("height") || defaults?.height || this.height;
    const heightWithUnits = height.match(/(px|%)/) ? height : `${height}px`;

    return { width, widthWithUnits, height, heightWithUnits };
  }

  /**
   * Renders a DailyMotion `<iframe>` using the extracted ID from `getDailyMotionIdFromUrl`.
   * Falls back with a short message if the ID can't be found in the URL.
   *
   * @returns A lit template containing the DailyMotion `<iframe>` or an error message.
   */
  public renderDailyMotion(): TemplateResult {
    const dailyMotionId = getDailyMotionIdFromUrl(this.url);
    if (!dailyMotionId) {
      return html`Could not find dailyMotionId in ${this.url}`;
    }
    const url = getDailyMotionEmbedFromId(dailyMotionId);

    const { width, height } = this.getDefaultDimensions(this.provider);

    return html`
      <iframe
        allow="autoplay"
        width="${width}"
        height="${height}"
        src="${url}"
        frameborder=${ifDefined(this.frameborder)}
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen=${ifDefined(this.shouldAllowFullscreen())}
        type="text/html"
      ></iframe>
      <slot></slot>
    `;
  }

  /**
   * Default dimension overrides for Vimeo content.
   */
  public static vimeoDefaultDimensions: Dimensions = {
    width: "640",
    widthWithUnits: "640px",
    height: "268",
    heightWithUnits: "268px",
  };

  /**
   * Renders a Vimeo `<iframe>` from a recognized Vimeo URL.
   *
   * @returns A lit template containing a Vimeo `<iframe>` or an error message if no ID found.
   */
  public renderVimeo(): TemplateResult {
    const vimeoId = getVimeoIdFromUrl(this.url);
    if (!vimeoId) {
      return html`Could not find vimeoId in ${this.url}`;
    }
    const url = getVimeoEmbedUrlFromId(vimeoId);

    const { width, height } = this.getDefaultDimensions(this.provider);

    return html`
      <iframe
        width="${width}"
        height="${height}"
        src="${url}"
        frameborder=${ifDefined(this.frameborder)}
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen=${ifDefined(this.shouldAllowFullscreen())}
      ></iframe>
      <slot></slot>
    `;
  }

  /**
   * Renders a YouTube `<iframe>` from a recognized YouTube URL.
   * Returns an empty template if no ID can be extracted.
   */
  public renderYouTube(): TemplateResult {
    const youtubeId = getYouTubeIdFromUrl(this.url);
    if (!youtubeId) {
      return html``;
    }
    const youtubeUrl = getYouTubeEmbedUrlFromId(youtubeId);

    const { width, height } = this.getDefaultDimensions(this.provider);

    return html`
      <iframe
        width="${width}"
        height="${height}"
        src="${youtubeUrl}"
        frameborder=${ifDefined(this.frameborder)}
        allowfullscreen=${ifDefined(this.shouldAllowFullscreen())}
      ></iframe>
      <slot></slot>
    `;
  }

  /**
   * Renders a generic `<iframe>` for valid but unrecognized URLs.
   * If the URL is invalid, `render()` won't call this method.
   */
  public renderIframe(): TemplateResult {
    const { width, height } = this.getDefaultDimensions(this.provider);
    return html`
      <iframe
        width="${width}"
        height="${height}"
        src="${this.url}"
        frameborder=${ifDefined(this.frameborder)}
      ></iframe>
      <slot></slot>
    `;
  }

  /**
   * Default dimension overrides for EdPuzzle content.
   */
  public static edPuzzleDefaultDimensions: Dimensions = {
    width: "470",
    widthWithUnits: "470px",
    height: "404",
    heightWithUnits: "404px",
  };

  /**
   * Renders an EdPuzzle `<iframe>` from a recognized EdPuzzle URL.
   * Displays an error message if no ID can be extracted.
   */
  public renderEdPuzzle(): TemplateResult {
    if (!this.url) {
      return html`No url found for embed`;
    }
    const embedId = getEdPuzzleIdFromUrl(this.url);
    if (!embedId) {
      return html`No ID found for ${this.url}`;
    }

    const embedUrl = getEdPuzzleEmbedUrlFromId(embedId);
    const { width, height } = this.getDefaultDimensions(this.provider);

    return html`
      <iframe
        width="${width}"
        height="${height}"
        src="${embedUrl}"
        frameborder=${ifDefined(this.frameborder)}
        allowfullscreen=${ifDefined(this.shouldAllowFullscreen())}
      ></iframe>
      <slot></slot>
    `;
  }

  /**
   * Default dimension overrides for Wistia content.
   */
  public static wistiaDefaultDimensions: Dimensions = {
    width: "470",
    widthWithUnits: "470px",
    height: "404",
    heightWithUnits: "404px",
  };

  /**
   * Renders a Wistia `<iframe>` from a recognized Wistia URL.
   * Displays an error message if no ID can be extracted.
   */
  public renderWistia(): TemplateResult {
    if (!this.url) {
      return html`No url found for embed`;
    }
    const embedId = getWistiaIdFromUrl(this.url);
    if (!embedId) {
      return html`No ID found for ${this.url}`;
    }

    const embedUrl = getWistiaEmbedUrlFromId(embedId);
    const { width, height } = this.getDefaultDimensions(this.provider);

    return html`
      <iframe
        width="${width}"
        height="${height}"
        src="${embedUrl}"
        frameborder=${ifDefined(this.frameborder)}
        allowfullscreen=${ifDefined(this.shouldAllowFullscreen())}
      ></iframe>
      <slot></slot>
    `;
  }

  /**
   * Default dimension overrides for Loom content.
   */
  public static loomDefaultDimensions: Dimensions = {
    width: "470",
    widthWithUnits: "470px",
    height: "404",
    heightWithUnits: "404px",
  };

  /**
   * Renders a Loom `<iframe>` from a recognized Loom URL.
   * Displays an error message if no ID can be extracted.
   */
  public renderLoom(): TemplateResult {
    if (!this.url) {
      return html`No url found for embed`;
    }
    const embedId = getLoomIdFromUrl(this.url);
    if (!embedId) {
      return html`No ID found for ${this.url}`;
    }

    const embedUrl = getLoomEmbedUrlFromId(embedId);
    const { width, height } = this.getDefaultDimensions(this.provider);

    return html`
      <iframe
        width="${width}"
        height="${height}"
        src="${embedUrl}"
        frameborder=${ifDefined(this.frameborder)}
        allowfullscreen=${ifDefined(this.shouldAllowFullscreen())}
      ></iframe>
      <slot></slot>
    `;
  }

  /**
   * Renders a provider using the generic approach.
   * This method is used for all providers, including custom ones.
   *
   * @returns A lit template containing the appropriate iframe for the provider.
   */
  public renderProvider(): TemplateResult {
    if (!this.provider || !this.url) {
      return html`No provider or URL found`;
    }

    // First try to use the built-in render methods for known providers
    switch (this.provider.name) {
      case "YouTube":
        return this.renderYouTube();
      case "Spotify":
        return this.renderSpotify();
      case "Vimeo":
        return this.renderVimeo();
      case "DailyMotion":
        return this.renderDailyMotion();
      case "EdPuzzle":
        return this.renderEdPuzzle();
      case "Wistia":
        return this.renderWistia();
      case "Loom":
        return this.renderLoom();
    }

    // For custom providers, use their embed logic if available
    let embedUrl: string | undefined;
    if (this.provider.getIdFromUrl && this.provider.getEmbedUrlFromId) {
      let id = this.provider.getIdFromUrl(this.url);
      // If a provider returns a string[], use the first element and warn
      if (Array.isArray(id)) {
        console.warn(
          "Custom provider getIdFromUrl returned an array; using the first element.",
          id,
        );
        id = id[0];
      }
      if (!id) {
        return html`Could not extract ID for ${this.url}`;
      }
      embedUrl = this.provider.getEmbedUrlFromId(id);
    } else {
      embedUrl = convertUrlToEmbedUrl(this.url);
    }
    if (!embedUrl) {
      return html`Could not generate embed URL for ${this.url}`;
    }

    // Get dimensions directly from the provider or use defaults
    const width = this.provider.defaultDimensions?.width || this.width;
    const height = this.provider.defaultDimensions?.height || this.height;

    // Get additional iframe attributes from the provider
    const iframeAttributes = this.provider.iframeAttributes || {};

    // Handle boolean attributes and regular attributes separately
    const booleanAttrs: Record<string, boolean> = {};
    const regularAttrs: Record<string, string> = {};

    // Process each attribute
    for (const [key, value] of Object.entries(iframeAttributes)) {
      // Check if it's a boolean attribute (value is true/false)
      if (typeof value === "boolean") {
        booleanAttrs[key] = value;
      } else {
        // It's a regular attribute
        regularAttrs[key] = String(value);
      }
    }

    // Create a template with all attributes explicitly set
    return html`
      <iframe
        width="${width}"
        height="${height}"
        src="${embedUrl}"
        frameborder=${ifDefined(this.frameborder)}
        allowfullscreen=${ifDefined(this.shouldAllowFullscreen())}
        ?allowtransparency=${regularAttrs.allowtransparency === "true"}
        allow=${ifDefined(regularAttrs.allow)}
        loading=${ifDefined(regularAttrs.loading)}
        title=${ifDefined(regularAttrs.title)}
      ></iframe>
      <slot></slot>
    `;
  }

  /**
   * Helper function to decide if `allowfullscreen="true"` should be set.
   *
   * @returns `true` if the user supplied `allowfullscreen` as `""`, `"true"`, `true`, or `"1"`;
   * otherwise `undefined`.
   */
  private shouldAllowFullscreen(): true | undefined {
    return this.allowfullscreen === "" ||
      this.allowfullscreen === "true" ||
      this.allowfullscreen === true ||
      this.allowfullscreen === "1"
      ? true
      : undefined;
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
