import { CREATE_REC_MODAL_MAX_W } from '~/constants/recommendation/createLayout';
import type { CategoryGridConfig } from '~/types/recommendation/categoryGrid';

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export const categoryGridRules = {
  contentHorizontalPadding: 16,
  columnGap: 10,
  columns: { min: 2, max: 4, minTileWidthPx: 92 },
  tileMinHeight: { widthFactor: 0.88, minPx: 88, maxPx: 132 },
  emoji: { widthFactor: 0.2, minPx: 22, maxPx: 34 },
  labelFont: { widthFactor: 0.074, minPx: 10, maxPx: 12.75, lineHeightFactor: 1.32 },
  paddingH: { widthFactor: 0.052, minPx: 6, maxPx: 12 },
  paddingV: { widthFactor: 0.062, minPx: 6, maxPx: 14 },
  emojiLabelGap: { widthFactor: 0.04, minPx: 6, maxPx: 10 },
  labelLines: { min: 3, max: 6 },
} as const;

function numColumns(innerWidth: number, rules: typeof categoryGridRules): number {
  const { columnGap, columns } = rules;
  for (let c = columns.max; c >= columns.min; c--) {
    const tileW = (innerWidth - columnGap * (c - 1)) / c;
    if (tileW >= columns.minTileWidthPx) return c;
  }
  return columns.min;
}

export function getCategoryGridConfig(windowWidth: number): CategoryGridConfig {
  const rules = categoryGridRules;
  const maxW = Math.min(windowWidth, CREATE_REC_MODAL_MAX_W);
  const inner = Math.max(0, maxW - rules.contentHorizontalPadding * 2);
  const cols = numColumns(inner, rules);
  const tileW =
    cols > 0 ? (inner - rules.columnGap * (cols - 1)) / cols : rules.columns.minTileWidthPx;

  const minHeight = Math.round(
    clamp(
      tileW * rules.tileMinHeight.widthFactor,
      rules.tileMinHeight.minPx,
      rules.tileMinHeight.maxPx,
    ),
  );
  const emojiSize = Math.round(
    clamp(tileW * rules.emoji.widthFactor, rules.emoji.minPx, rules.emoji.maxPx),
  );
  const labelSize = clamp(
    tileW * rules.labelFont.widthFactor,
    rules.labelFont.minPx,
    rules.labelFont.maxPx,
  );
  const labelLineHeight = Math.round(labelSize * rules.labelFont.lineHeightFactor);
  const padH = Math.round(
    clamp(tileW * rules.paddingH.widthFactor, rules.paddingH.minPx, rules.paddingH.maxPx),
  );
  const padV = Math.round(
    clamp(tileW * rules.paddingV.widthFactor, rules.paddingV.minPx, rules.paddingV.maxPx),
  );
  const emojiMarginBottom = Math.round(
    clamp(
      tileW * rules.emojiLabelGap.widthFactor,
      rules.emojiLabelGap.minPx,
      rules.emojiLabelGap.maxPx,
    ),
  );
  const labelBlockHeight = minHeight - padV * 2 - emojiSize - emojiMarginBottom;
  const numberOfLines = clamp(
    Math.floor(labelBlockHeight / labelLineHeight),
    rules.labelLines.min,
    rules.labelLines.max,
  );

  return {
    numColumns: cols,
    gap: rules.columnGap,
    tile: {
      minHeight,
      paddingHorizontal: padH,
      paddingVertical: padV,
    },
    emoji: {
      fontSize: emojiSize,
      marginBottom: emojiMarginBottom,
    },
    label: {
      fontSize: labelSize,
      lineHeight: labelLineHeight,
      numberOfLines,
    },
  };
}
