/**
 * Type tests for provider implementations
 *
 * These tests verify type safety without running actual code.
 * They are executed during compilation to ensure proper type constraints.
 */

import { describe, expectTypeOf, test } from "vitest";
import type { EmbedProvider } from "../src/provider";
// Import as types only
import type {
  DailyMotionProvider,
  EdPuzzleProvider,
  LoomProvider,
  SpotifyProvider,
  VimeoProvider,
  WistiaProvider,
  YouTubeProvider,
} from "../src/providers";

describe("Provider Implementations Type Tests", () => {
  test("Provider types should conform to EmbedProvider interface", () => {
    // Just test the types without instantiating
    expectTypeOf<YouTubeProvider>().toMatchTypeOf<EmbedProvider>();
    expectTypeOf<VimeoProvider>().toMatchTypeOf<EmbedProvider>();
    expectTypeOf<SpotifyProvider>().toMatchTypeOf<EmbedProvider>();
    expectTypeOf<DailyMotionProvider>().toMatchTypeOf<EmbedProvider>();
    expectTypeOf<LoomProvider>().toMatchTypeOf<EmbedProvider>();
    expectTypeOf<WistiaProvider>().toMatchTypeOf<EmbedProvider>();
    expectTypeOf<EdPuzzleProvider>().toMatchTypeOf<EmbedProvider>();
  });

  test("YouTube provider type should have the correct method signatures", () => {
    // No instantiation, just check the type structure
    expectTypeOf<YouTubeProvider>().toHaveProperty("name");
    expectTypeOf<YouTubeProvider["canParseUrl"]>().parameters.toEqualTypeOf<
      [url: string]
    >();
    expectTypeOf<YouTubeProvider["canParseUrl"]>().returns.toBeBoolean();
    expectTypeOf<YouTubeProvider["getIdFromUrl"]>().parameters.toEqualTypeOf<
      [url: string]
    >();
    expectTypeOf<YouTubeProvider["getIdFromUrl"]>().returns.toBeString();
    expectTypeOf<
      YouTubeProvider["getEmbedUrlFromId"]
    >().parameters.toEqualTypeOf<[id: string]>();
    expectTypeOf<YouTubeProvider["getEmbedUrlFromId"]>().returns.toBeString();
  });

  test("Spotify provider type should handle array return for getIdFromUrl", () => {
    // No instantiation, just check the type structure
    expectTypeOf<SpotifyProvider["getIdFromUrl"]>().parameters.toEqualTypeOf<
      [url: string]
    >();
    expectTypeOf<SpotifyProvider["getIdFromUrl"]>().returns.toEqualTypeOf<
      string[]
    >();

    // Spotify's getEmbedUrlFromId requires multiple arguments
    expectTypeOf<
      SpotifyProvider["getEmbedUrlFromId"]
    >().parameters.toEqualTypeOf<[id: string, type: string]>();
    expectTypeOf<SpotifyProvider["getEmbedUrlFromId"]>().returns.toBeString();
  });

  // Helper type to test utility functions
  test("Provider utility functions should have correct types", () => {
    // Type checking for YouTube utility functions
    expectTypeOf(getYouTubeIdFromUrl).toBeFunction();
    expectTypeOf(getYouTubeIdFromUrl).parameters.toEqualTypeOf<[url: string]>();
    expectTypeOf(getYouTubeIdFromUrl).returns.toBeString();

    expectTypeOf(getYouTubeEmbedUrlFromId).toBeFunction();
    expectTypeOf(getYouTubeEmbedUrlFromId).parameters.toEqualTypeOf<
      [id: string]
    >();
    expectTypeOf(getYouTubeEmbedUrlFromId).returns.toBeString();

    // Type checking for Spotify utility functions
    expectTypeOf(getSpotifyIdAndTypeFromUrl).toBeFunction();
    expectTypeOf(getSpotifyIdAndTypeFromUrl).parameters.toEqualTypeOf<
      [url: string]
    >();
    expectTypeOf(getSpotifyIdAndTypeFromUrl).returns.toMatchTypeOf<
      [string, string] | []
    >();

    expectTypeOf(getSpotifyEmbedUrlFromIdAndType).toBeFunction();
    expectTypeOf(getSpotifyEmbedUrlFromIdAndType).parameters.toEqualTypeOf<
      [id: string, type: string]
    >();
    expectTypeOf(getSpotifyEmbedUrlFromIdAndType).returns.toBeString();
  });
});

// Import utility functions for type checking
import {
  getSpotifyEmbedUrlFromIdAndType,
  getSpotifyIdAndTypeFromUrl,
  getYouTubeEmbedUrlFromId,
  getYouTubeIdFromUrl,
} from "../src";
