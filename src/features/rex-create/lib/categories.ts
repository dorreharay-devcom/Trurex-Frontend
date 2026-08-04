import type { CategorySubcategoryConfig } from '~/features/rex-create/types/categoryCreateConfig';
import { CATEGORY_ICON_FALLBACK, type DbCategoryRow } from '~/shared/api/categories';
import { CREATE_REC_MODAL_MAX_W } from '~/features/rex-create/config/layout';

export type CategoryPickerTile = {
  id: string;
  label: string;
  emoji: string;
};

export function getRexCategoryApiCode(categoryCode: string | null): string | null {
  const c = categoryCode?.trim();
  return c || null;
}

export function categoryRowToPickerTile(row: DbCategoryRow): CategoryPickerTile {
  const icon = row.icon?.trim();
  return {
    id: row.code,
    label: row.display_name,
    emoji: icon && icon.length > 0 ? icon : CATEGORY_ICON_FALLBACK,
  };
}

export type RexSubcategoryOption = {
  code: string;
  label: string;
  icon: string | null;
  ratingCount: number;
  questionCount: number;
};

export function mapSubcategoriesFromConfig(
  subcategories: CategorySubcategoryConfig[],
): RexSubcategoryOption[] {
  return subcategories.map((s) => ({
    code: s.code,
    label: s.display_name,
    icon: s.icon?.trim() || null,
    ratingCount: s.rating_dimensions.length,
    questionCount: s.questions.length,
  }));
}

export type CategoryGridConfig = {
  numColumns: number;
  gap: number;
  tileWidth: number;
  tile: {
    minHeight: number;
    paddingHorizontal: number;
    paddingVertical: number;
  };
  emoji: {
    fontSize: number;
    marginBottom: number;
  };
  label: {
    fontSize: number;
    lineHeight: number;
    numberOfLines: number;
  };
};

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

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

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
    tileWidth: tileW,
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
