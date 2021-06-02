/**
 * @license See LICENSE, Copyright 2021- Tony Narlock, license MIT.
 */
import type {TemplateResult} from 'lit-element';
import {LitElement, html, customElement, property} from 'lit-element';
import {ifDefined} from 'lit-html/directives/if-defined.js';

import {
  getProviderFromUrl,
  Provider,
  getDailyMotionEmbedFromId,
  getDailyMotionIdFromUrl,
  getEdPuzzleIdFromUrl,
  getEdPuzzleEmbedUrlFromId,
  getLoomIdFromUrl,
  getLoomEmbedUrlFromId,
  getSpotifyIdAndTypeFromUrl,
  getSpotifyEmbedUrlFromIdAndType,
  getVimeoIdFromUrl,
  getVimeoEmbedUrlFromId,
  getWistiaIdFromUrl,
  getWistiaEmbedUrlFromId,
  getYouTubeEmbedUrlFromId,
  getYouTubeIdFromUrl,
  isValidUrl,
} from '@social-embed/lib';

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
@customElement('o-embed')
export class OEmbedElement extends LitElement {
  /**
   * The URL or ID (if supported)
   */
  @property({type: String}) url!: string;
  /**
   * Pass-through of width attribute
   */
  @property({type: String}) width = '560';
  /**
   * Pass-through of height attribute
   */
  @property({type: String}) height = '315';
  /**
   * Pass-through of frameborder attribute, only used in iframe embeds.
   */
  @property({type: String}) frameborder = '0';
  /**
   * For YouTube only. Passing anything other than 1/true omits the tag.
   */
  @property({type: String}) allowfullscreen: string | boolean | undefined =
    'true';

  provider: Provider | undefined;

  instanceStyle(): TemplateResult {
    const {widthWithUnits, heightWithUnits} = this.getDefaultDimensions(
      this.provider
    );
    return html`
      <style>
        :host {
          border: 0;
          padding: 0;
          display: block;
        }
        iframe {
          width: var(--social-embed-iframe-width, ${widthWithUnits});
          height: var(--social-embed-iframe-height, ${heightWithUnits});
        }
      </style>
    `;
  }

  render(): TemplateResult {
    this.provider = getProviderFromUrl(this.url);

    if (!this.url || this.url == '') {
      return html``;
    }

    let embedResult;
    switch (this.provider) {
      case Provider.YouTube:
        embedResult = this.renderYouTube();
        break;
      case Provider.Spotify:
        embedResult = this.renderSpotify();
        break;
      case Provider.Vimeo:
        embedResult = this.renderVimeo();
        break;
      case Provider.DailyMotion:
        embedResult = this.renderDailyMotion();
        break;
      case Provider.EdPuzzle:
        embedResult = this.renderEdPuzzle();
        break;
      case Provider.Wistia:
        embedResult = this.renderWistia();
        break;
      case Provider.Loom:
        embedResult = this.renderLoom();
        break;
      default:
        if (isValidUrl(this.url)) {
          embedResult = this.renderIframe();
        } else {
          embedResult = html`No provider found for ${this.url}`;
        }
        break;
    }

    return html`${this.instanceStyle()}${embedResult}`;
  }

  public renderSpotify(): TemplateResult {
    const url = getSpotifyEmbedUrlFromIdAndType(
      ...getSpotifyIdAndTypeFromUrl(this.url)
    );
    return html`
      <iframe
        src="${url}"
        width="${this.width}"
        frameborder=${ifDefined(
          this.frameborder ? this.frameborder : undefined
        )}
        height="${this.height}"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>
      <slot></slot>
    `;
  }

  public getDefaultDimensions(provider?: Provider): Dimensions {
    switch (provider) {
      case Provider.Vimeo:
        return this.calculateDefaultDimensions({
          defaults: OEmbedElement.vimeoDefaultDimensions,
        });
      case Provider.DailyMotion:
        return this.calculateDefaultDimensions();
      case Provider.EdPuzzle:
        return this.calculateDefaultDimensions({
          defaults: OEmbedElement.edPuzzleDefaultDimensions,
        });
      case Provider.Wistia:
        return this.calculateDefaultDimensions({
          defaults: OEmbedElement.wistiaDefaultDimensions,
        });
      case Provider.Loom:
        return this.calculateDefaultDimensions({
          defaults: OEmbedElement.loomDefaultDimensions,
        });
      default:
        return this.calculateDefaultDimensions();
    }
  }

  public calculateDefaultDimensions(
    {
      defaults,
    }: {
      defaults?: Dimensions;
    } = {defaults: undefined}
  ): Dimensions {
    const width = this.getAttribute('width') || defaults?.width || this.width;
    const widthWithUnits = width.match(/(px|%)/) ? width : `${width}px`;
    const height =
      this.getAttribute('height') || defaults?.height || this.height;
    const heightWithUnits = height.match(/(px|%)/) ? height : `${height}px`;

    return {width, widthWithUnits, height, heightWithUnits};
  }

  public renderDailyMotion(): TemplateResult {
    const dailyMotionId = getDailyMotionIdFromUrl(this.url);
    if (!dailyMotionId) {
      return html`Could not find dailyMotionId in ${dailyMotionId}`;
    }
    const url = getDailyMotionEmbedFromId(dailyMotionId);

    const {width, widthWithUnits, height, heightWithUnits} =
      this.getDefaultDimensions(this.provider);

    return html`
      <div
        style="width:${widthWithUnits};height:${heightWithUnits};overflow:hidden;"
      >
        <iframe
          allow="autoplay"
          width="${width}"
          height="${height}"
          src="${url}"
          frameborder=${ifDefined(
            this.frameborder ? this.frameborder : undefined
          )}
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen=${ifDefined(
            this.allowfullscreen === '' ||
              this.allowfullscreen == 'true' ||
              this.allowfullscreen === 'true' ||
              this.allowfullscreen === true ||
              this.allowfullscreen === '1'
              ? true
              : undefined
          )}
          style="width:100%;height:100%;left:0px;top:0px;overflow:hidden"
          type="text/html"
        ></iframe>
        <slot></slot>
      </div>
    `;
  }

  static vimeoDefaultDimensions: Dimensions = {
    width: '640',
    widthWithUnits: '640px',
    height: '268',
    heightWithUnits: '268',
  };

  public renderVimeo(): TemplateResult {
    const vimeoId = getVimeoIdFromUrl(this.url);
    if (!vimeoId) {
      return html`Could not find vimeoId in ${vimeoId}`;
    }
    const url = getVimeoEmbedUrlFromId(vimeoId);

    const {width, height} = this.getDefaultDimensions(this.provider);

    return html`
      <iframe
        width="${width}"
        height="${height}"
        src="${url}"
        frameborder=${ifDefined(
          this.frameborder ? this.frameborder : undefined
        )}
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen=${ifDefined(
          this.allowfullscreen === '' ||
            this.allowfullscreen == 'true' ||
            this.allowfullscreen === 'true' ||
            this.allowfullscreen === true ||
            this.allowfullscreen === '1'
            ? true
            : undefined
        )}
      ></iframe>
      <slot></slot>
    `;
  }

  public renderYouTube(): TemplateResult {
    const youtubeId = getYouTubeIdFromUrl(this.url);
    const youtubeUrl = getYouTubeEmbedUrlFromId(youtubeId);

    if (!youtubeId) {
      return html``;
    }
    return html`
      <iframe
        width="${this.width}"
        height="${this.height}"
        src="${youtubeUrl}"
        frameborder=${ifDefined(
          this.frameborder ? this.frameborder : undefined
        )}
        allowfullscreen=${ifDefined(
          this.allowfullscreen === '' ||
            this.allowfullscreen == 'true' ||
            this.allowfullscreen === 'true' ||
            this.allowfullscreen === true ||
            this.allowfullscreen === '1'
            ? true
            : undefined
        )}
      ></iframe>
      <slot></slot>
    `;
  }

  public renderIframe(): TemplateResult {
    return html`
      <iframe
        width="${this.width}"
        height="${this.height}"
        src="${this.url}"
        frameborder=${ifDefined(
          this.frameborder ? this.frameborder : undefined
        )}
      ></iframe>
      <slot></slot>
    `;
  }

  static edPuzzleDefaultDimensions: Dimensions = {
    width: '470',
    widthWithUnits: '470px',
    height: '404',
    heightWithUnits: '404px',
  };

  public renderEdPuzzle(): TemplateResult {
    if (!this.url) {
      return html`No url found for embed`;
    }
    const embedId = getEdPuzzleIdFromUrl(this.url);

    if (!embedId) {
      return html`No ID found for ${this.url}`;
    }
    const embedUrl = getEdPuzzleEmbedUrlFromId(embedId);

    const {width, height} = this.getDefaultDimensions(this.provider);

    return html`
      <iframe
        width="${width}"
        height="${height}"
        src="${embedUrl}"
        frameborder=${ifDefined(
          this.frameborder ? this.frameborder : undefined
        )}
        allowfullscreen=${ifDefined(
          this.allowfullscreen === '' ||
            this.allowfullscreen == 'true' ||
            this.allowfullscreen === 'true' ||
            this.allowfullscreen === true ||
            this.allowfullscreen === '1'
            ? true
            : undefined
        )}
      ></iframe>
      <slot></slot>
    `;
  }

  static wistiaDefaultDimensions: Dimensions = {
    width: '470',
    widthWithUnits: '470px',
    height: '404',
    heightWithUnits: '404px',
  };

  public renderWistia(): TemplateResult {
    if (!this.url) {
      return html`No url found for embed`;
    }
    const embedId = getWistiaIdFromUrl(this.url);

    if (!embedId) {
      return html`No ID found for ${this.url}`;
    }
    const embedUrl = getWistiaEmbedUrlFromId(embedId);

    const {width, height} = this.getDefaultDimensions(this.provider);

    return html`
      <iframe
        width="${width}"
        height="${height}"
        src="${embedUrl}"
        frameborder=${ifDefined(
          this.frameborder ? this.frameborder : undefined
        )}
        allowfullscreen=${ifDefined(
          this.allowfullscreen === '' ||
            this.allowfullscreen == 'true' ||
            this.allowfullscreen === 'true' ||
            this.allowfullscreen === true ||
            this.allowfullscreen === '1'
            ? true
            : undefined
        )}
      ></iframe>
      <slot></slot>
    `;
  }

  static loomDefaultDimensions: Dimensions = {
    width: '470',
    widthWithUnits: '470px',
    height: '404',
    heightWithUnits: '404px',
  };

  public renderLoom(): TemplateResult {
    if (!this.url) {
      return html`No url found for embed`;
    }
    const embedId = getLoomIdFromUrl(this.url);

    if (!embedId) {
      return html`No ID found for ${this.url}`;
    }
    const embedUrl = getLoomEmbedUrlFromId(embedId);

    const {width, height} = this.getDefaultDimensions(this.provider);

    return html`
      <iframe
        width="${width}"
        height="${height}"
        src="${embedUrl}"
        frameborder=${ifDefined(
          this.frameborder ? this.frameborder : undefined
        )}
        allowfullscreen=${ifDefined(
          this.allowfullscreen === '' ||
            this.allowfullscreen == 'true' ||
            this.allowfullscreen === 'true' ||
            this.allowfullscreen === true ||
            this.allowfullscreen === '1'
            ? true
            : undefined
        )}
      ></iframe>
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'o-embed': OEmbedElement;
  }

  // eslint-disable-next-line
  module JSX {
    interface IntrinsicElements {
      'o-embed': Partial<OEmbedElement>;
    }
  }
}
