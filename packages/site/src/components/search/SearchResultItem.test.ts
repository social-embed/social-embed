import { describe, expect, test } from "vitest";
import { BREADCRUMB_OVERRIDES, urlToBreadcrumb } from "./SearchResultItem";

describe("urlToBreadcrumb", () => {
  test("converts multi-segment URL with override", () => {
    expect(urlToBreadcrumb("/wc/providers/youtube/")).toBe(
      "WC > Providers > Youtube",
    );
  });

  test("uses override for wc segment", () => {
    expect(urlToBreadcrumb("/wc/")).toBe("WC");
  });

  test("uses override for api segment", () => {
    expect(urlToBreadcrumb("/api/")).toBe("API");
  });

  test("handles kebab-case", () => {
    expect(urlToBreadcrumb("/getting-started/")).toBe("Getting Started");
  });

  test("returns Home for root", () => {
    expect(urlToBreadcrumb("/")).toBe("Home");
  });

  test("handles URL with anchor", () => {
    expect(urlToBreadcrumb("/wc/providers/youtube/#options")).toBe(
      "WC > Providers > Youtube",
    );
  });
});

describe("BREADCRUMB_OVERRIDES", () => {
  test("contains expected overrides", () => {
    expect(BREADCRUMB_OVERRIDES).toEqual({
      api: "API",
      wc: "WC",
    });
  });
});
