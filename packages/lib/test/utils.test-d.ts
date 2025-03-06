/**
 * Type tests for utility functions
 *
 * These tests verify type safety without running actual code.
 * They are executed during compilation to ensure proper type constraints.
 */

import { describe, expectTypeOf, test } from "vitest";
import type { EmbedProvider } from "../src/provider";
import {
  convertUrlToEmbedUrl,
  getProviderFromUrl,
  isRegExp,
  isString,
  matcher,
} from "../src/utils";

describe("Utility Functions Type Tests", () => {
  test("isString should be a type guard", () => {
    // Check function signature
    expectTypeOf(isString).toBeFunction();
    expectTypeOf(isString).parameters.toMatchTypeOf<[unknown]>();

    // Check return type is a type predicate
    expectTypeOf(isString).returns.toEqualTypeOf<boolean>();

    // Verify type narrowing behavior through conditional type
    type IsStringReturn<T> = T extends (val: unknown) => val is string
      ? true
      : false;
    type Result = IsStringReturn<typeof isString>;
    expectTypeOf<Result>().toEqualTypeOf<true>();
  });

  test("isRegExp should be a type guard", () => {
    // Check function signature
    expectTypeOf(isRegExp).toBeFunction();
    expectTypeOf(isRegExp).parameters.toMatchTypeOf<[unknown]>();

    // Check return type is a type predicate
    expectTypeOf(isRegExp).returns.toEqualTypeOf<boolean>();

    // Verify type narrowing behavior through conditional type
    type IsRegExpReturn<T> = T extends (val: unknown) => val is RegExp
      ? true
      : false;
    type Result = IsRegExpReturn<typeof isRegExp>;
    expectTypeOf<Result>().toEqualTypeOf<true>();
  });

  test("matcher should create correctly typed functions", () => {
    // Check function signature
    expectTypeOf(matcher).toBeFunction();
    expectTypeOf(matcher).parameters.toMatchTypeOf<[RegExp | string]>();

    // Check that it returns a function that takes a string and returns boolean
    expectTypeOf(matcher).returns.toBeFunction();
    expectTypeOf(matcher).returns.parameters.toMatchTypeOf<[string]>();
    expectTypeOf(matcher).returns.returns.toBeBoolean();

    // Test with string literal
    const stringMatcher = matcher("example");
    expectTypeOf(stringMatcher).toBeFunction();
    expectTypeOf(stringMatcher).parameters.toMatchTypeOf<[string]>();
    expectTypeOf(stringMatcher).returns.toBeBoolean();

    // Test with RegExp literal
    const regexMatcher = matcher(/example/);
    expectTypeOf(regexMatcher).toBeFunction();
    expectTypeOf(regexMatcher).parameters.toMatchTypeOf<[string]>();
    expectTypeOf(regexMatcher).returns.toBeBoolean();
  });

  test("getProviderFromUrl should have correct signature", () => {
    // Check function signature
    expectTypeOf(getProviderFromUrl).toBeFunction();
    expectTypeOf(getProviderFromUrl).parameters.toMatchTypeOf<[string]>();

    // Check return type
    expectTypeOf(getProviderFromUrl).returns.toEqualTypeOf<
      EmbedProvider | undefined
    >();
  });

  test("convertUrlToEmbedUrl should have correct signature", () => {
    // Check function signature
    expectTypeOf(convertUrlToEmbedUrl).toBeFunction();
    expectTypeOf(convertUrlToEmbedUrl).parameters.toMatchTypeOf<[string]>();

    // Check return type
    expectTypeOf(convertUrlToEmbedUrl).returns.toBeString();
  });
});
