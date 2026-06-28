/**
 * Type tests for MatcherRegistry
 *
 * These tests verify type safety without running actual code.
 * They are executed during compilation to ensure proper type constraints.
 */

import { describe, expectTypeOf, test } from "vitest";
import type {
  EmbedOutput,
  MatchResult,
  PrivacyOptions,
  UrlMatcher,
} from "../src";
import { MatcherRegistry } from "../src";

describe("MatcherRegistry Type Tests", () => {
  test("MatcherRegistry should have correct static methods", () => {
    // Test static factory methods
    expectTypeOf(MatcherRegistry.create).toBeFunction();
    expectTypeOf(MatcherRegistry.withDefaults).toBeFunction();

    // create() should accept optional matchers array
    expectTypeOf(MatcherRegistry.create).parameters.toMatchTypeOf<
      [matchers?: unknown[], options?: unknown]
    >();
    expectTypeOf(
      MatcherRegistry.create,
    ).returns.toMatchTypeOf<MatcherRegistry>();

    // withDefaults() should take no parameters
    expectTypeOf(MatcherRegistry.withDefaults).parameters.toEqualTypeOf<[]>();
    expectTypeOf(
      MatcherRegistry.withDefaults,
    ).returns.toMatchTypeOf<MatcherRegistry>();
  });

  test("MatcherRegistry instance should have correct methods", () => {
    type Registry = MatcherRegistry;

    // Test match method
    expectTypeOf<Registry["match"]>().toBeFunction();
    expectTypeOf<Registry["match"]>().parameters.toEqualTypeOf<[url: string]>();
    expectTypeOf<Registry["match"]>().returns.toMatchTypeOf<MatchResult>();

    // Test toEmbedUrl method
    expectTypeOf<Registry["toEmbedUrl"]>().toBeFunction();
    expectTypeOf<Registry["toEmbedUrl"]>().parameters.toMatchTypeOf<
      [url: string, options?: PrivacyOptions]
    >();
    expectTypeOf<Registry["toEmbedUrl"]>().returns.toEqualTypeOf<
      string | undefined
    >();

    // Test toOutput method
    expectTypeOf<Registry["toOutput"]>().toBeFunction();
    expectTypeOf<Registry["toOutput"]>().returns.toEqualTypeOf<
      EmbedOutput | undefined
    >();

    // Test list method
    expectTypeOf<Registry["list"]>().toBeFunction();
    expectTypeOf<Registry["list"]>().parameters.toEqualTypeOf<[]>();
    expectTypeOf<Registry["list"]>().returns.toEqualTypeOf<UrlMatcher[]>();

    // Test get method
    expectTypeOf<Registry["get"]>().toBeFunction();
    expectTypeOf<Registry["get"]>().parameters.toEqualTypeOf<[name: string]>();
    expectTypeOf<Registry["get"]>().returns.toEqualTypeOf<
      UrlMatcher | undefined
    >();

    // Test has method
    expectTypeOf<Registry["has"]>().toBeFunction();
    expectTypeOf<Registry["has"]>().parameters.toEqualTypeOf<[name: string]>();
    expectTypeOf<Registry["has"]>().returns.toBeBoolean();

    // Test size property
    expectTypeOf<Registry["size"]>().toBeNumber();

    // Test immutable composition methods (MatcherRegistry is immutable by design)
    expectTypeOf<Registry["with"]>().toBeFunction();
    expectTypeOf<Registry["without"]>().toBeFunction();
  });

  test("MatcherRegistry should work with matcher instances", () => {
    // Create mock matcher type for testing
    type MockMatcher = UrlMatcher<"Mock", { id: string }>;

    // Check that MockMatcher satisfies UrlMatcher interface
    expectTypeOf<MockMatcher>().toMatchTypeOf<UrlMatcher>();

    // Verify with() returns a new MatcherRegistry
    const registry = MatcherRegistry.withDefaults();
    expectTypeOf(registry.with).returns.toMatchTypeOf<MatcherRegistry>();

    // Verify without() returns a new MatcherRegistry
    expectTypeOf(registry.without).returns.toMatchTypeOf<MatcherRegistry>();
  });
});
