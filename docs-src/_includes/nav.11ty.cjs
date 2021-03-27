const relative = require('./relative-path.cjs');

module.exports = function ({page}) {
  return `
<nav>
  <a href="${relative(page.url, '/')}">Home</a>
  <a href="${relative(page.url, '/examples/')}">Examples</a>
  <a href="${relative(page.url, '/api/')}">API</a>
  <a href="${relative(page.url, '/install/')}">Install</a>
  <a href="${relative(page.url, '/changes/')}">Release notes</a>
  <a href="https://www.npmjs.com/package/@tony/oembed-component" target="_blank" rel="noopener noreferrer">NPM</a>
  <a href="https://github.com/tony/oembed-component" target="_blank" rel="noopener noreferrer">GitHub</a>
  <a href="https://codepen.io/attachment/pen/bGBZGEv" target="_blank" rel="noopener noreferrer">CodeSandbox Demo</a>
</nav>`;
};
