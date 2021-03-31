/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import type {TemplateResult} from 'lit-element';
import {LitElement, html, customElement, property, css} from 'lit-element';
import {ifDefined} from 'lit-html/directives/if-defined.js';

import {
  getProviderFromUrl,
  Provider,
  getDailyMotionEmbedFromId,
  getDailyMotionIdFromUrl,
  getSpotifyIdAndTypeFromUrl,
  getSpotifyEmbedUrlFromIdAndType,
  getVimeoIdFromUrl,
  getVimeoEmbedUrlFromId,
  getYouTubeEmbedUrlFromId,
  getYouTubeIdFromUrl,
} from '@social-embed/lib';

/**
 * Renders embeds from <o-embed url=""> tags
 *
 * @slot - Directly pass through child contents to bottom of embed, optional.
 */
@customElement('o-embed')
export class OEmbedElement extends LitElement {
  static styles = css`
    :host {
      border: 0;
      padding: 0;
    }
  `;

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

  render(): TemplateResult {
    const provider = getProviderFromUrl(this.url);
    switch (provider) {
      case Provider.YouTube:
        return this.renderYouTube();
      case Provider.Spotify:
        return this.renderSpotify();
      case Provider.Vimeo:
        return this.renderVimeo();
      case Provider.DailyMotion:
        return this.renderDailyMotion();
      default:
        return this.renderYouTube();
    }
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

  public renderDailyMotion(): TemplateResult {
    const dailyMotionId = getDailyMotionIdFromUrl(this.url);
    if (!dailyMotionId) {
      return html`Could not find dailyMotionId in ${dailyMotionId}`;
    }
    const url = getDailyMotionEmbedFromId(dailyMotionId);

    const width = this.getAttribute('width') || this.width;
    const widthWithUnits = this.width.match(/(px|%)/)
      ? this.width
      : `${this.width}px`;
    const height = this.getAttribute('height') || this.height;
    const heightWithUnits = this.height.match(/(px|%)/)
      ? this.height
      : `${this.height}px`;

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

  public renderVimeo(): TemplateResult {
    const vimeoId = getVimeoIdFromUrl(this.url);
    if (!vimeoId) {
      return html`Could not find vimeoId in ${vimeoId}`;
    }
    const url = getVimeoEmbedUrlFromId(vimeoId);

    const width = this.getAttribute('width') || '640';
    const height = this.getAttribute('height') || '268';

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
