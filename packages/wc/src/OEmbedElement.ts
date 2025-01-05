/**
 * @license See LICENSE, Copyright 2021- Tony Narlock, license MIT.
 */
import { LitElement, type TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import {
  getDailyMotionEmbedFromId,
  getDailyMotionIdFromUrl,
  getEdPuzzleEmbedUrlFromId,
  getEdPuzzleIdFromUrl,
  getLoomEmbedUrlFromId,
  getLoomIdFromUrl,
  getProviderFromUrl, // returns an object with .name or undefined
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

/**
 * An interface for dimension properties in the embed.
 */
interface Dimensions {
  width: string;
  height: string;
  widthWithUnits?: string;
  heightWithUnits?: string;
}

/**
 * Renders embeds from `<o-embed url="">` tags
 *
 * @slot - Directly pass through child contents to bottom of embed, optional.
 */
@customElement("o-embed")
export class OEmbedElement extends LitElement {
  /**
   * The URL or ID (if supported)
   */
  @property({ type: String }) url!: string;

  /**
   * Pass-through of width attribute
   */
  @property({ type: String }) width = "560";

  /**
   * Pass-through of height attribute
   */
  @property({ type: String }) height = "315";

  /**
   * Pass-through of frameborder attribute, only used in iframe embeds.
   */
  @property({ type: String }) frameborder = "0";

  /**
   * For YouTube only. Passing anything other than 1/true omits the tag.
   */
  @property({ type: String }) allowfullscreen: string | boolean | undefined =
    "true";

  /**
   * Holds the matched provider object returned by `getProviderFromUrl`.
   * e.g. an object with `.name === "YouTube"`.
   */
  provider:
    | {
        /** e.g. "YouTube", "Vimeo", "Spotify", etc. */
        name: string;
      }
    | undefined;

  /**
   * Returns a small `<style>` block for the default dimensions.
   * We read them via `this.getDefaultDimensions()`.
   */
  instanceStyle(): TemplateResult {
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
   * The main render logic.
   * - Finds the provider from the URL.
   * - Switches on provider.name if recognized, else fallback.
   */
  render(): TemplateResult {
    this.provider = getProviderFromUrl(this.url);

    if (!this.url || this.url === "") {
      return html``;
    }

    let embedResult: TemplateResult;

    if (!this.provider) {
      // If no recognized provider, fallback to an iframe if it’s a valid URL
      embedResult = isValidUrl(this.url)
        ? this.renderIframe()
        : html`No provider found for ${this.url}`;
    } else {
      // Switch on provider.name (a string)
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
   * Default dimension used by Spotify if not overridden by attributes.
   */
  static spotifyDefaultDimensions: Dimensions = {
    height: "352",
    heightWithUnits: "352px",
  };

  /**
   * Renders a Spotify embed `<iframe>`.
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
   * Returns dimension info (width, height) depending on the recognized provider.
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
   * Figures out the final width/height strings, adding 'px' if no unit present.
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
   * Renders a DailyMotion embed `<iframe>`.
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
        frameborder=${ifDefined(
          this.frameborder ? this.frameborder : undefined,
        )}
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen=${ifDefined(this.shouldAllowFullscreen())}
        type="text/html"
      ></iframe>
      <slot></slot>
    `;
  }

  /**
   * Default dimensions for Vimeo
   */
  static vimeoDefaultDimensions: Dimensions = {
    width: "640",
    widthWithUnits: "640px",
    height: "268",
    heightWithUnits: "268px",
  };

  /**
   * Renders a Vimeo embed `<iframe>`.
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
        frameborder=${ifDefined(
          this.frameborder ? this.frameborder : undefined,
        )}
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen=${ifDefined(this.shouldAllowFullscreen())}
      ></iframe>
      <slot></slot>
    `;
  }

  /**
   * Renders a YouTube embed `<iframe>`.
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
        frameborder=${ifDefined(
          this.frameborder ? this.frameborder : undefined,
        )}
        allowfullscreen=${ifDefined(this.shouldAllowFullscreen())}
      ></iframe>
      <slot></slot>
    `;
  }

  /**
   * If provider is not recognized but the URL is valid, we fallback to a generic iframe.
   */
  public renderIframe(): TemplateResult {
    const { width, height } = this.getDefaultDimensions(this.provider);
    return html`
      <iframe
        width="${width}"
        height="${height}"
        src="${this.url}"
        frameborder=${ifDefined(
          this.frameborder ? this.frameborder : undefined,
        )}
      ></iframe>
      <slot></slot>
    `;
  }

  /**
   * Default dimension overrides for EdPuzzle
   */
  static edPuzzleDefaultDimensions: Dimensions = {
    width: "470",
    widthWithUnits: "470px",
    height: "404",
    heightWithUnits: "404px",
  };

  /**
   * Renders an EdPuzzle `<iframe>`.
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
        frameborder=${ifDefined(
          this.frameborder ? this.frameborder : undefined,
        )}
        allowfullscreen=${ifDefined(this.shouldAllowFullscreen())}
      ></iframe>
      <slot></slot>
    `;
  }

  /**
   * Default dimension overrides for Wistia
   */
  static wistiaDefaultDimensions: Dimensions = {
    width: "470",
    widthWithUnits: "470px",
    height: "404",
    heightWithUnits: "404px",
  };

  /**
   * Renders a Wistia embed `<iframe>`.
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
        frameborder=${ifDefined(
          this.frameborder ? this.frameborder : undefined,
        )}
        allowfullscreen=${ifDefined(this.shouldAllowFullscreen())}
      ></iframe>
      <slot></slot>
    `;
  }

  /**
   * Default dimension overrides for Loom
   */
  static loomDefaultDimensions: Dimensions = {
    width: "470",
    widthWithUnits: "470px",
    height: "404",
    heightWithUnits: "404px",
  };

  /**
   * Renders a Loom embed `<iframe>`.
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
        frameborder=${ifDefined(
          this.frameborder ? this.frameborder : undefined,
        )}
        allowfullscreen=${ifDefined(this.shouldAllowFullscreen())}
      ></iframe>
      <slot></slot>
    `;
  }

  /**
   * Helper function to decide whether to include `allowfullscreen="true"`.
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
    "o-embed": OEmbedElement;
  }

  // If you use JSX/TSX:
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "o-embed": Partial<OEmbedElement>;
    }
  }
}
