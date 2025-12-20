/**
 * @license
 * See LICENSE. Copyright 2021- Tony Narlock, license MIT.
 *
 * This component is part of the @social-embed/wc package.
 */

import { MatcherRegistry, renderOutput } from "@social-embed/lib";
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

    const output = result.matcher.toOutput(result.data, {
      attributes: this.allowfullscreen ? { allowfullscreen: "" } : {},
      height: this.height,
      privacy: this.privacy,
      width: this.width,
    });

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
