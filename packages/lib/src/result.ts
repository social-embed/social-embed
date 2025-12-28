/**
 * Result type for explicit error handling.
 * Inspired by Rust's Result<T, E> and functional programming patterns.
 *
 * @remarks
 * This replaces implicit null/undefined returns with explicit success/error states.
 * Use `ok` discriminant for type narrowing:
 *
 * @example
 * ```typescript
 * const result = registry.match(url);
 * if (result.ok) {
 *   // TypeScript knows: result.value is available
 *   console.log(result.value);
 * } else {
 *   // TypeScript knows: result.error is available
 *   console.log(result.error.code);
 * }
 * ```
 */
export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: MatchError };

/**
 * Error codes for match failures.
 *
 * @remarks
 * - `NO_MATCH`: URL doesn't match any pattern for this matcher
 * - `INVALID_FORMAT`: URL matches pattern but is malformed
 * - `MISSING_ID`: URL pattern matched but ID extraction failed
 * - `PARSE_ERROR`: General parsing failure (e.g., URL API threw)
 */
export type MatchErrorCode =
  | "NO_MATCH"
  | "INVALID_FORMAT"
  | "MISSING_ID"
  | "PARSE_ERROR";

/**
 * Structured error for match failures.
 *
 * @remarks
 * Provides machine-readable `code` for programmatic handling
 * and human-readable `message` for debugging/logging.
 */
export interface MatchError {
  /** Machine-readable error code */
  code: MatchErrorCode;

  /** Human-readable error message */
  message: string;

  /**
   * If true, no other matcher should attempt this URL.
   * Used when a URL definitely belongs to a provider but is malformed.
   *
   * @example
   * A YouTube URL with an invalid video ID would be fatal=true,
   * since it's definitely YouTube but cannot be embedded.
   */
  fatal?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Result Constructors (helpers for creating Results)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a successful Result.
 *
 * @param value - The success value
 * @returns A Result with ok=true
 */
export function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

/**
 * Create a failed Result.
 *
 * @param error - The error details
 * @returns A Result with ok=false
 */
export function err<T = never>(error: MatchError): Result<T> {
  return { error, ok: false };
}

/**
 * Create a NO_MATCH error Result.
 *
 * @param message - Optional custom message
 * @returns A Result with NO_MATCH error
 */
export function noMatch<T = never>(message = "No pattern matched"): Result<T> {
  return err({ code: "NO_MATCH", message });
}

/**
 * Create an INVALID_FORMAT error Result.
 *
 * @param message - Description of the format issue
 * @param fatal - Whether other matchers should skip this URL
 * @returns A Result with INVALID_FORMAT error
 */
export function invalidFormat<T = never>(
  message: string,
  fatal = false,
): Result<T> {
  return err({ code: "INVALID_FORMAT", fatal, message });
}

/**
 * Create a MISSING_ID error Result.
 *
 * @param message - Description of the missing ID
 * @param fatal - Whether other matchers should skip this URL
 * @returns A Result with MISSING_ID error
 */
export function missingId<T = never>(
  message: string,
  fatal = false,
): Result<T> {
  return err({ code: "MISSING_ID", fatal, message });
}

/**
 * Create a PARSE_ERROR error Result.
 *
 * @param message - Description of the parse failure
 * @returns A Result with PARSE_ERROR error
 */
export function parseError<T = never>(message: string): Result<T> {
  return err({ code: "PARSE_ERROR", message });
}
