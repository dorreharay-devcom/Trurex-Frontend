import React from 'react';
import { View } from 'react-native';
import BrowseSections from '~/features/discover/ui/categories/BrowseSections';
import DiscoverTabs from '~/features/discover/ui/DiscoverTabs';
import type { DiscoverTab } from '~/features/discover/config/tabs';
import type { CategoriesState } from '~/features/discover/hooks/useCategories';

type Props = {
  activeTab: DiscoverTab;
  onChangeTab: (tab: DiscoverTab) => void;
  showBrowse: boolean;
  showTrending?: boolean;
  categories: CategoriesState;
  activeCategory: string;
  activeTag: string | null;
  onToggleCategory: (code: string) => void;
  onToggleTag: (slug: string) => void;
};

function DiscoverTopChrome({
  activeTab,
  onChangeTab,
  showBrowse,
  showTrending = true,
  categories,
  activeCategory,
  activeTag,
  onToggleCategory,
  onToggleTag,
}: Props) {
  return (
    <>
      {showBrowse ? (
        <View className="px-4 pt-6">
          <BrowseSections
            categories={categories}
            activeCategory={activeCategory}
            activeTag={activeTag}
            onToggleCategory={onToggleCategory}
            onToggleTag={onToggleTag}
            showTrending={showTrending}
          />
        </View>
      ) : null}
      <View className="px-4">
        <DiscoverTabs activeTab={activeTab} onChange={onChangeTab} />
      </View>
    </>
  );
}

export default DiscoverTopChrome;
