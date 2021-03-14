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

import {LitElement, html, customElement, property, css} from 'lit-element';
import {ifDefined} from 'lit-html/directives/if-defined.js';

import {extractYouTubeId, youtubeUrlFromYoutubeId} from './lib';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('o-embed')
export class OEmbedElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: 0;
      padding: 0;
      max-width: 800px;
    }
  `;

  /**
   * The name to say "Hello" to.
   */
  @property({type: String}) url!: string;
  @property({type: Number}) width = 560;
  @property({type: Number}) height = 315;
  @property({type: String}) frameborder = '0';
  @property({type: String}) allowfullscreen:
    | string
    | boolean
    | undefined = undefined;

  render() {
    const youtubeId = extractYouTubeId(this.url);
    const youtubeUrl = youtubeUrlFromYoutubeId(youtubeId);
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
}
