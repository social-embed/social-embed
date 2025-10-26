import { beforeAll } from "vitest";
import { OEmbedElement } from "../src/OEmbedElement";

// Register the custom element once before all tests
// This must run before any tests to ensure the custom element is registered
beforeAll(() => {
  if (!customElements.get("o-embed")) {
    customElements.define("o-embed", OEmbedElement);
  }
});
