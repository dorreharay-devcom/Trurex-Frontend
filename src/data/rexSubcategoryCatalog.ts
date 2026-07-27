import type { CategorySubcategoryConfig } from '~/types/recommendation/rexCategoryCreateConfig';

export type RexSubcategoryOption = {
  code: string;
  label: string;
  icon: string | null;
  ratingCount: number;
  questionCount: number;
};

export const SUB_CAT_ICONS: Record<string, string> = {
  buyers_agent: '🏡',
  selling_agent: '📋',
  property_manager: '🔑',
  tenant: '🏢',
  agency: '🏗️',
};

export const SUBCATEGORY_ICONS = SUB_CAT_ICONS;

function normalizeSubcategoryCode(code: string): string {
  return code
    .trim()
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .toLowerCase()
    .replace(/[''`´\u2018\u2019]/g, '')
    .replace(/[\s-]+/g, '_');
}

const SUB_CAT_CODE_ALIASES: Partial<Record<string, keyof typeof SUB_CAT_ICONS>> = {
  buyer_agent: 'buyers_agent',
  tenant_experience: 'tenant',
  tenant_exp: 'tenant',
};

function iconKeyFromLabel(displayName: string): keyof typeof SUB_CAT_ICONS | null {
  const t = displayName.trim().toLowerCase();
  if (t.includes('buyer') && t.includes('agent')) return 'buyers_agent';
  if (t.includes('selling') && t.includes('agent')) return 'selling_agent';
  if (t.includes('property') && t.includes('manager')) return 'property_manager';
  if (t.includes('tenant')) return 'tenant';
  if (t === 'agency' || /^agency\b/i.test(displayName.trim())) return 'agency';
  return null;
}

function resolveLocalSubcategoryIcon(code: string, displayName?: string): string {
  const cleaned = code.trim().replace(/[\u200B-\u200D\uFEFF]/g, '');
  const direct = SUB_CAT_ICONS[cleaned as keyof typeof SUB_CAT_ICONS];
  if (direct) return direct;

  const normalized = normalizeSubcategoryCode(cleaned);
  const byNorm = SUB_CAT_ICONS[normalized as keyof typeof SUB_CAT_ICONS];
  if (byNorm) return byNorm;

  const aliasKey = SUB_CAT_CODE_ALIASES[normalized];
  if (aliasKey) return SUB_CAT_ICONS[aliasKey];

  if (displayName) {
    const fromLabel = iconKeyFromLabel(displayName);
    if (fromLabel) return SUB_CAT_ICONS[fromLabel];
  }

  return '';
}

export function resolveSubcategoryIcon(
  code: string,
  displayName?: string,
  iconFromApi?: string | null,
): string {
  const fromApi = iconFromApi?.trim();
  if (fromApi) return fromApi;
  return resolveLocalSubcategoryIcon(code, displayName);
}

export function mapSubcategoriesFromConfig(
  subcategories: CategorySubcategoryConfig[],
): RexSubcategoryOption[] {
  return subcategories.map((s) => ({
    code: s.code,
    label: s.display_name,
    icon: s.icon ?? null,
    ratingCount: s.rating_dimensions.length,
    questionCount: s.questions.length,
  }));
}
