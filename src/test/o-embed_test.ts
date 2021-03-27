import {
  convertUrlToEmbedUrl,
  getDailyMotionEmbedFromId,
  getDailyMotionIdFromUrl,
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
      const width = '500';
      const el = await fixture(
        html`<o-embed url=${src} width=${width}></o-embed>`
      );
      assert.shadowDom.equal(
        el,
        `
      <iframe
        allowfullscreen="true"
        frameborder="0"
        width=${width}
        src=${embedSrc}
        height="315">
      </iframe>
      <slot></slot>
    `
      );
    });

    test('renders with a width at 100%', async () => {
      const width = '100%';
      const el = await fixture(
        html`<o-embed url=${src} width=${width}></o-embed>`
      );
      assert.shadowDom.equal(
        el,
        `
      <iframe
        allowfullscreen="true"
        frameborder="0"
        width=${width}
        src=${embedSrc}
        height="315">
      </iframe>
      <slot></slot>
    `
      );
    });

    test('renders with a height', async () => {
      const height = '500';
      const el = await fixture(
        html`<o-embed url=${src} height=${height}></o-embed>`
      );
      assert.shadowDom.equal(
        el,
        `
      <iframe
        allowfullscreen="true"
        frameborder="0"
        width="560"
        src=${embedSrc}
        height=${height}
      >
      </iframe>
      <slot></slot>
    `
      );
    });

    test('renders with a height at 100%', async () => {
      const height = '500';
      const el = await fixture(
        html`<o-embed url=${src} height=${height}></o-embed>`
      );
      assert.shadowDom.equal(
        el,
        `
      <iframe
        allowfullscreen="true"
        frameborder="0"
        width="560"
        src=${embedSrc}
        height=${height}
      >
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
        width="640"
        height="268">
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
        height="268">
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
        width="640"
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
        width="640"
        src=${embedSrc}
        height="268">
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
        width="640"
        src=${embedSrc}
        height="268">
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
        width="640"
        src=${embedSrc}
        height="268">
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
        width="640"
        src=${embedSrc}
        height="268">
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
        width="640"
        src=${embedSrc}
        height="268">
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
        width="640"
        src=${embedSrc}
        height="268"
        >
      </iframe>
      <slot></slot>
    `
      );
    });
  });

  suite('dailyMotion', () => {
    const src = 'https://www.dailymotion.com/video/x7znrd0';
    const embedSrc = getDailyMotionEmbedFromId(getDailyMotionIdFromUrl(src));

    test('renders with url', async () => {
      const el = await fixture(html`<o-embed url=${src}></o-embed>`);
      assert.shadowDom.equal(
        el,
        `
      <div style="width:560px;height:315px;overflow:hidden;">
      <iframe
        width="560"
        allow="autoplay"
        allowfullscreen="true"
        frameborder="0"
        height="315"
        src=${embedSrc}
        style="width:100%;height:100%;left:0px;top:0px;overflow:hidden"
        type="text/html"
        width="560"
      >
      </iframe>
      <slot></slot>
      </div>
    `
      );
    });

    test('renders with with 100%', async () => {
      const el = await fixture(
        html`<o-embed url=${src} width="100%" height="100%"></o-embed>`
      );
      assert.shadowDom.equal(
        el,
        `
      <div style="width:100%;height:100%;overflow:hidden;">
      <iframe
        width="100%"
        allow="autoplay"
        allowfullscreen="true"
        frameborder="0"
        height="100%"
        src=${embedSrc}
        style="width:100%;height:100%;left:0px;top:0px;overflow:hidden"
        type="text/html"
        width="560"
      >
      </iframe>
      <slot></slot>
      </div>
    `
      );
    });
  });
});

suite('convertUrlToEmbedUrl', () => {
  test('is defined', () => {
    assert.equal(convertUrlToEmbedUrl.name, 'convertUrlToEmbedUrl');
  });

  test('spotify', () => {
    assert.equal(
      convertUrlToEmbedUrl('spotify:album:1DFixLWuPkv3KT3TnV35m3'),
      'https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3'
    );
    assert.equal(
      convertUrlToEmbedUrl(
        'https://open.spotify.com/album/4RuzGKLG99XctuBMBkFFOC'
      ),
      'https://open.spotify.com/embed/album/4RuzGKLG99XctuBMBkFFOC'
    );
    assert.equal(
      convertUrlToEmbedUrl('open.spotify.com/album/4RuzGKLG99XctuBMBkFFOC'),
      'https://open.spotify.com/embed/album/4RuzGKLG99XctuBMBkFFOC'
    );
  });

  test('dailymotion', () => {
    assert.equal(
      convertUrlToEmbedUrl('https://www.dailymotion.com/video/x7znrd0'),
      'https://www.dailymotion.com/embed/video/x7znrd0'
    );
    assert.equal(
      convertUrlToEmbedUrl('http://dailymotion.com/video/x7znrd0'),
      'https://www.dailymotion.com/embed/video/x7znrd0'
    );
    assert.equal(
      convertUrlToEmbedUrl('dailymotion.com/video/x7znrd0'),
      'https://www.dailymotion.com/embed/video/x7znrd0'
    );
  });

  test('vimeo', () => {
    assert.equal(
      convertUrlToEmbedUrl('https://vimeo.com/134668506'),
      'https://player.vimeo.com/video/134668506'
    );
    assert.equal(
      convertUrlToEmbedUrl('https://vimeo.com/channels/staffpicks/134668506'),
      'https://player.vimeo.com/video/134668506'
    );
    assert.equal(
      convertUrlToEmbedUrl('vimeo.com/channels/staffpicks/134668506'),
      'https://player.vimeo.com/video/134668506'
    );
  });

  test('youtube', () => {
    assert.equal(
      convertUrlToEmbedUrl('https://www.youtube.com/watch?v=FTQbiNvZqaY'),
      'https://www.youtube.com/embed/FTQbiNvZqaY'
    );

    assert.equal(
      convertUrlToEmbedUrl('https://youtu.be/FTQbiNvZqaY'),
      'https://www.youtube.com/embed/FTQbiNvZqaY'
    );

    assert.equal(
      convertUrlToEmbedUrl('youtu.be/FTQbiNvZqaY'),
      'https://www.youtube.com/embed/FTQbiNvZqaY'
    );
  });
});
