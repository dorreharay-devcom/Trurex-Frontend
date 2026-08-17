const offsets = new Map<string, number>();

export function rememberDiscoverScrollOffset(key: string, offsetY: number) {
  offsets.set(key, offsetY);
}

export function getDiscoverScrollOffset(key: string): number {
  return offsets.get(key) ?? 0;
}
