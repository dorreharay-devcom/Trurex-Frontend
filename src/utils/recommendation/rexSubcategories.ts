import type { CategorySubcategoryConfig } from '~/types/recommendation/rexCategoryCreateConfig';

export type RexSubcategoryOption = {
  code: string;
  label: string;
  icon: string | null;
  ratingCount: number;
  questionCount: number;
};

/** Map BE create-config subcategories for the create-flow UI (icons come from API). */
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
