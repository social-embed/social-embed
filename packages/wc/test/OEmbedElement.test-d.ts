/**
 * Type tests for OEmbedElement component
 *
 * These tests verify type safety without running actual code.
 * They are executed during compilation to ensure proper type constraints.
 */

import type { EmbedProvider } from "@social-embed/lib";
import type { LitElement, TemplateResult } from "lit";
import { describe, expectTypeOf, test } from "vitest";
import type { OEmbedElement } from "../src/OEmbedElement";

describe("OEmbedElement Type Tests", () => {
  test("OEmbedElement should extend LitElement", () => {
    // Test that OEmbedElement extends LitElement with proper inheritance
    expectTypeOf<OEmbedElement>().toMatchTypeOf<LitElement>();
  });

  test("OEmbedElement properties should have correct types", () => {
    // Test attribute-reflected properties
    expectTypeOf<OEmbedElement>().toHaveProperty("url");
    expectTypeOf<OEmbedElement["url"]>().toBeString();

    // Dimension properties
    expectTypeOf<OEmbedElement>().toHaveProperty("width");
    expectTypeOf<OEmbedElement["width"]>().toBeString();

    expectTypeOf<OEmbedElement>().toHaveProperty("height");
    expectTypeOf<OEmbedElement["height"]>().toBeString();

    // iframe attributes
    expectTypeOf<OEmbedElement>().toHaveProperty("frameborder");
    expectTypeOf<OEmbedElement["frameborder"]>().toBeString();

    expectTypeOf<OEmbedElement>().toHaveProperty("allowfullscreen");
    expectTypeOf<OEmbedElement["allowfullscreen"]>().toEqualTypeOf<
      string | boolean | undefined
    >();
  });

  test("OEmbedElement should have render methods for each provider", () => {
    // Define the expected render methods for providers
    const renderMethods = [
      "renderYouTube",
      "renderVimeo",
      "renderSpotify",
      "renderDailyMotion",
      "renderLoom",
      "renderEdPuzzle",
      "renderWistia",
    ] as const;

    // Test each render method
    for (const method of renderMethods) {
      expectTypeOf<OEmbedElement>().toHaveProperty(method);
    }

    // Test the main render method
    expectTypeOf<OEmbedElement>().toHaveProperty("render");
    expectTypeOf<
      OEmbedElement["render"]
    >().returns.toEqualTypeOf<TemplateResult>();
  });

  test("dimension methods should have correct signature", () => {
    // Test dimension calculation methods
    expectTypeOf<OEmbedElement>().toHaveProperty("getDefaultDimensions");
    expectTypeOf<OEmbedElement["getDefaultDimensions"]>().toBeFunction();

    expectTypeOf<OEmbedElement>().toHaveProperty("calculateDefaultDimensions");
    expectTypeOf<OEmbedElement["calculateDefaultDimensions"]>().toBeFunction();
  });

  test("Provider detection property should exist with correct type", () => {
    // Verify the provider property exists
    expectTypeOf<OEmbedElement>().toHaveProperty("provider");

    // The provider property should be of the correct type
    expectTypeOf<OEmbedElement["provider"]>().toEqualTypeOf<
      EmbedProvider | undefined
    >();
  });
});
