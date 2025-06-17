/**
 * @license
 * See LICENSE. Copyright 2021- Tony Narlock, license MIT.
 *
 * This component is part of the @social-embed/wc package.
 */

import {
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
import { html, LitElement, type TemplateResult } from "lit";
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
   * If the URL is recognized, `.name` will be a string like `"YouTube"`.
   */
  public provider:
    | {
        /** The recognized provider name (e.g., "YouTube", "Vimeo", "Spotify"). */
        name: string;
      }
    | undefined;

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
   * 1. Determines `provider` via `getProviderFromUrl(this.url)`.
   * 2. Chooses a specialized rendering function or fallback logic.
   *
   * @returns A lit template containing the correct `<iframe>` or an error message.
   */
  public render(): TemplateResult {
    this.provider = getProviderFromUrl(this.url);

    // Return early if no URL was provided at all
    if (!this.url || this.url === "") {
      return html``;
    }

    let embedResult: TemplateResult;

    // If no recognized provider, fallback to a generic iframe or error message
    if (!this.provider) {
      embedResult = isValidUrl(this.url)
        ? this.renderIframe() // fallback if the URL is syntactically valid
        : html`No provider found for ${this.url}`;
    } else {
      // Switch on provider.name to call the appropriate embed rendering method
      switch (this.provider.name) {
        case "YouTube":
          embedResult = this.renderYouTube();
          break;
        case "Spotify":
          embedResult = this.renderSpotify();
          break;
        case "Vimeo":
          embedResult = this.renderVimeo();
          break;
        case "DailyMotion":
          embedResult = this.renderDailyMotion();
          break;
        case "EdPuzzle":
          embedResult = this.renderEdPuzzle();
          break;
        case "Wistia":
          embedResult = this.renderWistia();
          break;
        case "Loom":
          embedResult = this.renderLoom();
          break;
        default:
          embedResult = isValidUrl(this.url)
            ? this.renderIframe()
            : html`No provider found for ${this.url}`;
          break;
      }
    }

    return html`${this.instanceStyle()}${embedResult}`;
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

    return html`
      <iframe
        src="${url}"
        width="${this.width}"
        frameborder=${ifDefined(
          this.frameborder ? this.frameborder : undefined,
        )}
        height="${this.height}"
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
   * @param providerObj - The object with `.name` for the matched provider, if any.
   * @returns A `Dimensions` object with `width`, `height`, and optional unit-converted fields.
   */
  public getDefaultDimensions(providerObj?: { name?: string }): Dimensions {
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
  }: {
    defaults?: Dimensions;
  } = {}): Dimensions {
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

    return html`
      <iframe
        width="${this.width}"
        height="${this.height}"
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
