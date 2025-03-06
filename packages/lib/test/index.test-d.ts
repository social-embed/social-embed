/**
 * Type tests for main library exports
 *
 * These tests verify type safety without running actual code.
 * They are executed during compilation to ensure proper type constraints.
 */

import { describe, expectTypeOf, test } from "vitest";
import {
  DailyMotionProvider,
  EdPuzzleProvider,
  LoomProvider,
  SpotifyProvider,
  VimeoProvider,
  WistiaProvider,
  YouTubeProvider,
  convertUrlToEmbedUrl,
  defaultProviders,
  defaultRegistry,
  getProviderFromUrl,
} from "../src";
import type { EmbedProvider } from "../src/provider";
import type { EmbedProviderRegistry } from "../src/registry";

describe("Main Library Exports Type Tests", () => {
  test("defaultRegistry should be properly exported", () => {
    // Check that defaultRegistry is exported and has the right type
    expectTypeOf(defaultRegistry).toMatchTypeOf<EmbedProviderRegistry>();

    // Check the methods are available
    expectTypeOf(defaultRegistry.register).toBeFunction();
    expectTypeOf(defaultRegistry.listProviders).toBeFunction();
    expectTypeOf(defaultRegistry.getProviderByName).toBeFunction();
    expectTypeOf(defaultRegistry.findProviderByUrl).toBeFunction();
  });

  test("defaultProviders should be an array of providers", () => {
    // Check that defaultProviders is exported as expected
    expectTypeOf(defaultProviders).toBeArray();
    expectTypeOf(defaultProviders).toMatchTypeOf<EmbedProvider[]>();

    // Check that the array has content
    expectTypeOf<(typeof defaultProviders)[0]>().toMatchTypeOf<EmbedProvider>();
  });

  test("utility functions should be properly exported", () => {
    // Check getProviderFromUrl
    expectTypeOf(getProviderFromUrl).toBeFunction();
    expectTypeOf(getProviderFromUrl).parameters.toMatchTypeOf<[string]>();
    expectTypeOf(getProviderFromUrl).returns.toEqualTypeOf<
      EmbedProvider | undefined
    >();

    // Check convertUrlToEmbedUrl
    expectTypeOf(convertUrlToEmbedUrl).toBeFunction();
    expectTypeOf(convertUrlToEmbedUrl).parameters.toMatchTypeOf<[string]>();
    expectTypeOf(convertUrlToEmbedUrl).returns.toBeString();
  });

  test("provider classes should be properly exported", () => {
    // Check that all providers are exported and match the EmbedProvider type
    expectTypeOf(YouTubeProvider).toMatchTypeOf<EmbedProvider>();
    expectTypeOf(SpotifyProvider).toMatchTypeOf<EmbedProvider>();
    expectTypeOf(VimeoProvider).toMatchTypeOf<EmbedProvider>();
    expectTypeOf(LoomProvider).toMatchTypeOf<EmbedProvider>();
    expectTypeOf(DailyMotionProvider).toMatchTypeOf<EmbedProvider>();
    expectTypeOf(EdPuzzleProvider).toMatchTypeOf<EmbedProvider>();
    expectTypeOf(WistiaProvider).toMatchTypeOf<EmbedProvider>();

    // Check specific provider method signatures
    expectTypeOf(YouTubeProvider.canParseUrl).toBeFunction();
    expectTypeOf(YouTubeProvider.getIdFromUrl).toBeFunction();
    expectTypeOf(YouTubeProvider.getEmbedUrlFromId).toBeFunction();
  });
});
