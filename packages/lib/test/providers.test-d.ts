/**
 * Type tests for matcher implementations
 *
 * These tests verify type safety without running actual code.
 * They are executed during compilation to ensure proper type constraints.
 */

import { describe, expectTypeOf, test } from "vitest";
import type { UrlMatcher } from "../src";
import {
  DailyMotionMatcher,
  EdPuzzleMatcher,
  LoomMatcher,
  SpotifyMatcher,
  VimeoMatcher,
  WistiaMatcher,
  YouTubeMatcher,
} from "../src";

describe("Matcher Implementations Type Tests", () => {
  test("All matchers should conform to UrlMatcher interface", () => {
    expectTypeOf(YouTubeMatcher).toMatchTypeOf<UrlMatcher>();
    expectTypeOf(VimeoMatcher).toMatchTypeOf<UrlMatcher>();
    expectTypeOf(SpotifyMatcher).toMatchTypeOf<UrlMatcher>();
    expectTypeOf(DailyMotionMatcher).toMatchTypeOf<UrlMatcher>();
    expectTypeOf(LoomMatcher).toMatchTypeOf<UrlMatcher>();
    expectTypeOf(WistiaMatcher).toMatchTypeOf<UrlMatcher>();
    expectTypeOf(EdPuzzleMatcher).toMatchTypeOf<UrlMatcher>();
  });

  test("YouTube matcher should have correct name literal type", () => {
    expectTypeOf(YouTubeMatcher.name).toEqualTypeOf<"YouTube">();
    expectTypeOf(YouTubeMatcher.domains).toMatchTypeOf<readonly string[]>();
    expectTypeOf(YouTubeMatcher.supportsPrivacyMode).toEqualTypeOf<true>();
  });

  test("Spotify matcher should have correct name and schemes", () => {
    expectTypeOf(SpotifyMatcher.name).toEqualTypeOf<"Spotify">();
    expectTypeOf(SpotifyMatcher.domains).toMatchTypeOf<readonly string[]>();
    expectTypeOf(SpotifyMatcher.schemes).toMatchTypeOf<
      readonly string[] | undefined
    >();
  });

  test("All matchers should have required methods", () => {
    // Check YouTube matcher methods
    expectTypeOf(YouTubeMatcher.canMatch).toBeFunction();
    expectTypeOf(YouTubeMatcher.parse).toBeFunction();
    expectTypeOf(YouTubeMatcher.toEmbedUrl).toBeFunction();
    expectTypeOf(YouTubeMatcher.toOutput).toBeFunction();

    // Check Spotify matcher methods
    expectTypeOf(SpotifyMatcher.canMatch).toBeFunction();
    expectTypeOf(SpotifyMatcher.parse).toBeFunction();
    expectTypeOf(SpotifyMatcher.toEmbedUrl).toBeFunction();
    expectTypeOf(SpotifyMatcher.toOutput).toBeFunction();

    // Check Vimeo matcher methods
    expectTypeOf(VimeoMatcher.canMatch).toBeFunction();
    expectTypeOf(VimeoMatcher.parse).toBeFunction();
    expectTypeOf(VimeoMatcher.toEmbedUrl).toBeFunction();
    expectTypeOf(VimeoMatcher.toOutput).toBeFunction();
  });
});
