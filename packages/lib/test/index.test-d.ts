/**
 * Type tests for main library exports
 *
 * These tests verify type safety without running actual code.
 * They are executed during compilation to ensure proper type constraints.
 */

import { describe, expectTypeOf, test } from "vitest";
import {
  convertUrlToEmbedUrl,
  DailyMotionProvider,
  defaultProviders,
  defaultRegistry,
  EdPuzzleProvider,
  getProviderFromUrl,
  LoomProvider,
  SpotifyProvider,
  VimeoProvider,
  WistiaProvider,
  YouTubeProvider,
} from "../src";
import type { EmbedProvider } from "../src/provider";
import type { EmbedProviderRegistry } from "../src/registry";

describe("Main Library Exports Type Tests", () => {
  test("defaultRegistry should be properly exported", () => {
    // Check that defaultRegistry is exported and has the right type
    expectTypeOf(defaultRegistry).toExtend<EmbedProviderRegistry>();

    // Check the methods are available
    expectTypeOf(defaultRegistry.register).toBeFunction();
    expectTypeOf(defaultRegistry.listProviders).toBeFunction();
    expectTypeOf(defaultRegistry.getProviderByName).toBeFunction();
    expectTypeOf(defaultRegistry.findProviderByUrl).toBeFunction();
  });

  test("defaultProviders should be an array of providers", () => {
    // Check that defaultProviders is exported as expected
    expectTypeOf(defaultProviders).toBeArray();
    expectTypeOf(defaultProviders).toExtend<EmbedProvider[]>();

    // Check that the array has content
    expectTypeOf<(typeof defaultProviders)[0]>().toExtend<EmbedProvider>();
  });

  test("utility functions should be properly exported", () => {
    // Check getProviderFromUrl
    expectTypeOf(getProviderFromUrl).toBeFunction();
    expectTypeOf(getProviderFromUrl).parameters.toExtend<[string]>();
    expectTypeOf(getProviderFromUrl).returns.toEqualTypeOf<
      EmbedProvider | undefined
    >();

    // Check convertUrlToEmbedUrl
    expectTypeOf(convertUrlToEmbedUrl).toBeFunction();
    expectTypeOf(convertUrlToEmbedUrl).parameters.toExtend<[string]>();
    expectTypeOf(convertUrlToEmbedUrl).returns.toBeString();
  });

  test("provider classes should be properly exported", () => {
    // Check that all providers are exported and match the EmbedProvider type
    expectTypeOf(YouTubeProvider).toExtend<EmbedProvider>();
    expectTypeOf(SpotifyProvider).toExtend<EmbedProvider>();
    expectTypeOf(VimeoProvider).toExtend<EmbedProvider>();
    expectTypeOf(LoomProvider).toExtend<EmbedProvider>();
    expectTypeOf(DailyMotionProvider).toExtend<EmbedProvider>();
    expectTypeOf(EdPuzzleProvider).toExtend<EmbedProvider>();
    expectTypeOf(WistiaProvider).toExtend<EmbedProvider>();

    // Check specific provider method signatures
    expectTypeOf(YouTubeProvider.canParseUrl).toBeFunction();
    expectTypeOf(YouTubeProvider.getIdFromUrl).toBeFunction();
    expectTypeOf(YouTubeProvider.getEmbedUrlFromId).toBeFunction();
  });
});
