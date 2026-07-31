export const CIRCLE_SYSTEM_KIND = {
  innerCircle: 'inner_circle',
  trusted: 'trusted',
  closeFriends: 'close_friends',
  broaderNetwork: 'broader_network',
} as const;

export type CircleSystemKind = (typeof CIRCLE_SYSTEM_KIND)[keyof typeof CIRCLE_SYSTEM_KIND];

export const SYSTEM_KIND_COLOR_FALLBACK: Record<string, string> = {
  [CIRCLE_SYSTEM_KIND.innerCircle]: '#7C3AED',
  [CIRCLE_SYSTEM_KIND.trusted]: '#EC4899',
  [CIRCLE_SYSTEM_KIND.closeFriends]: '#EC4899',
  [CIRCLE_SYSTEM_KIND.broaderNetwork]: '#0EA5E9',
};

export const CIRCLE_COLOR_PRESETS = [
  '#9333ea',
  '#ec4899',
  '#38bdf8',
  '#14b8a6',
  '#B7C7CF',
  '#ef4444',
  '#2563eb',
  '#ca8a04',
] as const;

export type CirclePresetColor = (typeof CIRCLE_COLOR_PRESETS)[number];

export const CIRCLE_PRESET_DEFAULT: CirclePresetColor = CIRCLE_COLOR_PRESETS[0];

export const USER_CIRCLE_PALETTE: { accent: string; iconBg: string }[] = [
  { accent: '#9333ea', iconBg: '#f3e8ff' },
  { accent: '#ca8a04', iconBg: '#fef9c3' },
  { accent: '#dc2626', iconBg: '#fee2e2' },
  { accent: '#0d9488', iconBg: '#ccfbf1' },
  { accent: '#B7C7CF', iconBg: '#E4EBEE' },
];
