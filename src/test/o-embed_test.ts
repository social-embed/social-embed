import {
  OEmbedElement,
  extractYouTubeID,
  youtubeUrlFromYoutubeId,
} from '../o-embed.js';
import {fixture, html} from '@open-wc/testing';

const assert = chai.assert;

suite('o-embed', () => {
  test('is defined', () => {
    const el = document.createElement('o-embed');
    assert.instanceOf(el, OEmbedElement);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<o-embed></o-embed>`);
    assert.shadowDom.equal(
      el,
      `
      <iframe
        frameborder="0"
        src=${youtubeUrlFromYoutubeId('')}
        width="560"
        height="315">
      </iframe>
      <slot></slot>
    `
    );
  });

  test('renders with a set url', async () => {
    const src = 'https://www.youtube.com/watch?v=G_QhTdzWBJk';
    const embedSrc = youtubeUrlFromYoutubeId(extractYouTubeID(src));
    const el = await fixture(html`<o-embed url=${src}></o-embed>`);
    assert.shadowDom.equal(
      el,
      `
      <iframe
        frameborder="0"
        width="560"
        src=${embedSrc}
        height="315">
      </iframe>
      <slot></slot>
    `
    );
  });

  test('handles a click', async () => {
    const src = 'https://www.youtube.com/watch?v=G_QhTdzWBJk';
    const embedSrc = youtubeUrlFromYoutubeId(extractYouTubeID(src));
    const el = (await fixture(
      html`<o-embed url=${src}></o-embed>`
    )) as OEmbedElement;
    const iframe = el.shadowRoot!.querySelector('iframe')!;
    iframe.click();
    await el.updateComplete;
    assert.shadowDom.equal(
      el,
      `
      <iframe
        frameborder="0"
        width="560"
        src=${embedSrc}
        height="315">
      </iframe>
      <slot></slot>
    `
    );
  });

  test('renders with a set frameborder', async () => {
    const src = 'https://www.youtube.com/watch?v=G_QhTdzWBJk';
    const embedSrc = youtubeUrlFromYoutubeId(extractYouTubeID(src));
    const el = await fixture(
      html`<o-embed url=${src} frameborder="1"></o-embed>`
    );
    assert.shadowDom.equal(
      el,
      `
      <iframe
        frameborder="1"
        width="560"
        src=${embedSrc}
        height="315">
      </iframe>
      <slot></slot>
    `
    );
  });

  test('renders with a set allowfullscreen', async () => {
    const src = 'https://www.youtube.com/watch?v=G_QhTdzWBJk';
    const embedSrc = youtubeUrlFromYoutubeId(extractYouTubeID(src));
    const el = await fixture(
      html`<o-embed url=${src} allowfullscreen></o-embed>`
    );
    assert.shadowDom.equal(
      el,
      `
      <iframe
        allowfullscreen="true"
        frameborder="0"
        width="560"
        src=${embedSrc}
        height="315">
      </iframe>
      <slot></slot>
    `
    );
  });

  test('renders with a set allowfullscreen="true"', async () => {
    const src = 'https://www.youtube.com/watch?v=G_QhTdzWBJk';
    const embedSrc = youtubeUrlFromYoutubeId(extractYouTubeID(src));
    const el = await fixture(
      html`<o-embed url=${src} allowfullscreen="true"></o-embed>`
    );
    assert.shadowDom.equal(
      el,
      `
      <iframe
        allowfullscreen="true"
        frameborder="0"
        width="560"
        src=${embedSrc}
        height="315">
      </iframe>
      <slot></slot>
    `
    );
  });

  test('renders with a set allowfullscreen="false"', async () => {
    const src = 'https://www.youtube.com/watch?v=G_QhTdzWBJk';
    const embedSrc = youtubeUrlFromYoutubeId(extractYouTubeID(src));
    const el = await fixture(
      html`<o-embed url=${src} allowfullscreen="false"></o-embed>`
    );
    assert.shadowDom.equal(
      el,
      `
      <iframe
        frameborder="0"
        width="560"
        src=${embedSrc}
        height="315">
      </iframe>
      <slot></slot>
    `
    );
  });
});
