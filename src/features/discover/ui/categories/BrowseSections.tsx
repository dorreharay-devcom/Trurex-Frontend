import React from 'react';
import type { CategoriesState } from '~/features/discover/hooks/useCategories';
import AllCategoriesSection from '~/features/discover/ui/categories/AllCategoriesSection';
import PinnedCategoriesRow from '~/features/discover/ui/categories/PinnedCategoriesRow';
import TrendingTags from '~/features/discover/ui/feed/TrendingTags';

type Props = {
  categories: CategoriesState;
  activeCategory: string;
  activeTag: string | null;
  onToggleCategory: (code: string) => void;
  onToggleTag: (slug: string) => void;
};

function BrowseSections({
  categories,
  activeCategory,
  activeTag,
  onToggleCategory,
  onToggleTag,
}: Props) {
  const hasPinned = categories.pinnedCats.length > 0;
  return (
    <>
      <TrendingTags activeTag={activeTag} onToggleTag={onToggleTag} />
      {hasPinned ? (
        <PinnedCategoriesRow
          cats={categories.pinnedCats}
          activeCategory={activeCategory}
          onSelectCategory={onToggleCategory}
          onUnpin={(serverId) => categories.togglePin(serverId, true)}
        />
      ) : null}
      <AllCategoriesSection
        allCats={categories.allCats}
        remainingCats={categories.remainingCats}
        hasPinned={hasPinned}
        activeCategory={activeCategory}
        categoriesPending={categories.categoriesPending}
        isPinned={categories.isPinned}
        isTogglingPin={categories.isTogglingPin}
        onSelectCategory={onToggleCategory}
        onTogglePin={categories.togglePin}
      />
    </>
  );
}

export default BrowseSections;
