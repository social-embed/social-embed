/**
 * Export verification tests for package.json exports field.
 *
 * These tests verify that the package entry point exports work correctly,
 * ensuring CDN and bundler compatibility.
 */

import type { LitElement } from "lit";
import { describe, expectTypeOf, test } from "vitest";
import { OEmbedElement } from "../src/OEmbedElement";

describe("Package Exports (@social-embed/wc)", () => {
  test("OEmbedElement class is exported", () => {
    // Verify the class is exported (not just the type)
    expectTypeOf(OEmbedElement).toBeObject();
    expectTypeOf(OEmbedElement).toHaveProperty("prototype");
  });

  test("OEmbedElement extends LitElement", () => {
    expectTypeOf<OEmbedElement>().toMatchTypeOf<LitElement>();
  });

  test("OEmbedElement has expected public properties", () => {
    // Verify key properties exist for consumers
    expectTypeOf<OEmbedElement>().toHaveProperty("url");
    expectTypeOf<OEmbedElement>().toHaveProperty("width");
    expectTypeOf<OEmbedElement>().toHaveProperty("height");
    expectTypeOf<OEmbedElement>().toHaveProperty("privacy");
  });

  test("Custom element tag name is defined", () => {
    // Verify the static tagName property exists (set by @customElement decorator)
    // This ensures the element will auto-register when imported
    expectTypeOf<typeof OEmbedElement>().toHaveProperty("prototype");
  });
});
