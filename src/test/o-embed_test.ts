import {
  getVimeoEmbedUrlFromId,
  getVimeoIdFromUrl,
  getYouTubeEmbedUrlFromId,
  getYouTubeIdFromUrl,
  OEmbedElement,
} from '../o-embed.js';
import {fixture, html} from '@open-wc/testing';

const assert = chai.assert;

suite('o-embed', () => {
  test('is defined', () => {
    const el = document.createElement('o-embed');
    assert.instanceOf(el, OEmbedElement);
  });

  test('empty', async () => {
    const el = await fixture(html`<o-embed></o-embed>`);
    assert.shadowDom.equal(
      el,
      `
    `
    );
  });

  suite('youtube', () => {
    const src = 'https://www.youtube.com/watch?v=G_QhTdzWBJk';
    const embedSrc = getYouTubeEmbedUrlFromId(getYouTubeIdFromUrl(src));

    test('renders with default values and sets URL', async () => {
      const el = await fixture(html`<o-embed url=${src}></o-embed>`);
      assert.shadowDom.equal(
        el,
        `
      <iframe
        allowfullscreen="true"
        frameborder="0"
        src=${embedSrc}
        width="560"
        height="315">
      </iframe>
      <slot></slot>
    `
      );
    });

    test('renders with a width', async () => {
      const el = await fixture(
        html`<o-embed url=${src} width="500"></o-embed>`
      );
      assert.shadowDom.equal(
        el,
        `
      <iframe
        allowfullscreen="true"
        frameborder="0"
        width="500"
        src=${embedSrc}
        height="315">
      </iframe>
      <slot></slot>
    `
      );
    });

    test('renders with a height', async () => {
      const el = await fixture(
        html`<o-embed url=${src} height="500"></o-embed>`
      );
      assert.shadowDom.equal(
        el,
        `
      <iframe
        allowfullscreen="true"
        frameborder="0"
        width="560"
        src=${embedSrc}
        height="500">
      </iframe>
      <slot></slot>
    `
      );
    });

    test('renders with a height / width', async () => {
      const el = await fixture(
        html`<o-embed url=${src} height="500" width="500"></o-embed>`
      );
      assert.shadowDom.equal(
        el,
        `
      <iframe
        allowfullscreen="true"
        frameborder="0"
        width="500"
        src=${embedSrc}
        height="500">
      </iframe>
      <slot></slot>
    `
      );
    });

    test('handles a click', async () => {
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

    test('renders with a set frameborder', async () => {
      const el = await fixture(
        html`<o-embed url=${src} frameborder="1"></o-embed>`
      );
      assert.shadowDom.equal(
        el,
        `
      <iframe
        allowfullscreen="true"
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

    test('renders with a set allowfullscreen="0"', async () => {
      const el = await fixture(
        html`<o-embed url=${src} allowfullscreen="0"></o-embed>`
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

  suite('vimeo', () => {
    const src = 'https://vimeo.com/134668506';
    const embedSrc = getVimeoEmbedUrlFromId(getVimeoIdFromUrl(src));

    test('renders with default values and sets URL', async () => {
      const el = await fixture(html`<o-embed url=${src}></o-embed>`);
      assert.shadowDom.equal(
        el,
        `
      <iframe
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen="true"
        frameborder="0"
        src=${embedSrc}
        width="560"
        height="315">
      </iframe>
      <slot></slot>
    `
      );
    });

    test('renders with a width', async () => {
      const el = await fixture(
        html`<o-embed url=${src} width="500"></o-embed>`
      );
      assert.shadowDom.equal(
        el,
        `
      <iframe
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen="true"
        frameborder="0"
        width="500"
        src=${embedSrc}
        height="315">
      </iframe>
      <slot></slot>
    `
      );
    });

    test('renders with a height', async () => {
      const el = await fixture(
        html`<o-embed url=${src} height="500"></o-embed>`
      );
      assert.shadowDom.equal(
        el,
        `
      <iframe
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen="true"
        frameborder="0"
        width="560"
        src=${embedSrc}
        height="500">
      </iframe>
      <slot></slot>
    `
      );
    });

    test('renders with a height / width', async () => {
      const el = await fixture(
        html`<o-embed url=${src} height="500" width="500"></o-embed>`
      );
      assert.shadowDom.equal(
        el,
        `
      <iframe
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen="true"
        frameborder="0"
        width="500"
        src=${embedSrc}
        height="500">
      </iframe>
      <slot></slot>
    `
      );
    });

    test('handles a click', async () => {
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
        allow="autoplay; fullscreen; picture-in-picture"
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

    test('renders with a set frameborder', async () => {
      const el = await fixture(
        html`<o-embed url=${src} frameborder="1"></o-embed>`
      );
      assert.shadowDom.equal(
        el,
        `
      <iframe
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen="true"
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
      const el = await fixture(
        html`<o-embed url=${src} allowfullscreen></o-embed>`
      );
      assert.shadowDom.equal(
        el,
        `
      <iframe
        allow="autoplay; fullscreen; picture-in-picture"
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
      const el = await fixture(
        html`<o-embed url=${src} allowfullscreen="true"></o-embed>`
      );
      assert.shadowDom.equal(
        el,
        `
      <iframe
        allow="autoplay; fullscreen; picture-in-picture"
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
      const el = await fixture(
        html`<o-embed url=${src} allowfullscreen="false"></o-embed>`
      );
      assert.shadowDom.equal(
        el,
        `
      <iframe
        allow="autoplay; fullscreen; picture-in-picture"
        frameborder="0"
        width="560"
        src=${embedSrc}
        height="315">
      </iframe>
      <slot></slot>
    `
      );
    });

    test('renders with a set allowfullscreen="0"', async () => {
      const el = await fixture(
        html`<o-embed url=${src} allowfullscreen="0"></o-embed>`
      );
      assert.shadowDom.equal(
        el,
        `
      <iframe
        allow="autoplay; fullscreen; picture-in-picture"
        frameborder="0"
        width="560"
        src=${embedSrc}
        height="315"
        >
      </iframe>
      <slot></slot>
    `
      );
    });
  });
});
