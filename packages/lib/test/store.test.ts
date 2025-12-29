/**
 * Tests for RegistryStore - mutable registry wrapper with reactivity.
 */

import { describe, expect, it, vi } from "vitest";

import { defineIframeMatcher, MatcherRegistry, RegistryStore } from "../src";

// Simple test matcher
const TestMatcher = defineIframeMatcher({
  domains: ["test.example.com"],
  embedUrl: (id) => `https://test.example.com/embed/${id}`,
  name: "Test",
  patterns: [/test\.example\.com\/v\/(\w+)/],
});

describe("RegistryStore", () => {
  it("should initialize with default registry", () => {
    const store = new RegistryStore();
    expect(store.has("YouTube")).toBe(true);
    expect(store.has("Spotify")).toBe(true);
  });

  it("should accept custom initial registry", () => {
    const registry = MatcherRegistry.create([TestMatcher]);
    const store = new RegistryStore(registry);

    expect(store.has("Test")).toBe(true);
    expect(store.has("YouTube")).toBe(false);
  });

  it("should expose current registry", () => {
    const store = new RegistryStore();
    expect(store.current).toBeInstanceOf(MatcherRegistry);
  });

  describe("register", () => {
    it("should add new matcher", () => {
      const store = new RegistryStore();
      expect(store.has("Test")).toBe(false);

      store.register(TestMatcher);

      expect(store.has("Test")).toBe(true);
    });

    it("should replace existing matcher with same name", () => {
      const TestMatcher2 = defineIframeMatcher({
        domains: ["test2.example.com"],
        embedUrl: (id) => `https://test2.example.com/embed/${id}`,
        name: "Test",
        patterns: [/test2\.example\.com\/v\/(\w+)/],
      });

      const store = new RegistryStore(MatcherRegistry.create([TestMatcher]));
      store.register(TestMatcher2);

      const matcher = store.get("Test");
      expect(matcher?.domains).toContain("test2.example.com");
    });

    it("should accept tuple with priority", () => {
      const store = new RegistryStore();
      store.register({ matcher: TestMatcher, priority: 10 });

      expect(store.has("Test")).toBe(true);
    });
  });

  describe("unregister", () => {
    it("should remove existing matcher", () => {
      const store = new RegistryStore(MatcherRegistry.create([TestMatcher]));
      expect(store.has("Test")).toBe(true);

      store.unregister("Test");

      expect(store.has("Test")).toBe(false);
    });

    it("should be no-op for non-existent matcher", () => {
      const store = new RegistryStore();
      const sizeBefore = store.size;

      store.unregister("NonExistent");

      expect(store.size).toBe(sizeBefore);
    });
  });

  describe("subscribe/notify", () => {
    it("should notify on register", () => {
      const store = new RegistryStore();
      const listener = vi.fn();

      store.subscribe(listener);
      store.register(TestMatcher);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(store.current);
    });

    it("should notify on unregister", () => {
      const store = new RegistryStore(MatcherRegistry.create([TestMatcher]));
      const listener = vi.fn();

      store.subscribe(listener);
      store.unregister("Test");

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("should not notify after unsubscribe", () => {
      const store = new RegistryStore();
      const listener = vi.fn();

      const unsubscribe = store.subscribe(listener);
      unsubscribe();
      store.register(TestMatcher);

      expect(listener).not.toHaveBeenCalled();
    });

    it("should support multiple listeners", () => {
      const store = new RegistryStore();
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      store.subscribe(listener1);
      store.subscribe(listener2);
      store.register(TestMatcher);

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });
  });

  describe("setRegistry", () => {
    it("should replace entire registry", () => {
      const store = new RegistryStore();
      const customRegistry = MatcherRegistry.create([TestMatcher]);

      store.setRegistry(customRegistry);

      expect(store.has("Test")).toBe(true);
      expect(store.has("YouTube")).toBe(false);
    });

    it("should notify listeners", () => {
      const store = new RegistryStore();
      const listener = vi.fn();

      store.subscribe(listener);
      store.setRegistry(MatcherRegistry.create([TestMatcher]));

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe("delegation methods", () => {
    it("should delegate match()", () => {
      const store = new RegistryStore();
      const result = store.match("https://youtu.be/FTQbiNvZqaY");

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.matcher.name).toBe("YouTube");
      }
    });

    it("should delegate toEmbedUrl()", () => {
      const store = new RegistryStore();
      const url = store.toEmbedUrl("https://youtu.be/FTQbiNvZqaY");

      expect(url).toContain("youtube-nocookie.com/embed/FTQbiNvZqaY");
    });

    it("should delegate toOutput()", () => {
      const store = new RegistryStore();
      const output = store.toOutput("https://youtu.be/FTQbiNvZqaY");

      expect(output?.nodes[0].type).toBe("iframe");
    });

    it("should delegate list()", () => {
      const store = new RegistryStore();
      const matchers = store.list();

      expect(matchers).toBeInstanceOf(Array);
      expect(matchers.some((m) => m.name === "YouTube")).toBe(true);
    });

    it("should delegate size", () => {
      const store = new RegistryStore();
      expect(store.size).toBeGreaterThan(0);
    });
  });
});
