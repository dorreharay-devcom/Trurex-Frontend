import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import AddToCollectionSheet, { RecSummary } from '~/components/faves/AddToCollectionSheet';
import { webContainerStyle } from '~/utils';
import CategoryPills, { Category } from '~/components/layout/CategoryPills';
import RecommendationCard, { Recommendation } from '~/components/recommendation/RecommendationCard';
import type { RecommendationOpenOptions } from '~/types/recommendation/recommendation';
import { getCategoryEmoji } from '~/constants/recommendation/rexCategories';
import { MOCK_RECS } from '~/constants/recommendation/mockRecommendations';
import { useActiveCategories } from '~/hooks/useActiveCategories';
import { useDiscoverRecommendations, useSearchRexes } from '~/hooks/useDiscovery';
import { categoryPillColor } from '~/utils/recommendation/categoryPillColor';

const ALL_PILL: Category = {
  id: 'all',
  label: 'All',
  emoji: '🔥',
  color: '#9333ea',
};

const FALLBACK_CATEGORY_CODES: { code: string; label: string }[] = [
  { code: 'restaurants', label: 'Restaurants' },
  { code: 'cafes_coffee_shops', label: 'Cafes' },
  { code: 'hotels_accommodation', label: 'Hotels' },
  { code: 'experiences_tour_guides', label: 'Experiences' },
  { code: 'growth_learning', label: 'Learning' },
  { code: 'bars_nightlife', label: 'Bars' },
  { code: 'real_estate', label: 'Real estate' },
];

function buildFallbackPills(): Category[] {
  return [
    ALL_PILL,
    ...FALLBACK_CATEGORY_CODES.map(({ code, label }) => ({
      id: code,
      label,
      emoji: getCategoryEmoji(code),
      color: categoryPillColor(code),
    })),
  ];
}

type DiscoverViewProps = {
  searchQuery?: string;
  commentCountByRexId?: Record<string, number>;
  onRecommendationPress?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
  onTapRec?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
};

const DiscoverView = ({
  searchQuery = '',
  commentCountByRexId,
  onRecommendationPress,
  onTapRec,
}: DiscoverViewProps) => {
  const onOpenRec = onRecommendationPress ?? onTapRec;
  const [activeCategory, setActiveCategory] = useState('all');
  const [saveTarget, setSaveTarget] = useState<RecSummary | null>(null);
  const hasSearch = searchQuery.trim().length > 0;

  const { data: activeCategoryRows } = useActiveCategories(true);

  const categories = useMemo((): Category[] => {
    if (activeCategoryRows?.length) {
      return [
        ALL_PILL,
        ...activeCategoryRows.map((row) => ({
          id: row.code,
          label: row.display_name,
          emoji: getCategoryEmoji(row.code),
          color: categoryPillColor(row.code),
        })),
      ];
    }
    return buildFallbackPills();
  }, [activeCategoryRows]);

  const { data: discoverData, isLoading: discoverLoading } = useDiscoverRecommendations(undefined, {
    enabled: !hasSearch,
  });
  const { data: searchData, isLoading: searchLoading } = useSearchRexes(
    { searchTerm: searchQuery, categoryId: activeCategory },
    { enabled: hasSearch },
  );

  const recs = hasSearch ? (searchData ?? []) : discoverData?.length ? discoverData : MOCK_RECS;

  const filtered = useMemo(() => {
    if (hasSearch) return recs;
    const byCategory =
      activeCategory === 'all' ? recs : recs.filter((r) => r.categoryId === activeCategory);
    return byCategory;
  }, [recs, activeCategory, hasSearch]);

  const isLoading = hasSearch ? searchLoading : discoverLoading;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-sm text-muted mt-3">Loading discover…</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={webContainerStyle}
        contentContainerClassName="pb-24"
        ListHeaderComponent={() => (
          <View style={webContainerStyle} className="px-4 pt-8 pb-3">
            <CategoryPills
              categories={categories}
              activeCategory={activeCategory}
              onSelect={setActiveCategory}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="items-center py-16">
            <Text className="text-4xl mb-3">🦖</Text>
            <Text className="text-sm text-muted">
              {hasSearch
                ? 'No matching recommendations. Try different words or filters.'
                : 'No recs yet. Be the first to add one!'}
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          const n = commentCountByRexId?.[item.id];
          const rec = n !== undefined ? { ...item, comments: n } : item;
          return (
            <View className="px-4">
              <RecommendationCard
                recommendation={rec}
                onTap={onOpenRec}
                onSave={(r) => setSaveTarget({ id: r.id, place_name: r.title, category_code: r.category, location: r.location })}
              />
            </View>
          );
        }}
      />

      <AddToCollectionSheet
        open={!!saveTarget}
        rec={saveTarget}
        onClose={() => setSaveTarget(null)}
      />
    </View>
  );
};

export default DiscoverView;
