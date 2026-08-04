export type QuickTipCopy = {
  label: string;
  helper: string;
};

const DEFAULT_COPY: QuickTipCopy = {
  label: 'MUST KNOW',
  helper: "What's the one thing every guest should know before they arrive?",
};

const QUICK_TIP_VARIANTS: { pattern: RegExp; copy: QuickTipCopy }[] = [
  {
    pattern: /restaurant|cafe|coffee/,
    copy: { label: 'MUST ORDER', helper: "What's the one dish or drink not to miss?" },
  },
  {
    pattern:
      /bar|beauty|personal_care|spiritual|holistic|retail|shopping|fitness|movement|growth|learning|event|entertainment/,
    copy: { label: 'MUST TRY', helper: "What's the one thing people should try?" },
  },
  {
    pattern:
      /hotel|medical|home|trade|creative|professional|business|legal|pet|childcare|family|automotive/,
    copy: DEFAULT_COPY,
  },
  {
    pattern: /art|culture|sightseeing/,
    copy: {
      label: 'MUST SEE',
      helper: "What's the one thing not to miss — a piece, a room, a moment?",
    },
  },
  {
    pattern: /activit|wellness|outdoor|nature/,
    copy: { label: 'MUST DO', helper: "What's the one thing not to miss or know before you go?" },
  },
];

function normalizeForMatch(value: string | null | undefined): string {
  return (value ?? '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function quickTipCopyForCategory(
  categoryCode: string | null,
  categoryDisplayName?: string | null,
): QuickTipCopy {
  const haystack = [normalizeForMatch(categoryCode), normalizeForMatch(categoryDisplayName)]
    .filter(Boolean)
    .join(' ');
  return QUICK_TIP_VARIANTS.find((v) => v.pattern.test(haystack))?.copy ?? DEFAULT_COPY;
}
