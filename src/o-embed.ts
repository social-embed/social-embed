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
import {ifDefined} from 'lit-html/directives/if-defined';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('o-embed')
export class MyElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
  `;

  /**
   * The name to say "Hello" to.
   */
  @property({type: 'String'}) url!: string;
  @property({type: Number}) width = 560;
  @property({type: Number}) height = 315;
  @property({type: 'String'}) frameborder = 0;
  @property({type: 'Boolean'}) allowfullscreen = false;

  /**
   * The number of times the button has been clicked.
   */
  @property({type: Number})
  count = 0;

  render() {
    let youtubeId;
    if (this.url) {
      // credit: https://stackoverflow.com/a/42442074
      youtubeId = this.url.match(
        '^(?:https?:)?//[^/]*(?:youtube(?:-nocookie)?.com|youtu.be).*[=/]([-\\w]{11})(?:\\?|=|&|$)'
      )?.[1];
    }
    const youtubeUrl = `https://www.youtube.com/embed/${youtubeId}`;
    return html`
      <h1>Hello, ${this.url}!</h1>
      <button @click=${this._onClick} part="button">
        Click Count: ${this.count}
      </button>
      <iframe
        width="${this.width}"
        height="${this.height}"
        src="${youtubeUrl}"
        frameborder="${this.frameborder}"
        allowfullscreen=${ifDefined(
          this.allowfullscreen && this.allowfullscreen != '0'
            ? this.allowfullscreen
            : undefined
        )}
      ></iframe>
      <slot></slot>
    `;
  }

  private _onClick() {
    this.count++;
  }

  foo(): string {
    return 'foo';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'o-embed': MyElement;
  }
}
