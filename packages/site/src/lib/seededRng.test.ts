import { describe, expect, it } from "vitest";
import { createRng, fnv1aHash, generateSeed, pickFromArray } from "./seededRng";

describe("fnv1aHash", () => {
  it("produces consistent hash for same input", () => {
    expect(fnv1aHash("test")).toBe(fnv1aHash("test"));
  });

  it("produces different hashes for different inputs", () => {
    expect(fnv1aHash("a")).not.toBe(fnv1aHash("b"));
  });

  it("handles empty string", () => {
    expect(fnv1aHash("")).toBe(2166136261);
  });
});

describe("createRng", () => {
  it("produces deterministic output for same seed", () => {
    const rng1 = createRng("test-seed");
    const rng2 = createRng("test-seed");
    expect(rng1()).toBe(rng2());
    expect(rng1()).toBe(rng2());
    expect(rng1()).toBe(rng2());
  });

  it("produces different output for different seeds", () => {
    const rng1 = createRng("seed-a");
    const rng2 = createRng("seed-b");
    expect(rng1()).not.toBe(rng2());
  });

  it("produces values in [0, 1) range", () => {
    const rng = createRng("test");
    for (let i = 0; i < 100; i++) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("produces good distribution", () => {
    const rng = createRng("distribution-test");
    const buckets = [0, 0, 0, 0, 0];
    for (let i = 0; i < 1000; i++) {
      const value = rng();
      const bucket = Math.floor(value * 5);
      buckets[bucket]++;
    }
    // Each bucket should have roughly 200 values (20%)
    for (const count of buckets) {
      expect(count).toBeGreaterThan(100); // At least 10%
      expect(count).toBeLessThan(300); // At most 30%
    }
  });
});

describe("pickFromArray", () => {
  it("picks deterministically based on seed", () => {
    const items = ["a", "b", "c", "d", "e"];
    const pick1 = pickFromArray(items, "test-seed");
    const pick2 = pickFromArray(items, "test-seed");
    expect(pick1).toBe(pick2);
  });

  it("picks different items for different seeds", () => {
    const items = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    const picks = new Set<string>();
    for (let i = 0; i < 20; i++) {
      picks.add(pickFromArray(items, `seed-${i}`));
    }
    // Should have selected multiple different items
    expect(picks.size).toBeGreaterThan(1);
  });

  it("throws for empty array", () => {
    expect(() => pickFromArray([], "test")).toThrow("Cannot pick from empty");
  });

  it("works with single-item array", () => {
    expect(pickFromArray(["only"], "any-seed")).toBe("only");
  });
});

describe("generateSeed", () => {
  it("generates seeds in expected format", () => {
    const seed = generateSeed();
    expect(seed).toMatch(/^se-\d+$/);
  });

  it("generates different seeds on each call", () => {
    const seeds = new Set<string>();
    for (let i = 0; i < 100; i++) {
      seeds.add(generateSeed());
    }
    // Should have many unique seeds (not all, due to random collisions)
    expect(seeds.size).toBeGreaterThan(90);
  });
});
