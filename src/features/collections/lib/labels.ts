export function rexCountLabel(count: number): string {
  return `${count} rex${count !== 1 ? 'es' : ''}`;
}

export function itemCountLabel(count: number): string {
  return `${count} item${count !== 1 ? 's' : ''}`;
}
