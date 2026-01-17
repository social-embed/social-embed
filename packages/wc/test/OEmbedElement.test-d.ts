/**
 * Type tests for OEmbedElement component
 *
 * These tests verify type safety without running actual code.
 * They are executed during compilation to ensure proper type constraints.
 */

import type { MatcherRegistry } from "@social-embed/lib";
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

    // Dimension properties (string | number for flexibility)
    expectTypeOf<OEmbedElement>().toHaveProperty("width");
    expectTypeOf<OEmbedElement["width"]>().toEqualTypeOf<string | number>();

    expectTypeOf<OEmbedElement>().toHaveProperty("height");
    expectTypeOf<OEmbedElement["height"]>().toEqualTypeOf<string | number>();

    // allowfullscreen (now boolean)
    expectTypeOf<OEmbedElement>().toHaveProperty("allowfullscreen");
    expectTypeOf<OEmbedElement["allowfullscreen"]>().toBeBoolean();

    // privacy option
    expectTypeOf<OEmbedElement>().toHaveProperty("privacy");
    expectTypeOf<OEmbedElement["privacy"]>().toBeBoolean();
  });

  test("OEmbedElement should have registry property", () => {
    expectTypeOf<OEmbedElement>().toHaveProperty("registry");
    expectTypeOf<OEmbedElement["registry"]>().toMatchTypeOf<MatcherRegistry>();
  });

  test("OEmbedElement should have render method", () => {
    expectTypeOf<OEmbedElement>().toHaveProperty("render");
    expectTypeOf<
      OEmbedElement["render"]
    >().returns.toEqualTypeOf<TemplateResult>();
  });

  test("Provider detection property should exist with correct type", () => {
    // Verify the provider property exists
    expectTypeOf<OEmbedElement>().toHaveProperty("provider");

    // The provider property should be of the correct type
    expectTypeOf<OEmbedElement["provider"]>().toEqualTypeOf<
      { name: string } | undefined
    >();
  });
});
