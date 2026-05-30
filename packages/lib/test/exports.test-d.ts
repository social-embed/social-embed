/**
 * Export verification tests for package.json exports field.
 *
 * These tests verify that all subpath exports resolve correctly
 * and export the expected types. Critical for ensuring CDN and
 * bundler compatibility.
 */

import { describe, expectTypeOf, test } from "vitest";
import type { EmbedOutput, UrlMatcher } from "../src";
// Main entry point exports
import {
  ALL_MATCHERS,
  MatcherRegistry,
  renderOutput,
  YouTubeMatcher,
} from "../src";
import type { MountOptions } from "../src/browser";
// Browser subpath exports
import {
  clearScriptCache,
  defaultStore,
  match,
  mount,
  register,
  toEmbed,
  toEmbedUrl,
} from "../src/browser";

describe("Main Entry Exports (@social-embed/lib)", () => {
  test("exports MatcherRegistry class", () => {
    expectTypeOf(MatcherRegistry).toBeObject();
    expectTypeOf(MatcherRegistry.create).toBeFunction();
    expectTypeOf(MatcherRegistry.withDefaults).toBeFunction();
  });

  // Note: defaultRegistry was removed in v2 - use MatcherRegistry.withDefaults()

  test("exports ALL_MATCHERS array", () => {
    expectTypeOf(ALL_MATCHERS).toBeArray();
  });

  test("exports renderOutput function", () => {
    expectTypeOf(renderOutput).toBeFunction();
    expectTypeOf(renderOutput).parameters.toMatchTypeOf<
      [EmbedOutput | undefined]
    >();
    expectTypeOf(renderOutput).returns.toBeString();
  });

  test("exports individual matchers", () => {
    expectTypeOf(YouTubeMatcher).toMatchTypeOf<UrlMatcher>();
  });
});

describe("Browser Subpath Exports (@social-embed/lib/browser)", () => {
  test("exports mount function", () => {
    expectTypeOf(mount).toBeFunction();
    // mount(output, options) -> Promise<void>
    expectTypeOf(mount).returns.toMatchTypeOf<Promise<void>>();
  });

  test("exports clearScriptCache function", () => {
    expectTypeOf(clearScriptCache).toBeFunction();
    expectTypeOf(clearScriptCache).returns.toBeVoid();
  });

  test("exports MountOptions type", () => {
    // Verify MountOptions has expected properties
    expectTypeOf<MountOptions>().toHaveProperty("container");
    expectTypeOf<MountOptions>().toHaveProperty("mode");
  });

  test("exports defaultStore singleton", () => {
    expectTypeOf(defaultStore).toHaveProperty("register");
    expectTypeOf(defaultStore).toHaveProperty("unregister");
    expectTypeOf(defaultStore).toHaveProperty("match");
    expectTypeOf(defaultStore).toHaveProperty("subscribe");
    expectTypeOf(defaultStore).toHaveProperty("current");
  });

  test("exports register function with options support", () => {
    expectTypeOf(register).toBeFunction();
    // Should accept matcher and optional options parameter
    expectTypeOf(register).returns.toBeVoid();
  });

  test("exports toEmbedUrl function", () => {
    expectTypeOf(toEmbedUrl).toBeFunction();
    expectTypeOf(toEmbedUrl).returns.toMatchTypeOf<string | undefined>();
  });

  test("exports toEmbed function", () => {
    expectTypeOf(toEmbed).toBeFunction();
    // Returns Embed | undefined
  });

  test("exports match function", () => {
    expectTypeOf(match).toBeFunction();
    // Returns MatchResult
  });
});
