/**
 * Type tests for UrlMatcher interface
 *
 * These tests verify type safety without running actual code.
 * They are executed during compilation to ensure proper type constraints.
 */

import { describe, expectTypeOf, test } from "vitest";
import type {
  EmbedOutput,
  MatchContext,
  OutputOptions,
  PrivacyOptions,
  Result,
  UrlMatcher,
} from "../src";

describe("UrlMatcher Type Tests", () => {
  test("UrlMatcher interface should have required properties and methods", () => {
    type Matcher = UrlMatcher;

    // Test properties
    expectTypeOf<Matcher>().toHaveProperty("name");
    expectTypeOf<Matcher["name"]>().toBeString();

    // Test optional properties
    expectTypeOf<Matcher>().toHaveProperty("domains");
    expectTypeOf<Matcher>().toHaveProperty("schemes");
    expectTypeOf<Matcher>().toHaveProperty("supportsPrivacyMode");

    // Test methods
    expectTypeOf<Matcher>().toHaveProperty("canMatch");
    expectTypeOf<Matcher["canMatch"]>().toBeFunction();
    expectTypeOf<Matcher["canMatch"]>().parameters.toMatchTypeOf<
      [MatchContext]
    >();
    expectTypeOf<Matcher["canMatch"]>().returns.toBeBoolean();

    expectTypeOf<Matcher>().toHaveProperty("parse");
    expectTypeOf<Matcher["parse"]>().toBeFunction();
    expectTypeOf<Matcher["parse"]>().parameters.toMatchTypeOf<[MatchContext]>();
    expectTypeOf<Matcher["parse"]>().returns.toMatchTypeOf<Result<unknown>>();

    expectTypeOf<Matcher>().toHaveProperty("toEmbedUrl");
    expectTypeOf<Matcher["toEmbedUrl"]>().toBeFunction();
    expectTypeOf<Matcher["toEmbedUrl"]>().returns.toBeString();

    expectTypeOf<Matcher>().toHaveProperty("toOutput");
    expectTypeOf<Matcher["toOutput"]>().toBeFunction();
    expectTypeOf<Matcher["toOutput"]>().returns.toMatchTypeOf<EmbedOutput>();
  });

  test("UrlMatcher with generic parameters should maintain type safety", () => {
    // Test with specific type parameters
    type YouTubeData = { id: string };
    type YouTubeMatcher = UrlMatcher<"YouTube", YouTubeData>;

    expectTypeOf<YouTubeMatcher["name"]>().toEqualTypeOf<"YouTube">();

    // Parse should return Result<YouTubeData>
    type ParseResult = ReturnType<YouTubeMatcher["parse"]>;
    expectTypeOf<ParseResult>().toMatchTypeOf<Result<YouTubeData>>();
  });

  test("Matcher implementation should conform to interface", () => {
    // Mock implementation for testing
    const mockMatcher: UrlMatcher<"Test", { id: string }> = {
      canMatch(ctx: MatchContext): boolean {
        return ctx.host === "test.com";
      },
      domains: ["test.com"],
      name: "Test",

      parse(_ctx: MatchContext): Result<{ id: string }> {
        return { ok: true, value: { id: "test123" } };
      },
      supportsPrivacyMode: true,

      toEmbedUrl(data: { id: string }, _options?: PrivacyOptions): string {
        return `https://embed.test.com/${data.id}`;
      },

      toOutput(
        data: { id: string },
        options?: OutputOptions & PrivacyOptions,
      ): EmbedOutput {
        return {
          nodes: [
            {
              attributes: {
                height: String(options?.height ?? 315),
                width: String(options?.width ?? 560),
              },
              src: this.toEmbedUrl(data),
              type: "iframe",
            },
          ],
        };
      },
    };

    expectTypeOf(mockMatcher).toMatchTypeOf<UrlMatcher>();
    expectTypeOf(mockMatcher.name).toEqualTypeOf<"Test">();
    expectTypeOf(mockMatcher.canMatch).toBeFunction();
    expectTypeOf(mockMatcher.parse).toBeFunction();
    expectTypeOf(mockMatcher.toEmbedUrl).toBeFunction();
    expectTypeOf(mockMatcher.toOutput).toBeFunction();
  });
});
