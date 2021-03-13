import {MyElement} from '../o-embed.js';
import {fixture, html} from '@open-wc/testing';

const assert = chai.assert;

suite('o-embed', () => {
  test('is defined', () => {
    const el = document.createElement('o-embed');
    assert.instanceOf(el, MyElement);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<o-embed></o-embed>`);
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, !</h1>
      <button part="button">Click Count: 0</button>
      <slot></slot>
    `
    );
  });

  test('renders with a set name', async () => {
    const url = 'https://www.youtube.com/watch?v=G_QhTdzWBJk';
    const el = await fixture(html`<o-embed url=${url}></o-embed>`);
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, ${url}!</h1>
      <button part="button">Click Count: 0</button>
      <slot></slot>
    `
    );
  });

  test('handles a click', async () => {
    const el = (await fixture(html`<o-embed></o-embed>`)) as MyElement;
    const button = el.shadowRoot!.querySelector('button')!;
    button.click();
    await el.updateComplete;
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, !</h1>
      <button part="button">Click Count: 1</button>
      <slot></slot>
    `
    );
  });
});
