/**
 * Type tests for main library exports
 *
 * These tests verify type safety without running actual code.
 * They are executed during compilation to ensure proper type constraints.
 */

import { describe, expectTypeOf, test } from "vitest";
import type { DangerousHtmlNode, EmbedOutput, UrlMatcher } from "../src";
import {
  ALL_MATCHERS,
  DailyMotionMatcher,
  EdPuzzleMatcher,
  LoomMatcher,
  MatcherRegistry,
  renderOutput,
  SpotifyMatcher,
  VimeoMatcher,
  WistiaMatcher,
  YouTubeMatcher,
} from "../src";

describe("Main Library Exports Type Tests", () => {
  test("MatcherRegistry should be properly exported", () => {
    // Check that MatcherRegistry is exported and has the right static methods
    expectTypeOf(MatcherRegistry.create).toBeFunction();
    expectTypeOf(MatcherRegistry.withDefaults).toBeFunction();

    // Check instance methods
    const registry = MatcherRegistry.withDefaults();
    expectTypeOf(registry.match).toBeFunction();
    expectTypeOf(registry.toEmbedUrl).toBeFunction();
    expectTypeOf(registry.toOutput).toBeFunction();
    expectTypeOf(registry.list).toBeFunction();
    expectTypeOf(registry.get).toBeFunction();
    expectTypeOf(registry.has).toBeFunction();
    expectTypeOf(registry.register).toBeFunction();
    expectTypeOf(registry.unregister).toBeFunction();
    expectTypeOf(registry.with).toBeFunction();
    expectTypeOf(registry.without).toBeFunction();
    expectTypeOf(registry.size).toBeNumber();
  });

  test("ALL_MATCHERS should be an array of matchers", () => {
    expectTypeOf(ALL_MATCHERS).toBeArray();
    expectTypeOf<(typeof ALL_MATCHERS)[number]>().toMatchTypeOf<UrlMatcher>();
  });

  test("renderOutput should be properly exported", () => {
    expectTypeOf(renderOutput).toBeFunction();
    expectTypeOf(renderOutput).parameters.toMatchTypeOf<
      [EmbedOutput | undefined]
    >();
    expectTypeOf(renderOutput).returns.toBeString();
  });

  test("matcher instances should be properly exported", () => {
    // Check that all matchers are exported and match the UrlMatcher type
    expectTypeOf(YouTubeMatcher).toMatchTypeOf<UrlMatcher>();
    expectTypeOf(SpotifyMatcher).toMatchTypeOf<UrlMatcher>();
    expectTypeOf(VimeoMatcher).toMatchTypeOf<UrlMatcher>();
    expectTypeOf(LoomMatcher).toMatchTypeOf<UrlMatcher>();
    expectTypeOf(DailyMotionMatcher).toMatchTypeOf<UrlMatcher>();
    expectTypeOf(EdPuzzleMatcher).toMatchTypeOf<UrlMatcher>();
    expectTypeOf(WistiaMatcher).toMatchTypeOf<UrlMatcher>();

    // Check specific matcher method signatures
    expectTypeOf(YouTubeMatcher.canMatch).toBeFunction();
    expectTypeOf(YouTubeMatcher.parse).toBeFunction();
    expectTypeOf(YouTubeMatcher.toEmbedUrl).toBeFunction();
    expectTypeOf(YouTubeMatcher.toOutput).toBeFunction();
  });

  test("DangerousHtmlNode should be properly exported", () => {
    // Verify the type has expected properties
    expectTypeOf<DangerousHtmlNode>().toHaveProperty("type");
    expectTypeOf<DangerousHtmlNode>().toHaveProperty("content");

    // Verify type property is exactly "dangerouslySetHtml"
    expectTypeOf<
      DangerousHtmlNode["type"]
    >().toEqualTypeOf<"dangerouslySetHtml">();

    // Verify content is a string
    expectTypeOf<DangerousHtmlNode["content"]>().toEqualTypeOf<string>();
  });
});
