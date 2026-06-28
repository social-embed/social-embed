/**
 * Tests for HTML/attribute escaping utilities.
 *
 * These test XSS prevention functions exported from @social-embed/lib.
 */

import { describe, expect, it } from "vitest";

import { escapeAttr, escapeHtml, renderAttributes, renderIframe } from "../src";

describe("escapeHtml()", () => {
  describe("XSS prevention", () => {
    it("should escape script tags", () => {
      const input = '<script>alert("xss")</script>';
      const escaped = escapeHtml(input);

      expect(escaped).not.toContain("<script>");
      expect(escaped).toBe(
        "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;",
      );
    });

    it("should escape event handlers", () => {
      const input = '<img onerror="alert(1)">';
      const escaped = escapeHtml(input);

      expect(escaped).toBe("&lt;img onerror=&quot;alert(1)&quot;&gt;");
    });

    it("should escape all five HTML entities", () => {
      const input = `& < > " '`;
      const escaped = escapeHtml(input);

      expect(escaped).toBe("&amp; &lt; &gt; &quot; &#39;");
    });
  });

  describe("safe strings", () => {
    it("should return safe strings unchanged", () => {
      const input = "Hello World 123";
      expect(escapeHtml(input)).toBe(input);
    });

    it("should return empty string for empty input", () => {
      expect(escapeHtml("")).toBe("");
    });

    it("should handle URLs with special characters", () => {
      const url = "https://example.com?a=1&b=2";
      expect(escapeHtml(url)).toBe("https://example.com?a=1&amp;b=2");
    });
  });
});

describe("escapeAttr()", () => {
  it("should escape attribute values (alias for escapeHtml)", () => {
    const input = 'value with "quotes" and <brackets>';
    const escaped = escapeAttr(input);

    expect(escaped).toBe("value with &quot;quotes&quot; and &lt;brackets&gt;");
  });

  it("should escape ampersands in URLs", () => {
    const url = "https://example.com?foo=1&bar=2&baz=3";
    const escaped = escapeAttr(url);

    expect(escaped).toBe("https://example.com?foo=1&amp;bar=2&amp;baz=3");
  });

  it("should handle single quotes in attributes", () => {
    const input = "it's a test";
    expect(escapeAttr(input)).toBe("it&#39;s a test");
  });
});

describe("renderAttributes()", () => {
  describe("standard attributes", () => {
    it("should render key-value attributes", () => {
      const result = renderAttributes({
        height: "315",
        src: "https://example.com",
        width: "560",
      });

      expect(result).toContain('src="https://example.com"');
      expect(result).toContain('width="560"');
      expect(result).toContain('height="315"');
    });

    it("should include leading space", () => {
      const result = renderAttributes({ width: "560" });

      expect(result).toMatch(/^ /);
    });

    it("should escape attribute values", () => {
      const result = renderAttributes({
        src: "https://example.com?a=1&b=2",
      });

      expect(result).toContain('src="https://example.com?a=1&amp;b=2"');
    });
  });

  describe("boolean attributes", () => {
    it("should render empty string values as boolean attributes", () => {
      const result = renderAttributes({
        allowfullscreen: "",
      });

      expect(result).toBe(" allowfullscreen");
      expect(result).not.toContain("=");
    });

    it("should mix boolean and value attributes", () => {
      const result = renderAttributes({
        allowfullscreen: "",
        frameborder: "0",
        height: "315",
      });

      expect(result).toContain("allowfullscreen");
      expect(result).toContain('frameborder="0"');
      expect(result).toContain('height="315"');
    });
  });

  describe("empty input", () => {
    it("should return empty string for empty object", () => {
      const result = renderAttributes({});

      expect(result).toBe("");
    });
  });
});

describe("renderIframe()", () => {
  it("should render complete iframe element", () => {
    const html = renderIframe("https://youtube.com/embed/abc", {
      height: "315",
      width: "560",
    });

    expect(html).toMatch(/^<iframe/);
    expect(html).toMatch(/<\/iframe>$/);
    expect(html).toContain('src="https://youtube.com/embed/abc"');
    expect(html).toContain('width="560"');
    expect(html).toContain('height="315"');
  });

  it("should render iframe with only src", () => {
    const html = renderIframe("https://example.com/embed");

    expect(html).toBe('<iframe src="https://example.com/embed"></iframe>');
  });

  it("should render iframe with boolean attributes", () => {
    const html = renderIframe("https://example.com", {
      allowfullscreen: "",
      frameborder: "0",
    });

    expect(html).toContain("allowfullscreen");
    expect(html).toContain('frameborder="0"');
  });

  it("should escape src URL", () => {
    const html = renderIframe("https://example.com?a=1&b=2", {});

    expect(html).toContain('src="https://example.com?a=1&amp;b=2"');
  });

  it("should render iframe with allow attribute", () => {
    const html = renderIframe("https://youtube.com/embed/abc", {
      allow: "accelerometer; autoplay; clipboard-write",
    });

    expect(html).toContain('allow="accelerometer; autoplay; clipboard-write"');
  });
});
