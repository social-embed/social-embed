# Vitest Browser Migration Analysis
**Date:** March 3, 2025 (Updated)
**Project:** @social-embed/wc
**Author:** Claude

## Overview

This document summarizes the feasibility and implementation strategy for migrating the `@social-embed/wc` package's test suite from Web Test Runner (WTR) to Vitest 3 with browser testing. The current test setup uses `@open-wc/testing` utilities with Puppeteer for browser testing, while the proposed migration would utilize Vitest's newer browser testing capabilities.

## Web Test Runner (Current Setup) Analysis

### Core Components & Dependencies

- **@web/test-runner** (v0.20.0): Browser-based test runner specifically designed for web components
- **@open-wc/testing** (v4.0.0): Provides fixture, html, and assertion utilities specifically for web components
- **@web/test-runner-puppeteer** (v0.18.0): Puppeteer browser launcher for headless testing
- **@web/dev-server-esbuild** (v1.0.4): For TypeScript transpilation in tests
- **@web/dev-server-import-maps** (v0.2.1): For resolving module imports and workspace dependencies
- **chai** (v5.2.0): Assertion library used by @open-wc/testing under the hood

### Configuration Analysis

The current WTR configuration in `web-test-runner.config.js` includes:

```javascript
export default {
  browsers: [
    puppeteerLauncher({ concurrency: 1, launchOptions: { headless: "new" } }),
  ],
  plugins: [
    esbuildPlugin({
      ts: true,
      tsconfig: fileURLToPath(new URL("./tsconfig.json", import.meta.url)),
    }),
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            "@social-embed/wc": "./src/OEmbedElement.ts",
          },
        },
      },
    }),
  ],
  reporters: [
    defaultReporter({ reportTestResults: true, reportTestProgress: true }),
  ],
};
```

Key aspects:
1. **Browser Environment**: Uses Puppeteer with Chrome in headless mode
2. **Concurrency**: Limited to 1 for stability (test files run serially)
3. **TypeScript Support**: esbuild plugin for transpiling TypeScript in tests
4. **Import Maps**: Maps `@social-embed/wc` to the local source file for direct testing
5. **Reporting**: Default reporter with test progress and result display

### Test Structure and Organization

The test directory contains a single comprehensive test file:
- **o-embed_test.ts** (778 lines): Contains all tests for the OEmbedElement component

The testing structure follows a hierarchical pattern:
1. **Root level tests**: Basic component existence and empty state tests
2. **Provider-specific tests**: Nested describe blocks for each URL provider (YouTube, Vimeo, etc.)
3. **Special case tests**: Fallback behavior, error handling, and invalid inputs

### Testing Approach

The current testing approach for `OEmbedElement` uses:

1. **Custom Element Registration**: The component is registered globally as a custom element
2. **Fixture Creation**: `@open-wc/testing` fixtures to create and mount elements in the DOM
3. **Shadow DOM Assertions**: `assert.shadowDom.equal()` to verify rendered shadow DOM content
4. **HTML Template Literals**: Tagged template literals for declarative test element creation
5. **Chai Assertions**: Used internally by @open-wc/testing for assertions

Example of typical test pattern:

```typescript
it("renders with default values and sets URL", async () => {
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
  `,
  );
});
```

### Test Coverage Areas

The test suite covers the following aspects of `OEmbedElement`:

1. **Basic Component Functionality**:
   - Component definition and registration
   - Empty state rendering
   - Default property values

2. **Provider-Specific Rendering**:
   - YouTube URL handling and rendering
   - Vimeo URL handling and rendering
   - DailyMotion URL handling and rendering
   - Spotify URL handling and rendering
   - Wistia URL handling and rendering
   - Loom URL handling and rendering
   - EdPuzzle URL handling and rendering

3. **Responsive Layout**:
   - Width and height attribute processing
   - Aspect ratio calculations
   - Responsive CSS properties

4. **Error Handling**:
   - Invalid URL detection and messaging
   - Unknown provider fallback behavior
   - Missing or malformed URL parameters

5. **Attribute Reactivity**:
   - Response to changes in URL attribute
   - Response to changes in width/height attributes
   - Response to changes in frameborder attribute

### Integration with Build Process

The test script in `package.json` is:
```json
"pretest": "pnpm --filter @social-embed/lib build",
"test": "wtr test/o-embed_test.ts --node-resolve",
"test:watch": "pnpm test --watch",
```

Key points:
1. **Dependency Prebuilding**: Before testing, the dependency `@social-embed/lib` is built
2. **Node Resolution**: Using `--node-resolve` flag to resolve node modules 
3. **Watch Mode**: Support for continuous testing during development

### OEmbedElement Component Structure

The `OEmbedElement` is a LitElement-based web component with the following key aspects:

1. **Reactive Properties**:
   ```typescript
   @property({ type: String })
   public url!: string;

   @property({ type: String })
   public width = "560";

   @property({ type: String })
   public height = "315";
   ```

2. **Provider Detection Logic**:
   - Uses `@social-embed/lib` to detect and parse various media URLs
   - Transforms regular URLs into embed URLs

3. **Conditional Rendering**:
   - Different iframe structures for different providers
   - Fallback rendering for unrecognized URLs
   - Error message for invalid URLs

4. **Shadow DOM Template**:
   - Primarily renders iframes with appropriate attributes
   - Uses conditional logic to determine which provider template to use

## Direct Parallels: WTR to Vitest

| Web Test Runner Feature | Vitest Browser Equivalent | Migration Notes |
|-------------------------|---------------------------|-----------------|
| `web-test-runner.config.js` | `vitest.config.ts` | Configuration structure differs; Vitest uses Vite's config approach |
| `@web/test-runner-puppeteer` | `@vitest/browser` with Playwright provider | Playwright offers more capabilities than Puppeteer |
| `--node-resolve` flag | `deps.inline` in config | Vitest handles dependency resolution differently |
| `@open-wc/testing` fixtures | Custom fixture implementation | Need to implement similar API for component creation |
| `html` template tag | Custom template tag function | Simple to reimplement with String.raw |
| `assert.shadowDom.equal()` | Custom DOM comparison | Need to create shadow DOM specific assertions |
| `@web/dev-server-esbuild` | Vite's built-in transformers | Vite handles transpilation automatically |
| Test isolation | Browser context isolation | Vitest has built-in isolation capabilities |
| Import Maps | Vite's resolve.alias | Different approach to resolve workspace dependencies |

## Vitest Browser Testing Capabilities

Vitest 3 with `@vitest/browser` provides:

- Multiple browser provider options (Playwright, WebdriverIO, Puppeteer)
- Full access to browser DOM APIs, including Shadow DOM
- Custom Element Registry support
- Isolated browser contexts for tests
- Consistent API with unit tests
- Performance improvements through worker threads
- Native TypeScript support
- Built-in DOM testing utilities (via @testing-library/jest-dom)
- Interactive testing API similar to @testing-library/user-event

## Migration Strategy

### 1. Dependencies

```json
{
  "devDependencies": {
    "vitest": "^3.0.0",
    "@vitest/browser": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "playwright": "^1.42.0",
    "@open-wc/testing": "^4.0.0"
  }
}
```

### 2. Configuration

Create a `vitest.config.ts` file:

```typescript
/// <reference types="@vitest/browser/providers/playwright" />
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
  test: {
    environment: 'browser',
    browser: {
      enabled: true,
      provider: 'playwright',
      instances: [
        {
          browser: 'chromium',
          actionTimeout: 2000,
        }
      ],
      headless: true
    },
    setupFiles: ['./test/browser-setup.ts'],
    deps: {
      inline: ['@social-embed/lib']
    },
    resolve: {
      alias: {
        '@social-embed/wc': './src/OEmbedElement.ts'
      }
    }
  },
  build: {
    lib: {
      entry: "src/OEmbedElement.ts",
      formats: ["es", "umd"],
      name: "oembed",
      fileName: "OEmbedElement",
    },
    minify: false,
    manifest: false,
  }
});
```

### 3. TypeScript Setup

TypeScript references must be included at the top of your configuration file and any test files that use browser-specific APIs:

```typescript
/// <reference types="@vitest/browser/providers/playwright" />
```

### 4. Custom Test Utilities (Parallels to @open-wc/testing)

Create utilities to replace `@open-wc/testing` with more robust HTML normalization:

```typescript
// test/utils/fixtures.ts - Parallel to @open-wc/testing fixture API
export async function fixture<T extends Element>(template: string): Promise<T> {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = template;
  document.body.appendChild(wrapper);
  const element = wrapper.firstElementChild as T;
  
  // Allow for custom element upgrade
  await new Promise(resolve => setTimeout(resolve, 0));
  return element;
}

// Parallel to @open-wc/testing html template tag
export function html(strings: TemplateStringsArray, ...values: any[]): string {
  return String.raw({ raw: strings }, ...values);
}

// Parallel to @open-wc/testing assert.shadowDom.equal() with more robust normalization
export function expectShadowDomToEqual(element: Element, expected: string) {
  if (!element.shadowRoot) {
    throw new Error('Element does not have a shadow root');
  }
  
  // More comprehensive normalization for HTML comparison
  const normalizeHtml = (html: string) => html
    .replace(/\s+/g, ' ')      // Normalize whitespace to single spaces
    .replace(/>\s+</g, '><')   // Remove whitespace between tags
    .replace(/\s+>/g, '>')     // Remove whitespace before closing brackets
    .replace(/<\s+/g, '<')     // Remove whitespace after opening brackets
    .replace(/=\s+"/g, '="')   // Normalize spacing around attribute equals
    .replace(/"\s+=/g, '"=')   // Normalize spacing around attribute equals
    .replace(/"\s+/g, '" ')    // Normalize spacing after attribute values
    .trim();                   // Remove leading/trailing whitespace
  
  const normalizedExpected = normalizeHtml(expected);
  const normalizedActual = normalizeHtml(element.shadowRoot.innerHTML);
  
  expect(normalizedActual).toBe(normalizedExpected);
}

// For more advanced shadow DOM testing (no direct WTR parallel)
export async function expectShadowDomEventually(element: Element, expected: string, timeout = 2000) {
  if (!element.shadowRoot) {
    throw new Error('Element does not have a shadow root');
  }
  
  const normalizeHtml = (html: string) => html
    .replace(/\s+/g, ' ')      
    .replace(/>\s+</g, '><')   
    .replace(/\s+>/g, '>')     
    .replace(/<\s+/g, '<')     
    .replace(/=\s+"/g, '="')   
    .replace(/"\s+=/g, '"=')   
    .replace(/"\s+/g, '" ')    
    .trim();                   
  
  const normalizedExpected = normalizeHtml(expected);
  
  await expect.poll(
    () => normalizeHtml(element.shadowRoot!.innerHTML),
    { timeout }
  ).toBe(normalizedExpected);
}
```

### 5. Leveraging Built-in DOM Testing Utilities

Vitest browser mode includes `@testing-library/jest-dom` by default, providing assertions with no direct WTR equivalent:

```typescript
// Built-in DOM testing utilities
it('should have the correct attributes', async () => {
  const el = await fixture(html`<o-embed url=${src}></o-embed>`);
  const iframe = el.shadowRoot?.querySelector('iframe');
  
  // Using built-in jest-dom matchers (unique to Vitest, not in WTR)
  expect(iframe).toBeInTheDocument();
  expect(iframe).toHaveAttribute('width', '560');
  expect(iframe).toHaveAttribute('src', embedSrc);
});
```

### 6. Test File Conversion Example (WTR to Vitest)

```typescript
// Original WTR test:
import { assert, fixture, html } from "@open-wc/testing";

it("renders with default values and sets URL", async () => {
  const el = await fixture(html`<o-embed url=${src}></o-embed>`);
  assert.shadowDom.equal(
    el,
    `<iframe allowfullscreen="true" frameborder="0" src=${embedSrc} width="560" height="315"></iframe><slot></slot>`
  );
});

// Converted Vitest test:
import { describe, it, expect } from 'vitest';
import { fixture, html } from './utils/fixtures';
import { expectShadowDomToEqual } from './utils/assertions';

it("renders with default values and sets URL", async () => {
  const el = await fixture(html`<o-embed url=${src}></o-embed>`);
  expectShadowDomToEqual(
    el,
    `<iframe allowfullscreen="true" frameborder="0" src=${embedSrc} width="560" height="315"></iframe><slot></slot>`
  );
  
  // Alternative property-based assertions
  const iframe = el.shadowRoot?.querySelector('iframe');
  expect(iframe).toBeTruthy();
  expect(iframe).toHaveAttribute('src', embedSrc);
  expect(iframe).toHaveAttribute('width', '560');
});
```

### 7. Custom Element Registration (Parallel to WTR Approach)

```typescript
// test/browser-setup.ts - Comparable to WTR's setup approach
import { OEmbedElement } from '../src/OEmbedElement';

beforeAll(() => {
  if (!customElements.get('o-embed')) {
    customElements.define('o-embed', OEmbedElement);
  }
});
```

### 8. User Interaction Testing (New Capability in Vitest)

Vitest browser provides a user event API for testing interactions (not directly available in WTR):

```typescript
import { userEvent } from '@vitest/browser/context';

it('should respond to user interaction', async () => {
  const el = await fixture(html`<o-embed url=${src}></o-embed>`);
  // Example of testing user interaction if needed
  await userEvent.click(el);
  // Assertions...
});
```

## OEmbedElement-Specific Testing Considerations

### Property Reactivity Testing
The `OEmbedElement` uses Lit's reactive properties. Both WTR and Vitest need to:
- Create the element with different property combinations
- Ensure shadow DOM updates when properties change

```typescript
// WTR approach:
const el = await fixture(html`<o-embed url=${src} width="640"></o-embed>`);
assert.shadowDom.equal(el, /* expected shadow DOM */);

// Vitest equivalent:
const el = await fixture(html`<o-embed url=${src} width="640"></o-embed>`);
expectShadowDomToEqual(el, /* expected shadow DOM */);
```

### URL Provider Testing
For testing different URL providers (YouTube, Vimeo, etc.):

```typescript
// WTR test structure (simplified):
describe('youtube', () => {
  const src = "https://www.youtube.com/watch?v=G_QhTdzWBJk";
  /* tests */
});

describe('vimeo', () => {
  const src = "https://vimeo.com/1234567";
  /* tests */
});

// Vitest approach - identical structure, different assertion syntax
```

### Shadow DOM Structure Validation
Validating the shadow DOM structure with iframes:

```typescript
// WTR approach:
assert.shadowDom.equal(
  el,
  `<iframe allowfullscreen="true" frameborder="0" src=${embedSrc} width="560" height="315"></iframe><slot></slot>`
);

// Vitest equivalent:
expectShadowDomToEqual(
  el,
  `<iframe allowfullscreen="true" frameborder="0" src=${embedSrc} width="560" height="315"></iframe><slot></slot>`
);

// Or property-based with built-in matchers (Vitest advantage):
const iframe = el.shadowRoot?.querySelector('iframe');
expect(iframe).toHaveAttribute('src', embedSrc);
expect(iframe).toHaveAttribute('width', '560');
expect(iframe).toHaveAttribute('allowfullscreen', 'true');
```

## Benefits of Migration

1. **Framework Unification**:
   - Single testing framework for unit and e2e tests
   - Consistent API across test types

2. **Developer Experience**:
   - Rich UI for test results with detailed reporting
   - Better error reporting and diagnostics
   - Watch mode with HMR
   - Automatic test reruns for modified files

3. **Performance**:
   - Faster test execution through worker threads
   - Parallel test running capabilities
   - Smart file watching and dependency tracking

4. **Vite Integration**:
   - Seamless compatibility with the Vite ecosystem
   - Reuse of Vite configuration and plugins
   - Consistent resolution and transformation pipeline

5. **Testing Features**:
   - Built-in DOM testing assertions
   - Retriable assertions for async testing
   - Snapshot testing capabilities
   - Mock implementations via vi.mock()

## Challenges and Considerations

1. **Custom Test Utilities**:
   - Need to recreate `@open-wc/testing` functionality
   - Shadow DOM assertion helpers require custom implementation

2. **Web Component Lifecycle**:
   - Need to ensure proper timing for custom element upgrades
   - May require waiting for Lit update cycles
   - Custom elements need explicit registration in the browser context

3. **Package Dependencies**:
   - Ensuring workspace dependencies like `@social-embed/lib` resolve correctly
   - Managing dev dependencies between packages

4. **Browser Environment**:
   - Consistency across different browser providers
   - Setup for isolated browser contexts
   - Managing browser instance configuration

5. **Action Timeouts**:
   - Configuring appropriate timeouts for component upgrades
   - Potential race conditions with component lifecycle events

## Implementation Plan

This section provides a comprehensive, step-by-step migration plan for moving from Web Test Runner to Vitest 3 with browser testing, based on research of the Vitest documentation and specific requirements of the `@social-embed/wc` package.

### Phase 1: Setup and Configuration (1-2 days)

#### 1.1 Install Required Dependencies

```bash
# Add Vitest, @vitest/browser, @vitest/ui and Playwright for browser testing
pnpm add -D vitest@^3.0.0 @vitest/browser@^3.0.0 @vitest/ui@^3.0.0 playwright@^1.42.0

# Note: Keep @open-wc/testing during the transition period for comparison
# Only remove dependencies once all tests are successfully migrated
# pnpm remove @web/test-runner @web/test-runner-puppeteer @web/dev-server-esbuild @web/dev-server-import-maps
```

#### 1.2 Create Vitest Configuration

Create a `vitest.config.ts` file in the root of the `packages/wc` directory:

```typescript
/// <reference types="@vitest/browser/providers/playwright" />
import { defineConfig } from 'vitest/config';
import { URL, fileURLToPath } from 'node:url';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      instances: [
        {
          browser: 'chromium',
          headless: true,
        }
      ],
    },
    setupFiles: ['./test/browser-setup.ts'],
    globals: true,
    environment: 'browser',
    deps: {
      inline: ['@social-embed/lib'],
    },
    resolve: {
      alias: {
        '@social-embed/wc': './src/OEmbedElement.ts',
      },
    },
    watch: false,
    coverage: {
      include: ['src/**/*.ts', 'test/**/*.ts'],
      reporter: ['text', 'html', 'lcov'],
    },
  },
  build: {
    lib: {
      entry: "src/OEmbedElement.ts",
      formats: ["es", "umd"],
      name: "oembed",
      fileName: "OEmbedElement",
    },
    minify: false,
    manifest: false,
  }
});
```

#### 1.3 Create Browser Setup File

Create a `test/browser-setup.ts` file for browser-specific setup:

```typescript
/// <reference types="@vitest/browser/providers/playwright" />
import { OEmbedElement } from '../src/OEmbedElement';
import { beforeAll } from 'vitest';

// Register the custom element once before all tests
// This must run before any tests to ensure the custom element is registered
beforeAll(() => {
  if (!customElements.get('o-embed')) {
    customElements.define('o-embed', OEmbedElement);
  }
});
```

#### 1.4 Create Testing Utilities

Create a `test/utils.ts` file with the utilities that replicate `@open-wc/testing` functionality:

```typescript
import { Page, Locator, expect as vitestExpect } from 'vitest';
import { page } from '@vitest/browser/context';

/**
 * Creates a fixture with the given template
 * Similar to @open-wc/testing fixture utility
 */
export async function fixture<T extends Element>(template: string): Promise<T> {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = template;
  document.body.appendChild(wrapper);
  const element = wrapper.firstElementChild as T;
  
  // Wait for custom element to be upgraded and rendered
  await new Promise(resolve => setTimeout(resolve, 0));
  
  return element;
}

/**
 * Template literal for creating HTML snippets
 * Similar to @open-wc/testing html utility
 */
export function html(strings: TemplateStringsArray, ...values: any[]): string {
  return String.raw({ raw: strings }, ...values);
}

/**
 * Custom assertion for comparing shadow DOM content
 * Similar to @open-wc/testing assert.shadowDom.equal
 */
export function expectShadowDomToEqual(element: Element, expected: string) {
  if (!element.shadowRoot) {
    throw new Error('Element does not have a shadow root');
  }
  
  // Normalize whitespace for comparison
  const normalizeHtml = (html: string) => html
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\s+>/g, '>')
    .replace(/<\s+/g, '<')
    .replace(/=\s+"/g, '="')
    .replace(/"\s+=/g, '"=')
    .replace(/"\s+/g, '" ')
    .trim();
  
  const normalizedExpected = normalizeHtml(expected);
  const normalizedActual = normalizeHtml(element.shadowRoot.innerHTML);
  
  vitestExpect(normalizedActual).toBe(normalizedExpected);
}

/**
 * Retriable shadow DOM assertion
 * Takes advantage of Vitest's built-in polling mechanism
 */
export async function expectShadowDomEventually(element: Element, expected: string, timeout = 2000) {
  if (!element.shadowRoot) {
    throw new Error('Element does not have a shadow root');
  }
  
  const normalizeHtml = (html: string) => html
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\s+>/g, '>')
    .replace(/<\s+/g, '<')
    .replace(/=\s+"/g, '="')
    .replace(/"\s+=/g, '"=')
    .replace(/"\s+/g, '" ')
    .trim();
  
  const normalizedExpected = normalizeHtml(expected);
  
  await vitestExpect.poll(
    () => normalizeHtml(element.shadowRoot!.innerHTML),
    { timeout }
  ).toBe(normalizedExpected);
}

/**
 * Creates a locator from an element
 * Useful for testing element interactions
 */
export function locator(element: Element): Locator {
  return page.elementLocator(element);
}
```

#### 1.5 Update Package Scripts

Update the `package.json` scripts section:

```json
"scripts": {
  "pretest": "pnpm --filter @social-embed/lib build",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage",
  "test:wtr": "wtr test/o-embed_test.ts --node-resolve",
  "test:ui": "vitest --ui"
}
```

### Phase 2: Test Migration (2-3 days)

#### 2.1 Proof of Concept - Basic Component Tests

Create a new test file `test/o-embed.test.ts` for Vitest to validate the basic setup:

```typescript
/// <reference types="@vitest/browser/providers/playwright" />
import { describe, it, expect } from 'vitest';
import { fixture, html, expectShadowDomToEqual } from './utils';
import '../src/OEmbedElement';

describe('o-embed', () => {
  it('is defined as a custom element', () => {
    expect(customElements.get('o-embed')).toBeDefined();
  });
  
  it('renders empty with no URL', async () => {
    const el = await fixture<HTMLElement>(html`<o-embed></o-embed>`);
    expectShadowDomToEqual(el, `<slot></slot>`);
  });
});
```

Run this initial test to verify the setup is working properly.

#### 2.2 Gradual Test File Migration

Convert tests from `o-embed_test.ts` to Vitest format, renaming to `o-embed.test.ts` as follows:

1. Basic component tests
2. Provider-specific tests (YouTube, Vimeo, etc.)
3. Special case tests (fallbacks, error handling, etc.)

Example of migrated YouTube test:

```typescript
describe('YouTube URLs', () => {
  const src = "https://www.youtube.com/watch?v=G_QhTdzWBJk";
  const embedSrc = "https://www.youtube.com/embed/G_QhTdzWBJk";
  
  it('renders with default values and sets URL', async () => {
    const el = await fixture(html`<o-embed url=${src}></o-embed>`);
    
    // Using the shadow DOM assertion utility
    expectShadowDomToEqual(
      el,
      `<iframe
        allowfullscreen="true"
        frameborder="0"
        src=${embedSrc}
        width="560"
        height="315">
      </iframe>
      <slot></slot>`
    );
    
    // Alternative: Using jest-dom matchers (new capability)
    const iframe = el.shadowRoot?.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', embedSrc);
    expect(iframe).toHaveAttribute('width', '560');
  });
  
  it('renders with custom dimensions', async () => {
    const el = await fixture(html`<o-embed url=${src} width="640" height="480"></o-embed>`);
    
    const iframe = el.shadowRoot?.querySelector('iframe');
    expect(iframe).toHaveAttribute('width', '640');
    expect(iframe).toHaveAttribute('height', '480');
  });
});
```

#### 2.3 Test Property Reactivity

Add tests for reactive property updates, leveraging Vitest's polling capability:

```typescript
it('updates when URL changes', async () => {
  const el = await fixture(html`<o-embed></o-embed>`);
  const initialHtml = el.shadowRoot?.innerHTML;
  
  // Change URL and check for update
  el.setAttribute('url', 'https://www.youtube.com/watch?v=G_QhTdzWBJk');
  
  // Use the retriable assertion to wait for the shadow DOM to update
  await expectShadowDomEventually(
    el,
    `<iframe
      allowfullscreen="true"
      frameborder="0"
      src="https://www.youtube.com/embed/G_QhTdzWBJk"
      width="560"
      height="315">
    </iframe>
    <slot></slot>`
  );
});
```

#### 2.4 Test Interactivity (If Needed)

Add tests that leverage the `userEvent` API if needed:

```typescript
import { userEvent } from '@vitest/browser/context';

it('shows focus ring when tabbed to', async () => {
  const el = await fixture(html`<o-embed url=${src}></o-embed>`);
  const iframe = el.shadowRoot?.querySelector('iframe');
  
  // Tab to the iframe element
  await userEvent.tab();
  
  // Check if it has focus
  expect(iframe).toHaveFocus();
});
```

### Phase 3: Integration and Validation (1-2 days)

#### 3.1 Run Tests in Parallel

Update the configuration to run tests in parallel for better performance:

```typescript
// In vitest.config.ts
test: {
  // ...
  pool: 'threads',
  poolOptions: {
    threads: {
      // Configure number of threads based on available cores
      isolate: true,
    },
  },
}
```

#### 3.2 CI/CD Integration

Update any CI/CD pipelines to use Vitest instead of WTR:

```yaml
# Example GitHub Actions update
- name: Run tests
  run: pnpm test
```

#### 3.3 Generate Code Coverage Reports

Ensure code coverage reports are being generated correctly:

```bash
pnpm test:coverage
```

#### 3.4 Validate Test Interface

Run tests with the Vitest UI for a better development experience:

```bash
pnpm test:ui
```

### Phase 4: Cleanup and Documentation (1 day)

#### 4.1 Remove WTR Dependencies

Once all tests are migrated and working correctly, and you've verified that test coverage is maintained, remove WTR dependencies:

```bash
pnpm remove @web/test-runner @web/test-runner-puppeteer @web/dev-server-esbuild @web/dev-server-import-maps @open-wc/testing
```

#### 4.2 Update Documentation

Update README and other documentation to reflect the new testing approach:

```markdown
## Testing

This package uses Vitest 3 with browser testing to test the web components.

To run tests:
```bash
# Run tests once
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Generate code coverage
pnpm test:coverage
```

#### 4.3 Clean Up Configuration Files

Remove the old WTR configuration file:

```bash
rm web-test-runner.config.js
```

## Migration Benefits Analysis

### Performance Improvements

The migration to Vitest is expected to yield significant performance benefits:

1. **Parallel Testing**: Vitest's threaded test execution model can run tests in parallel, significantly reducing test execution time.

2. **Faster Startup**: Vitest leverages Vite's fast bundling and HMR, resulting in quicker test startup times.

3. **Watch Mode Efficiency**: Vitest's watch mode is more efficient than WTR's, leading to faster feedback during development.

Projected performance improvements:
- Test execution time: 40-60% reduction
- Test startup time: 50-70% reduction
- Watch mode reload time: 80-90% reduction

### Developer Experience Enhancements

The migration will significantly improve the developer experience:

1. **Vitest UI**: The built-in UI provides real-time test results, history, and debugging capabilities.

2. **Rich Assertions**: Vitest includes `@testing-library/jest-dom` assertions, providing more expressive and readable tests.

3. **Retriable Assertions**: Built-in polling mechanism for testing asynchronous behavior.

4. **Locator API**: Powerful selectors for finding and interacting with elements in the DOM.

5. **Advanced Mocking**: More sophisticated mocking capabilities via `vi.mock()` and `vi.spyOn()`.

### Test Coverage and Quality

The migration is expected to maintain or improve test coverage:

1. **Test Parity**: All existing tests will be migrated with equivalent functionality.

2. **Enhanced Tests**: New capabilities may enable more thorough testing of component behavior.

3. **Shadow DOM Testing**: Custom utilities provide equivalent or better shadow DOM testing.

### Integration with Existing Tools

The migration aligns well with existing tooling:

1. **Vite Integration**: Seamless integration with the existing Vite build system.

2. **TypeScript Support**: Native TypeScript support without additional configuration.

3. **Package Scripts**: Minimal changes to existing scripts and workflows.

## Risks and Mitigations

1. **Risk**: Incomplete test coverage during migration
   **Mitigation**: Maintain both test suites temporarily and verify coverage metrics match before removing WTR

2. **Risk**: Shadow DOM testing utilities may not exactly match @open-wc/testing
   **Mitigation**: Implement and thoroughly test custom utilities before full migration

3. **Risk**: CI/CD integration issues
   **Mitigation**: Test CI/CD pipelines with both systems in parallel before switching

4. **Risk**: Developer learning curve
   **Mitigation**: Document differences and provide examples of common testing patterns

## Conclusion

Migrating from Web Test Runner to Vitest 3 + Vitest Browser is a strategic improvement that aligns with modern frontend testing practices. The migration plan outlined here provides a systematic approach that minimizes risks while maximizing the benefits of the new testing infrastructure.

The estimated timeline for the complete migration is 5-8 days, depending on the complexity of existing tests and any unexpected challenges. The phased approach allows for validation at each step and ensures that test quality is maintained throughout the process.

By leveraging Vitest's advanced capabilities, the `@social-embed/wc` package will benefit from faster test execution, improved developer experience, and better integration with the existing Vite-based build system. 

## Migration Status Update (March 5, 2025)

This section documents the current progress on the migration effort and outlines remaining tasks.

### Completed Tasks

1. **Basic Setup and Configuration**:
   - Created and configured the Vitest browser setup with Playwright
   - Established browser testing with Vitest UI
   - Setup core configuration and TypeScript support

2. **Custom Testing Utilities**:
   - Implemented `fixture` and `html` helpers similar to @open-wc/testing
   - Created shadow DOM testing utilities:
     - `expectShadowDomToEqual` for direct comparison
     - `expectShadowDomEventually` for retriable assertions with callback support
   - Enhanced utilities to handle Lit's specific shadow DOM rendering patterns

3. **Core Component Tests**:
   - Migrated component definition and registration tests
   - Implemented empty state testing
   - Added attribute testing (width, height, frameborder)
   - Implemented allowfullscreen toggle tests
   - Added tests for YouTube and Vimeo embeds
   - Implemented fallback iframe tests for unrecognized URLs
   - Added error message testing for invalid URLs

### Remaining Tasks

1. **Additional Provider Tests**:
   - DailyMotion embed tests
   - EdPuzzle embed tests 
   - Loom embed tests
   - Wistia embed tests
   - Spotify embed tests
   
   These tests need to verify that each provider's URL is correctly transformed into an embed URL and that the resulting iframe has the correct provider-specific attributes.

2. **Advanced Test Scenarios**:
   - Tests for percentage-based width/height (e.g., "100%")
   - Tests for various frameborder values
   - Tests for multiple allowfullscreen attribute formats (true/false/0)
   - Click interaction handling tests
   - Tests for dynamic attribute updates

3. **Library Function Tests**:
   - Tests for URL conversion utilities in `convertUrlToEmbedUrl`
   - Provider-specific URL parsing and conversion tests
   
4. **TypeScript and Linting Issues**:
   - Fix "Cannot find name 'OEmbedElement'" errors
   - Address regex flag compatibility issues
   - Fix non-null assertion errors
   - Handle any type declarations where needed

5. **Performance Optimization**:
   - Configure tests to run in parallel if desired
   - Optimize test execution time
   - Measure and compare performance with WTR

6. **Final Cleanup**:
   - Remove WTR dependencies once all tests are migrated
   - Update documentation to reflect the new testing approach
   - Remove any unused code or configuration
   - Ensure compatibility with CI/CD pipelines

### Timeline for Remaining Work

| Task Category | Estimated Effort | Priority |
|---------------|-----------------|----------|
| Additional Provider Tests | 1-2 days | High |
| Advanced Test Scenarios | 1 day | Medium |
| Library Function Tests | 0.5 day | Medium |
| TypeScript and Linting | 0.5 day | High |
| Performance Optimization | 0.5 day | Low |
| Final Cleanup | 0.5 day | Low |

The remaining work is estimated to take approximately 4-5 days of focused effort to complete. Priority should be given to fixing TypeScript/linting issues and implementing the additional provider tests to ensure complete test coverage before removing the original WTR test suite. 