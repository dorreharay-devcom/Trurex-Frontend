const HEX6_OR_HASH = /^#?([0-9A-Fa-f]{6})$/;

const FALLBACK_GRAY = { r: 115, g: 115, b: 115 };

function rgbFromHex6(hex: string): { r: number; g: number; b: number } {
  const m = hex.trim().match(HEX6_OR_HASH);
  if (!m) return FALLBACK_GRAY;
  const h = m[1];
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export function rgbaFromHexColor(hex: string, alpha: number): string {
  const { r, g, b } = rgbFromHex6(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}
