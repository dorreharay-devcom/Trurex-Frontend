export function categoryPillColor(categoryCode: string): string {
  let n = 0;
  for (let i = 0; i < categoryCode.length; i++) {
    n = (n * 31 + categoryCode.charCodeAt(i)) >>> 0;
  }
  const hue = n % 360;
  return `hsl(${hue} 52% 42%)`;
}

export function categoryPillActiveSurface(baseColor: string): {
  backgroundColor: string;
  borderColor: string;
} {
  return {
    backgroundColor: withAlphaChannel(baseColor, 0.12),
    borderColor: withAlphaChannel(baseColor, 0.42),
  };
}

function withAlphaChannel(color: string, alpha: number): string {
  const t = color.trim();
  if (t.startsWith('#') && (t.length === 7 || t.length === 9)) {
    const a = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, '0');
    return t.length === 7 ? `${t}${a}` : `${t.slice(0, 7)}${a}`;
  }
  const m = t.match(/^hsl\(\s*(\d+)\s+([\d.]+)%\s+([\d.]+)%\s*\)$/i);
  if (m) {
    return `hsla(${m[1]}, ${m[2]}%, ${m[3]}%, ${alpha})`;
  }
  return t;
}
