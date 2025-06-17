/**
 * Type tests for EmbedProvider interface
 *
 * These tests verify type safety without running actual code.
 * They are executed during compilation to ensure proper type constraints.
 */

import { describe, expectTypeOf, test } from "vitest";
import type { EmbedProvider } from "../src/provider";

describe("EmbedProvider Type Tests", () => {
  test("EmbedProvider interface should have required properties and methods", () => {
    type Provider = EmbedProvider;

    // Test properties
    expectTypeOf<Provider>().toHaveProperty("name");
    expectTypeOf<Provider["name"]>().toBeString();

    // Test methods
    expectTypeOf<Provider>().toHaveProperty("canParseUrl");
    expectTypeOf<Provider["canParseUrl"]>().toBeFunction();
    expectTypeOf<Provider["canParseUrl"]>().parameters.toMatchTypeOf<
      [string]
    >();
    expectTypeOf<Provider["canParseUrl"]>().returns.toBeBoolean();

    expectTypeOf<Provider>().toHaveProperty("getIdFromUrl");
    expectTypeOf<Provider["getIdFromUrl"]>().toBeFunction();
    expectTypeOf<Provider["getIdFromUrl"]>().parameters.toMatchTypeOf<
      [string]
    >();
    expectTypeOf<Provider["getIdFromUrl"]>().returns.toMatchTypeOf<
      string | string[]
    >();

    expectTypeOf<Provider>().toHaveProperty("getEmbedUrlFromId");
    expectTypeOf<Provider["getEmbedUrlFromId"]>().toBeFunction();
    expectTypeOf<Provider["getEmbedUrlFromId"]>().parameters.toMatchTypeOf<
      [string, ...unknown[]]
    >();
    expectTypeOf<Provider["getEmbedUrlFromId"]>().returns.toBeString();
  });

  test("Provider implementation should conform to interface", () => {
    // Mock implementation for testing
    const mockProvider: EmbedProvider = {
      canParseUrl(url: string): boolean {
        try {
          // Properly parse the URL and check the hostname
          const parsedUrl = new URL(url);
          // Check if hostname is exactly test.com or ends with .test.com
          return (
            parsedUrl.hostname === "test.com" ||
            parsedUrl.hostname.endsWith(".test.com")
          );
        } catch {
          // Invalid URL format
          return false;
        }
      },
      getEmbedUrlFromId(id: string): string {
        return `https://embed.test.com/${id}`;
      },
      getIdFromUrl(url: string): string {
        try {
          const parsedUrl = new URL(url);
          const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
          return pathParts.length > 0 ? pathParts[pathParts.length - 1] : "";
        } catch {
          // Fallback to simple string manipulation if URL is invalid
          return url.split("/").pop() || "";
        }
      },
      name: "TestProvider",
    };

    expectTypeOf(mockProvider).toMatchTypeOf<EmbedProvider>();
    expectTypeOf(mockProvider.name).toBeString();
    expectTypeOf(mockProvider.canParseUrl).toBeFunction();
    expectTypeOf(mockProvider.getIdFromUrl).toBeFunction();
    expectTypeOf(mockProvider.getEmbedUrlFromId).toBeFunction();
  });
});
