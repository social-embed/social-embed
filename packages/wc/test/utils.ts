import { expect as vitestExpect } from "vitest";

/**
 * Creates a fixture with the given template
 * Similar to @open-wc/testing fixture utility
 */
export async function fixture<T extends Element>(template: string): Promise<T> {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = template;
  document.body.appendChild(wrapper);
  const element = wrapper.firstElementChild as T;

  // Wait for custom element to be upgraded and rendered
  await new Promise((resolve) => setTimeout(resolve, 0));

  return element;
}

/**
 * Template literal for creating HTML snippets
 * Similar to @open-wc/testing html utility
 */
// biome-ignore lint/suspicious/noExplicitAny: This matches the open-wc/testing API which uses any[] for values
export function html(strings: TemplateStringsArray, ...values: any[]): string {
  return String.raw({ raw: strings }, ...values);
}

/**
 * Retriable shadow DOM assertion
 * Takes advantage of Vitest's built-in polling mechanism
 */
export async function expectShadowDomEventually(
  element: Element,
  expectedOrCallback: string | ((shadowRoot: ShadowRoot) => boolean),
  timeout = 2000,
) {
  if (!element.shadowRoot) {
    throw new Error("Element does not have a shadow root");
  }

  // If a callback was provided, use it directly for polling
  if (typeof expectedOrCallback === "function") {
    await vitestExpect
      .poll(
        () => {
          // biome-ignore lint/style/noNonNullAssertion: We've already checked for shadowRoot presence above
          return expectedOrCallback(element.shadowRoot!);
        },
        { timeout },
      )
      .toBe(true);
    return;
  }

  // Otherwise, proceed with the string comparison approach
  const expected = expectedOrCallback;

  // Get specific elements from the shadow DOM for comparison
  const getElementsToCompare = (shadowRoot: ShadowRoot) => {
    return Array.from(shadowRoot.querySelectorAll("*:not(style)"));
  };

  // Parse the expected HTML
  const parseExpected = (html: string) => {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return Array.from(template.content.querySelectorAll("*"));
  };

  const expectedElements = parseExpected(expected);

  await vitestExpect
    .poll(
      () => {
        // biome-ignore lint/style/noNonNullAssertion: We've already checked for shadowRoot presence above
        const actualElements = getElementsToCompare(element.shadowRoot!);

        if (actualElements.length !== expectedElements.length) {
          return false;
        }

        for (let i = 0; i < actualElements.length; i++) {
          const actual = actualElements[i];
          const expect = expectedElements[i];

          if (actual.tagName.toLowerCase() !== expect.tagName.toLowerCase()) {
            return false;
          }

          const actualAttrs = actual.getAttributeNames();
          const expectedAttrs = expect.getAttributeNames();

          if (actualAttrs.length !== expectedAttrs.length) {
            return false;
          }

          for (const attr of expectedAttrs) {
            const actualValue = actual.getAttribute(attr);
            const expectedValue = expect.getAttribute(attr);
            if (actualValue !== expectedValue) {
              return false;
            }
          }
        }

        return true;
      },
      { timeout },
    )
    .toBe(true);
}
