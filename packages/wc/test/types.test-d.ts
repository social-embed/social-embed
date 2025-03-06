/**
 * Type tests for interfaces and types in the WC package
 *
 * These tests verify type safety without running actual code.
 * They are executed during compilation to ensure proper type constraints.
 */

import type { TemplateResult } from "lit";
import { describe, expectTypeOf, test } from "vitest";
import type { OEmbedElement } from "../src/OEmbedElement";

describe("Dimensions Type Tests", () => {
  test("Dimensions interface should have required properties with correct types", () => {
    // Use type directly from instance methods return signatures
    type Dimensions = ReturnType<OEmbedElement["getDefaultDimensions"]>;

    // Required properties
    expectTypeOf<Dimensions>().toHaveProperty("width");
    expectTypeOf<Dimensions["width"]>().toBeString();

    expectTypeOf<Dimensions>().toHaveProperty("height");
    expectTypeOf<Dimensions["height"]>().toBeString();

    // Optional properties with units
    expectTypeOf<Dimensions>().toHaveProperty("widthWithUnits");
    expectTypeOf<Dimensions["widthWithUnits"]>().toEqualTypeOf<
      string | undefined
    >();

    expectTypeOf<Dimensions>().toHaveProperty("heightWithUnits");
    expectTypeOf<Dimensions["heightWithUnits"]>().toEqualTypeOf<
      string | undefined
    >();
  });

  test("OEmbedElement should have dimension-related static properties", () => {
    // Test known existing static properties with dimensions
    expectTypeOf<typeof OEmbedElement>().toHaveProperty(
      "spotifyDefaultDimensions",
    );
    expectTypeOf<typeof OEmbedElement>().toHaveProperty(
      "vimeoDefaultDimensions",
    );
    expectTypeOf<typeof OEmbedElement>().toHaveProperty(
      "loomDefaultDimensions",
    );
    expectTypeOf<typeof OEmbedElement>().toHaveProperty(
      "wistiaDefaultDimensions",
    );
    expectTypeOf<typeof OEmbedElement>().toHaveProperty(
      "edPuzzleDefaultDimensions",
    );
  });

  test("OEmbedElement should have dimension calculation methods with correct signatures", () => {
    // Test getDefaultDimensions method
    expectTypeOf<OEmbedElement>().toHaveProperty("getDefaultDimensions");
    expectTypeOf<OEmbedElement["getDefaultDimensions"]>().toBeFunction();
    // Should return a Dimensions object
    expectTypeOf<
      OEmbedElement["getDefaultDimensions"]
    >().returns.toHaveProperty("width");
    expectTypeOf<
      OEmbedElement["getDefaultDimensions"]
    >().returns.toHaveProperty("height");

    // Test calculateDefaultDimensions method
    expectTypeOf<OEmbedElement>().toHaveProperty("calculateDefaultDimensions");
    expectTypeOf<OEmbedElement["calculateDefaultDimensions"]>().toBeFunction();

    // Should return a Dimensions object
    expectTypeOf<
      OEmbedElement["calculateDefaultDimensions"]
    >().returns.toHaveProperty("width");
    expectTypeOf<
      OEmbedElement["calculateDefaultDimensions"]
    >().returns.toHaveProperty("height");

    // Test instanceStyle method
    expectTypeOf<OEmbedElement>().toHaveProperty("instanceStyle");
    expectTypeOf<OEmbedElement["instanceStyle"]>().toBeFunction();
    // Should return a TemplateResult
    expectTypeOf<
      OEmbedElement["instanceStyle"]
    >().returns.toEqualTypeOf<TemplateResult>();
  });
});
