import { describe, expect, it } from "vitest";
import { DEFAULT_CDN_SOURCE } from "./cdnSources";
import {
  DEFAULT_STATE,
  decodePlaygroundState,
  encodePlaygroundState,
  type PlaygroundState,
} from "./playgroundState";

// Test fixtures
const DEFAULT_PRESET_ID = "youtube";
const NON_DEFAULT_PRESET_ID = "vimeo";

const PRESET_CODE = `<!DOCTYPE html>
<html>
<head>
  <script type="module" src="{{WC_URL}}"></script>
</head>
<body>
  <o-embed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></o-embed>
</body>
</html>`;

const CUSTOM_CODE = `<!DOCTYPE html>
<html>
<body>
  <o-embed url="https://vimeo.com/123456"></o-embed>
</body>
</html>`;

describe("encodePlaygroundState", () => {
  describe("preset + seed optimization", () => {
    it("stores only seed for default preset with seed (not code)", () => {
      const state: PlaygroundState = {
        cdnSource: DEFAULT_CDN_SOURCE,
        code: "modified code after reroll",
        presetId: DEFAULT_PRESET_ID,
        seed: "se-1234",
        templateCode: PRESET_CODE,
      };

      const encoded = encodePlaygroundState(state);
      const decoded = JSON.parse(atob(encoded));

      // Should only have seed, not preset ID (default) or code
      expect(decoded).toEqual({ s: "se-1234" });
      expect(decoded.c).toBeUndefined();
      expect(decoded.p).toBeUndefined();
    });

    it("stores preset ID + seed for non-default preset with seed", () => {
      const state: PlaygroundState = {
        cdnSource: DEFAULT_CDN_SOURCE,
        code: "modified code after reroll",
        presetId: NON_DEFAULT_PRESET_ID,
        seed: "se-5678",
        templateCode: PRESET_CODE,
      };

      const encoded = encodePlaygroundState(state);
      const decoded = JSON.parse(atob(encoded));

      // Should have preset ID + seed, but not code
      expect(decoded).toEqual({ p: NON_DEFAULT_PRESET_ID, s: "se-5678" });
      expect(decoded.c).toBeUndefined();
    });
  });

  describe("custom code + seed", () => {
    it("stores template code + seed (not display code)", () => {
      const templateCode = CUSTOM_CODE;
      const displayCode = "display code with replaced URLs";

      const state: PlaygroundState = {
        cdnSource: DEFAULT_CDN_SOURCE,
        code: displayCode,
        seed: "se-9999",
        templateCode: templateCode,
      };

      const encoded = encodePlaygroundState(state);
      const decoded = JSON.parse(atob(encoded));

      // Should store template (not display) + seed
      expect(decoded.c).toBe(btoa(templateCode));
      expect(decoded.s).toBe("se-9999");
      // Decode the stored code to verify it's the template
      expect(atob(decoded.c)).toBe(templateCode);
    });
  });

  describe("no seed cases", () => {
    it("encodes preset without seed when code differs from preset", () => {
      // When preset is selected but code has been modified, store both
      const state: PlaygroundState = {
        cdnSource: DEFAULT_CDN_SOURCE,
        code: "modified code",
        presetId: NON_DEFAULT_PRESET_ID,
      };

      const encoded = encodePlaygroundState(state);
      const decoded = JSON.parse(atob(encoded));

      // Should store preset ID and code (since code differs from preset)
      expect(decoded.p).toBe(NON_DEFAULT_PRESET_ID);
      expect(decoded.c).toBeDefined();
    });

    it("stores custom code when no preset", () => {
      const state: PlaygroundState = {
        cdnSource: DEFAULT_CDN_SOURCE,
        code: CUSTOM_CODE,
      };

      const encoded = encodePlaygroundState(state);
      const decoded = JSON.parse(atob(encoded));

      expect(decoded.c).toBe(btoa(CUSTOM_CODE));
      expect(decoded.s).toBeUndefined();
    });
  });

  describe("CDN source", () => {
    it("stores CDN source when not default", () => {
      const state: PlaygroundState = {
        cdnSource: { type: "jsdelivr" },
        code: CUSTOM_CODE,
      };

      const encoded = encodePlaygroundState(state);
      const decoded = JSON.parse(atob(encoded));

      expect(decoded.cdn).toBe("jsdelivr");
    });

    it("omits CDN source when default", () => {
      const state: PlaygroundState = {
        cdnSource: DEFAULT_CDN_SOURCE,
        code: CUSTOM_CODE,
      };

      const encoded = encodePlaygroundState(state);
      const decoded = JSON.parse(atob(encoded));

      expect(decoded.cdn).toBeUndefined();
    });
  });
});

describe("decodePlaygroundState", () => {
  it("decodes seed-only state correctly", () => {
    const encoded = btoa(JSON.stringify({ s: "se-1234" }));
    const decoded = decodePlaygroundState(encoded);

    expect(decoded.seed).toBe("se-1234");
    expect(decoded.presetId).toBeUndefined();
    expect(decoded.code).toBe(DEFAULT_STATE.code);
  });

  it("decodes preset + seed state correctly", () => {
    const encoded = btoa(JSON.stringify({ p: "vimeo", s: "se-5678" }));
    const decoded = decodePlaygroundState(encoded);

    expect(decoded.presetId).toBe("vimeo");
    expect(decoded.seed).toBe("se-5678");
  });

  it("decodes custom code + seed state correctly", () => {
    const encoded = btoa(
      JSON.stringify({
        c: btoa(CUSTOM_CODE),
        s: "se-9999",
      }),
    );
    const decoded = decodePlaygroundState(encoded);

    expect(decoded.code).toBe(CUSTOM_CODE);
    expect(decoded.seed).toBe("se-9999");
  });

  it("returns default state for empty input", () => {
    const decoded = decodePlaygroundState("");
    expect(decoded).toEqual(DEFAULT_STATE);
  });

  it("returns default state for invalid input", () => {
    const decoded = decodePlaygroundState("not-valid-base64!!!");
    expect(decoded).toEqual(DEFAULT_STATE);
  });

  it("returns default state for invalid JSON", () => {
    const encoded = btoa("not valid json");
    const decoded = decodePlaygroundState(encoded);
    expect(decoded).toEqual(DEFAULT_STATE);
  });
});

describe("round-trip encoding/decoding", () => {
  it("preserves preset + seed through round-trip", () => {
    const original: PlaygroundState = {
      cdnSource: DEFAULT_CDN_SOURCE,
      code: "display code (ignored)",
      presetId: NON_DEFAULT_PRESET_ID,
      seed: "se-roundtrip",
      templateCode: PRESET_CODE,
    };

    const encoded = encodePlaygroundState(original);
    const decoded = decodePlaygroundState(encoded);

    expect(decoded.presetId).toBe(original.presetId);
    expect(decoded.seed).toBe(original.seed);
    // Note: code is NOT preserved - it's regenerated from preset + seed
  });

  it("preserves custom template + seed through round-trip", () => {
    const original: PlaygroundState = {
      cdnSource: DEFAULT_CDN_SOURCE,
      code: "display code (ignored)",
      seed: "se-custom",
      templateCode: CUSTOM_CODE,
    };

    const encoded = encodePlaygroundState(original);
    const decoded = decodePlaygroundState(encoded);

    // Template is stored, so code should match template
    expect(decoded.code).toBe(CUSTOM_CODE);
    expect(decoded.seed).toBe(original.seed);
  });

  it("preserves CDN source through round-trip", () => {
    const original: PlaygroundState = {
      cdnSource: { type: "unpkg" },
      code: CUSTOM_CODE,
    };

    const encoded = encodePlaygroundState(original);
    const decoded = decodePlaygroundState(encoded);

    expect(decoded.cdnSource.type).toBe("unpkg");
  });
});

describe("URL size optimization", () => {
  it("preset + seed URL is significantly smaller than storing full code", () => {
    const state: PlaygroundState = {
      cdnSource: DEFAULT_CDN_SOURCE,
      code: PRESET_CODE + " with additional content ".repeat(10),
      presetId: NON_DEFAULT_PRESET_ID,
      seed: "se-1234",
      templateCode: PRESET_CODE,
    };

    const optimizedEncoded = encodePlaygroundState(state);

    // Compare to what it would be if we stored the full code
    const unoptimizedState = {
      c: btoa(state.code),
      p: state.presetId,
      s: state.seed,
    };
    const unoptimizedEncoded = btoa(JSON.stringify(unoptimizedState));

    // Optimized should be much smaller
    expect(optimizedEncoded.length).toBeLessThan(unoptimizedEncoded.length / 2);
  });

  it("seed-only URL is very compact", () => {
    const state: PlaygroundState = {
      cdnSource: DEFAULT_CDN_SOURCE,
      code: "long display code ".repeat(50),
      presetId: DEFAULT_PRESET_ID, // Default preset
      seed: "se-1234",
      templateCode: PRESET_CODE,
    };

    const encoded = encodePlaygroundState(state);

    // Should be very short - just {"s":"se-1234"} base64 encoded
    // That's about 24 characters
    expect(encoded.length).toBeLessThan(30);
  });
});
