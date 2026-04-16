export function categoryPillColor(categoryCode: string): string {
  let n = 0;
  for (let i = 0; i < categoryCode.length; i++) {
    n = (n * 31 + categoryCode.charCodeAt(i)) >>> 0;
  }
  const hue = n % 360;
  return `hsl(${hue} 52% 42%)`;
}
