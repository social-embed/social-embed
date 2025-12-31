/**
 * Seeded random number generator using FNV-1a hash and Mulberry32 PRNG.
 * Provides deterministic random selection for shareable playground URLs.
 */

/**
 * FNV-1a hash function - converts a string to a 32-bit hash.
 */
export function fnv1aHash(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Mulberry32 PRNG - fast, simple, good distribution.
 * Returns a function that generates random numbers in [0, 1).
 */
function mulberry32(initialSeed: number): () => number {
  let state = initialSeed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Create a seeded RNG from a string seed.
 * Same seed always produces the same sequence of random numbers.
 */
export function createRng(seed: string): () => number {
  return mulberry32(fnv1aHash(seed));
}

/**
 * Pick an item from an array deterministically based on seed.
 */
export function pickFromArray<T>(items: readonly T[], seed: string): T {
  if (items.length === 0) {
    throw new Error("Cannot pick from empty array");
  }
  const rng = createRng(seed);
  const index = Math.floor(rng() * items.length);
  return items[index];
}

/**
 * Generate a new random seed string.
 */
export function generateSeed(): string {
  return `se-${Math.floor(Math.random() * 10000)}`;
}
