/**
 * Type tests for EmbedProviderRegistry
 *
 * These tests verify type safety without running actual code.
 * They are executed during compilation to ensure proper type constraints.
 */

import { describe, expectTypeOf, test } from "vitest";
import type { EmbedProvider } from "../src/provider";
import type { EmbedProviderRegistry } from "../src/registry";

describe("EmbedProviderRegistry Type Tests", () => {
  test("EmbedProviderRegistry should have correct methods", () => {
    type Registry = EmbedProviderRegistry;

    // Test register method
    expectTypeOf<Registry>().toHaveProperty("register");
    expectTypeOf<Registry["register"]>().toBeFunction();
    expectTypeOf<Registry["register"]>().parameters.toEqualTypeOf<
      [provider: EmbedProvider]
    >();
    expectTypeOf<Registry["register"]>().returns.toBeVoid();

    // Test listProviders method
    expectTypeOf<Registry>().toHaveProperty("listProviders");
    expectTypeOf<Registry["listProviders"]>().toBeFunction();
    expectTypeOf<Registry["listProviders"]>().parameters.toEqualTypeOf<[]>();
    expectTypeOf<Registry["listProviders"]>().returns.toEqualTypeOf<
      EmbedProvider[]
    >();

    // Test getProviderByName method
    expectTypeOf<Registry>().toHaveProperty("getProviderByName");
    expectTypeOf<Registry["getProviderByName"]>().toBeFunction();
    expectTypeOf<Registry["getProviderByName"]>().parameters.toEqualTypeOf<
      [name: string]
    >();
    expectTypeOf<Registry["getProviderByName"]>().returns.toEqualTypeOf<
      EmbedProvider | undefined
    >();

    // Test findProviderByUrl method
    expectTypeOf<Registry>().toHaveProperty("findProviderByUrl");
    expectTypeOf<Registry["findProviderByUrl"]>().toBeFunction();
    expectTypeOf<Registry["findProviderByUrl"]>().parameters.toEqualTypeOf<
      [url: string]
    >();
    expectTypeOf<Registry["findProviderByUrl"]>().returns.toEqualTypeOf<
      EmbedProvider | undefined
    >();
  });

  test("EmbedProviderRegistry should work with provider instances", () => {
    // Create mock provider type for testing
    type MockProvider = {
      name: string;
      canParseUrl: (url: string) => boolean;
      getIdFromUrl: (url: string) => string;
      getEmbedUrlFromId: (id: string) => string;
    };

    // Check that MockProvider satisfies EmbedProvider interface
    expectTypeOf<MockProvider>().toMatchTypeOf<EmbedProvider>();

    // Check method parameter and return types
    type RegistryClass = EmbedProviderRegistry;

    // Check that register accepts our mock provider
    expectTypeOf<RegistryClass["register"]>().parameters.toEqualTypeOf<
      [provider: EmbedProvider]
    >();

    // Check return type of getProviderByName
    type ProviderByNameResult = ReturnType<RegistryClass["getProviderByName"]>;
    expectTypeOf<ProviderByNameResult>().toEqualTypeOf<
      EmbedProvider | undefined
    >();

    // Check return type of findProviderByUrl
    type FindProviderResult = ReturnType<RegistryClass["findProviderByUrl"]>;
    expectTypeOf<FindProviderResult>().toEqualTypeOf<
      EmbedProvider | undefined
    >();
  });
});
