export const VALUE_FOR_MONEY_LABELS = [
  'Bargain Find',
  'Cheap&Cheerful',
  'Good Value',
  'Expensive But Worth It',
  'Felt Like A Rip-off',
] as const;

export function valueForMoneyLabel(score: number): string | null {
  if (!Number.isFinite(score) || score < 1 || score > 5) return null;
  return VALUE_FOR_MONEY_LABELS[Math.round(score) - 1] ?? null;
}
