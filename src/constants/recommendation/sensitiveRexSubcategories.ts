/**
 * Normalized subcategory codes (`code` from category config) that should show the
 * “Heads up” visibility nudge on the create-Rex circles step. Extend as product defines.
 */
function normalizeSubcategoryCode(code: string): string {
  return code
    .trim()
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .toLowerCase()
    .replace(/[''`´\u2018\u2019]/g, '')
    .replace(/[\s-]+/g, '_');
}

export const SENSITIVE_REX_SUBCATEGORY_CODES = new Set<string>([
  // Example: 'therapy', 'mental_health'
]);

export function isSensitiveRexSubcategory(code: string | null | undefined): boolean {
  if (!code) return false;
  return SENSITIVE_REX_SUBCATEGORY_CODES.has(normalizeSubcategoryCode(code));
}
