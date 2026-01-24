/**
 * Tests for Result monad constructors.
 *
 * These test the `ok`, `err`, `noMatch`, `invalidFormat`, `missingId`,
 * `parseError`, and `unsupportedPrivacy` constructors.
 */

import { describe, expect, it } from "vitest";

import {
  err,
  invalidFormat,
  type MatchError,
  missingId,
  noMatch,
  ok,
  parseError,
  unsupportedPrivacy,
} from "../src";

describe("ok()", () => {
  it("should create successful result with value", () => {
    const result = ok({ id: "abc123" });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ id: "abc123" });
    }
  });

  it("should work with primitive values", () => {
    const strResult = ok("hello");
    const numResult = ok(42);

    expect(strResult.ok).toBe(true);
    expect(numResult.ok).toBe(true);
    if (strResult.ok) expect(strResult.value).toBe("hello");
    if (numResult.ok) expect(numResult.value).toBe(42);
  });

  it("should work with null/undefined values", () => {
    const nullResult = ok(null);
    const undefinedResult = ok(undefined);

    expect(nullResult.ok).toBe(true);
    expect(undefinedResult.ok).toBe(true);
    if (nullResult.ok) expect(nullResult.value).toBeNull();
    if (undefinedResult.ok) expect(undefinedResult.value).toBeUndefined();
  });
});

describe("err()", () => {
  it("should create failed result with error", () => {
    const error: MatchError = {
      code: "NO_MATCH",
      message: "Custom error",
    };
    const result = err(error);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("NO_MATCH");
      expect(result.error.message).toBe("Custom error");
    }
  });

  it("should preserve fatal flag", () => {
    const error: MatchError = {
      code: "INVALID_FORMAT",
      fatal: true,
      message: "Fatal error",
    };
    const result = err(error);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.fatal).toBe(true);
    }
  });
});

describe("noMatch()", () => {
  it("should create NO_MATCH error with default message", () => {
    const result = noMatch();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("NO_MATCH");
      expect(result.error.message).toBe("No pattern matched");
    }
  });

  it("should create NO_MATCH error with custom message", () => {
    const result = noMatch("URL format not recognized");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("NO_MATCH");
      expect(result.error.message).toBe("URL format not recognized");
    }
  });
});

describe("invalidFormat()", () => {
  it("should create INVALID_FORMAT error (non-fatal by default)", () => {
    const result = invalidFormat("Invalid video ID format");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("INVALID_FORMAT");
      expect(result.error.message).toBe("Invalid video ID format");
      expect(result.error.fatal).toBe(false);
    }
  });

  it("should create INVALID_FORMAT error with fatal=true", () => {
    const result = invalidFormat("Malformed URL structure", true);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("INVALID_FORMAT");
      expect(result.error.fatal).toBe(true);
    }
  });
});

describe("missingId()", () => {
  it("should create MISSING_ID error (non-fatal by default)", () => {
    const result = missingId("Video ID not found in URL");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("MISSING_ID");
      expect(result.error.message).toBe("Video ID not found in URL");
      expect(result.error.fatal).toBe(false);
    }
  });

  it("should create MISSING_ID error with fatal=true", () => {
    const result = missingId("Required ID missing from recognized URL", true);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("MISSING_ID");
      expect(result.error.fatal).toBe(true);
    }
  });
});

describe("parseError()", () => {
  it("should create PARSE_ERROR error", () => {
    const result = parseError("Failed to parse URL");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("PARSE_ERROR");
      expect(result.error.message).toBe("Failed to parse URL");
    }
  });

  it("should include URL in error message", () => {
    const result = parseError("Failed to parse URL: https://example.com/weird");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("https://example.com/weird");
    }
  });
});

describe("unsupportedPrivacy()", () => {
  it("should create UNSUPPORTED_PRIVACY error with matcher name", () => {
    const result = unsupportedPrivacy("DailyMotion");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("UNSUPPORTED_PRIVACY");
      expect(result.error.message).toContain("DailyMotion");
      expect(result.error.message).toContain("privacy-enhanced");
    }
  });

  it("should format message correctly for various matchers", () => {
    const ytResult = unsupportedPrivacy("YouTube");
    const spotResult = unsupportedPrivacy("Spotify");

    if (!ytResult.ok) {
      expect(ytResult.error.message).toBe(
        "YouTube does not support privacy-enhanced mode",
      );
    }
    if (!spotResult.ok) {
      expect(spotResult.error.message).toBe(
        "Spotify does not support privacy-enhanced mode",
      );
    }
  });
});

describe("Result type narrowing", () => {
  it("should narrow type correctly with ok discriminant", () => {
    const success = ok({ videoId: "abc123" });
    const failure = noMatch();

    // TypeScript should narrow types correctly
    if (success.ok) {
      // This should compile - value is available
      expect(success.value.videoId).toBe("abc123");
    }

    if (!failure.ok) {
      // This should compile - error is available
      expect(failure.error.code).toBe("NO_MATCH");
    }
  });
});
