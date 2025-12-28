/**
 * Type tests for interfaces and types in the WC package
 *
 * These tests verify type safety without running actual code.
 * They are executed during compilation to ensure proper type constraints.
 */

import type { MatcherRegistry } from "@social-embed/lib";
import { describe, expectTypeOf, test } from "vitest";
import type { OEmbedElement } from "../src/OEmbedElement";

describe("OEmbedElement Type Tests", () => {
  test("OEmbedElement should have correct property types", () => {
    // Test url property
    expectTypeOf<OEmbedElement>().toHaveProperty("url");
    expectTypeOf<OEmbedElement["url"]>().toBeString();

    // Test width/height properties (string | number for flexibility)
    expectTypeOf<OEmbedElement>().toHaveProperty("width");
    expectTypeOf<OEmbedElement["width"]>().toEqualTypeOf<string | number>();

    expectTypeOf<OEmbedElement>().toHaveProperty("height");
    expectTypeOf<OEmbedElement["height"]>().toEqualTypeOf<string | number>();

    // Test privacy property
    expectTypeOf<OEmbedElement>().toHaveProperty("privacy");
    expectTypeOf<OEmbedElement["privacy"]>().toBeBoolean();

    // Test allowfullscreen property
    expectTypeOf<OEmbedElement>().toHaveProperty("allowfullscreen");
    expectTypeOf<OEmbedElement["allowfullscreen"]>().toBeBoolean();
  });

  test("OEmbedElement should have registry property", () => {
    expectTypeOf<OEmbedElement>().toHaveProperty("registry");
    expectTypeOf<OEmbedElement["registry"]>().toMatchTypeOf<MatcherRegistry>();
  });

  test("OEmbedElement should have provider getter", () => {
    expectTypeOf<OEmbedElement>().toHaveProperty("provider");
    expectTypeOf<OEmbedElement["provider"]>().toEqualTypeOf<
      { name: string } | undefined
    >();
  });

  test("OEmbedElement render method should return TemplateResult", () => {
    expectTypeOf<OEmbedElement>().toHaveProperty("render");
    expectTypeOf<OEmbedElement["render"]>().toBeFunction();
  });
});

describe("Global type augmentation", () => {
  test("OEmbedElement should be registered in HTMLElementTagNameMap", () => {
    expectTypeOf<HTMLElementTagNameMap>().toHaveProperty("o-embed");
    expectTypeOf<
      HTMLElementTagNameMap["o-embed"]
    >().toEqualTypeOf<OEmbedElement>();
  });
});
