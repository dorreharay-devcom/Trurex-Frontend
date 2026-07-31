import type {
  CategoryCreateConfig,
  CategoryQuestion,
  CategoryRatingDimension,
  CategorySubcategoryConfig,
  CategoryTagOption,
} from '~/types/recommendation/rexCategoryCreateConfig';
import {
  mapSubcategoriesFromConfig,
  type RexSubcategoryOption,
} from '~/utils/recommendation/rexSubcategories';

export function resolveSubcategoryForMerge(
  config: CategoryCreateConfig,
  subcategoryCode: string | null,
): CategorySubcategoryConfig | null {
  if (subcategoryCode) {
    return config.subcategories.find((s) => s.code === subcategoryCode) ?? null;
  }
  if (config.subcategories.length === 0) return null;
  const sorted = [...config.subcategories].sort((a, b) => {
    const d = a.sort_order - b.sort_order;
    if (d !== 0) return d;
    return a.code.localeCompare(b.code);
  });
  return sorted[0] ?? null;
}

function sortByOrder<T extends { sort_order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const d = a.sort_order - b.sort_order;
    if (d !== 0) return d;
    return String(
      (a as { code?: string }).code ?? (a as { slug?: string }).slug ?? '',
    ).localeCompare(String((b as { code?: string }).code ?? (b as { slug?: string }).slug ?? ''));
  });
}

function mergeKeyed<T extends { code: string; sort_order: number }>(
  categoryLevel: T[],
  subLevel: T[],
): T[] {
  const map = new Map<string, T>();
  for (const x of sortByOrder(categoryLevel)) {
    map.set(x.code, x);
  }
  for (const x of sortByOrder(subLevel)) {
    map.set(x.code, x);
  }
  return sortByOrder([...map.values()]);
}

export function mergeRatingDimensions(
  config: CategoryCreateConfig,
  subcategoryCode: string | null,
): CategoryRatingDimension[] {
  const sub = resolveSubcategoryForMerge(config, subcategoryCode);
  return mergeKeyed(config.rating_dimensions, sub?.rating_dimensions ?? []);
}

export function mergeQuestions(
  config: CategoryCreateConfig,
  subcategoryCode: string | null,
): CategoryQuestion[] {
  const sub = resolveSubcategoryForMerge(config, subcategoryCode);
  return mergeKeyed(config.questions, sub?.questions ?? []);
}

export function mergeTagOptions(
  config: CategoryCreateConfig,
  subcategoryCode: string | null,
): CategoryTagOption[] {
  const sub = resolveSubcategoryForMerge(config, subcategoryCode);
  const combined = [...config.tag_options, ...(sub?.tag_options ?? [])];
  const seen = new Set<string>();
  const out: CategoryTagOption[] = [];
  for (const t of sortByOrder(combined)) {
    if (seen.has(t.slug)) continue;
    seen.add(t.slug);
    out.push(t);
  }
  return out;
}

export type TagOptionsGroup = {
  groupTitle: string;
  tags: CategoryTagOption[];
};

export function groupTagOptionsByTagGroup(tags: CategoryTagOption[]): TagOptionsGroup[] {
  const map = new Map<string, CategoryTagOption[]>();
  for (const t of tags) {
    const raw = t.tag_group;
    const g = typeof raw === 'string' && raw.trim() !== '' ? raw.trim() : '';
    if (!map.has(g)) map.set(g, []);
    map.get(g)!.push(t);
  }
  const buckets = [...map.entries()].map(([groupTitle, list]) => ({
    groupTitle,
    tags: sortByOrder(list),
  }));
  buckets.sort((a, b) => {
    const aEmpty = a.groupTitle === '';
    const bEmpty = b.groupTitle === '';
    if (aEmpty !== bEmpty) return aEmpty ? 1 : -1;
    const aMin = Math.min(...a.tags.map((x) => x.sort_order));
    const bMin = Math.min(...b.tags.map((x) => x.sort_order));
    if (aMin !== bMin) return aMin - bMin;
    if (aEmpty) return 0;
    return a.groupTitle.localeCompare(b.groupTitle);
  });
  return buckets;
}

export function categoryRatingDimensionsOnly(
  config: CategoryCreateConfig,
): CategoryRatingDimension[] {
  return sortByOrder(config.rating_dimensions);
}

export function subcategoryRatingDimensionsOnly(
  config: CategoryCreateConfig,
  subcategoryCode: string | null,
): CategoryRatingDimension[] {
  if (!subcategoryCode) return [];
  const sub = config.subcategories.find((s) => s.code === subcategoryCode) ?? null;
  return sub ? sortByOrder(sub.rating_dimensions) : [];
}

export function categoryQuestionsOnly(config: CategoryCreateConfig): CategoryQuestion[] {
  return sortByOrder(config.questions);
}

export function subcategoryQuestionsOnly(
  config: CategoryCreateConfig,
  subcategoryCode: string | null,
): CategoryQuestion[] {
  if (!subcategoryCode) return [];
  const sub = config.subcategories.find((s) => s.code === subcategoryCode) ?? null;
  return sub ? sortByOrder(sub.questions) : [];
}

export type CreateConfigView = {
  mergedRatingDimensions: CategoryRatingDimension[];
  mergedQuestions: CategoryQuestion[];
  mergedTagOptions: CategoryTagOption[];
  categoryDimsOnly: CategoryRatingDimension[];
  subDimsOnly: CategoryRatingDimension[];
  categoryQsOnly: CategoryQuestion[];
  subQsOnly: CategoryQuestion[];
  subcategoryOptions: RexSubcategoryOption[];
  subcategoryLabel: string | null;
};

const EMPTY_CONFIG_VIEW: CreateConfigView = {
  mergedRatingDimensions: [],
  mergedQuestions: [],
  mergedTagOptions: [],
  categoryDimsOnly: [],
  subDimsOnly: [],
  categoryQsOnly: [],
  subQsOnly: [],
  subcategoryOptions: [],
  subcategoryLabel: null,
};

export function deriveConfigView(
  config: CategoryCreateConfig | null,
  subcategoryCode: string | null,
): CreateConfigView {
  if (!config) return EMPTY_CONFIG_VIEW;
  return {
    mergedRatingDimensions: mergeRatingDimensions(config, subcategoryCode),
    mergedQuestions: mergeQuestions(config, subcategoryCode),
    mergedTagOptions: mergeTagOptions(config, subcategoryCode),
    categoryDimsOnly: categoryRatingDimensionsOnly(config),
    subDimsOnly: subcategoryRatingDimensionsOnly(config, subcategoryCode),
    categoryQsOnly: categoryQuestionsOnly(config),
    subQsOnly: subcategoryQuestionsOnly(config, subcategoryCode),
    subcategoryOptions: config.subcategories.length
      ? mapSubcategoriesFromConfig(config.subcategories)
      : [],
    subcategoryLabel:
      config.subcategories.find((s) => s.code === subcategoryCode)?.display_name ?? null,
  };
}
