import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { TrendingUp, Star, PlusCircle, ChevronDown, ChevronUp } from 'lucide-react-native';
import {
  DiscoverCategoryPinButton,
  DiscoverCategoryPinHintIcon,
} from '~/components/discover/DiscoverCategoryPin';
import AddToCollectionSheet, { RecSummary } from '~/components/faves/AddToCollectionSheet';
import { isWeb, webContainerStyle } from '~/utils';
import RecommendationCard, { Recommendation } from '~/components/recommendation/RecommendationCard';
import { useDiscoverRecommendations } from '~/hooks/useDiscovery';
import {
  useDiscoverSearchFilters,
  DISCOVER_VALUE_LABELS,
  DISCOVER_TIME_FILTER_OPTIONS,
} from '~/hooks/useDiscoverSearchFilters';
import { useActiveCategories } from '~/hooks/useActiveCategories';
import { usePinnedCategoryIds } from '~/hooks/usePinnedCategoryIds';
import { categoryPillColor } from '~/utils/recommendation/recCategoryNav';
import { CATEGORY_ICON_FALLBACK } from '~/utils/recommendation/categoryIconResolve';
import { getCategoryImage } from '~/utils/recommendation/categoryImages';
import { Theme } from '~/theme/Theme';
import type { RecommendationOpenOptions } from '~/types/recommendation/recommendation';
import { useAuth } from '~/services/AuthContext';
import { toastError } from '~/utils/appToast';
import { useTrendingTags } from '~/hooks/useTags';

const searchFilterPill = 'flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border';

type Category = {
  id: string;
  code: string;
  label: string;
  emoji: string;
  color: string;
  serverId?: string;
};

type DiscoverViewProps = {
  searchQuery?: string;

  onRecommendationPress?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
  onTapRec?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
  onCreateRex?: () => void;
  onAuthorPress?: (authorId: string) => void;
};

const DiscoverView = ({
  searchQuery = '',
  onRecommendationPress,
  onTapRec,
  onCreateRex,
}: DiscoverViewProps) => {
  const onOpenRec = onRecommendationPress ?? onTapRec;
  const { user } = useAuth();
  const { pinnedCategoryIds, togglePin, isTogglingPin } = usePinnedCategoryIds();

  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [saveTarget, setSaveTarget] = useState<RecSummary | null>(null);

  const handleSavePress = useCallback(
    (rec: Recommendation) => {
      if (rec.authorId && user && rec.authorId === user.id) {
        toastError("You can't save your own rex");
        return;
      }
      setSaveTarget({
        id: rec.id,
        place_name: rec.title,
        category_code: rec.categoryId,
        location: rec.location,
        isSaved: rec.isSaved,
      });
    },
    [user],
  );
  const [editingPinned, setEditingPinned] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const { data: trendingTags = [] } = useTrendingTags();
  const { width: screenWidth } = useWindowDimensions();
  const colCount = isWeb ? (screenWidth >= 1024 ? 5 : screenWidth >= 640 ? 4 : 3) : 3;
  const itemPct = `${(100 / colCount).toFixed(4)}%` as `${number}%`;

  const { data: activeCategoryRows, isPending: categoriesPending } = useActiveCategories(true);
  const allCats = useMemo((): Category[] => {
    if (!activeCategoryRows?.length) return [];
    return activeCategoryRows.map((row) => ({
      id: row.id,
      code: row.code,
      serverId: row.id,
      label: row.display_name,
      emoji: row.icon?.trim() || CATEGORY_ICON_FALLBACK,
      color: categoryPillColor(row.code),
    }));
  }, [activeCategoryRows]);

  const {
    hasSearch,
    searchRows,
    searchLoading,
    vfmFilter,
    searchCategoryFilter,
    recencyFilterDays,
    activeFilter,
    setActiveFilter,
    toggleVfm,
    toggleSearchCategory,
    toggleRecencyDay,
    clearAllFilters,
    hasActiveSearchFilters,
    filterChips,
  } = useDiscoverSearchFilters({ searchQuery, activeCategory, allCats });

  const isPinned = useCallback(
    (c: Category) => Boolean(c.serverId && pinnedCategoryIds.includes(c.serverId)),
    [pinnedCategoryIds],
  );

  const pinnedCats = useMemo(() => allCats.filter(isPinned), [allCats, isPinned]);
  const remainingCats = useMemo(() => allCats.filter((c) => !isPinned(c)), [allCats, isPinned]);
  const activeCat = allCats.find((c) => c.code === activeCategory);

  const { data: discoverData, isLoading: discoverLoading } = useDiscoverRecommendations(
    {
      category_filter: activeCategory !== 'all' ? activeCategory : null,
      tag_filters: activeTag ? [activeTag] : null,
    },
    { enabled: !hasSearch },
  );

  const filtered = useMemo(() => {
    if (hasSearch) return searchRows;
    return discoverData ?? [];
  }, [hasSearch, searchRows, discoverData]);

  const isLoading = hasSearch ? searchLoading : discoverLoading;

  const ListHeader = (
    <View className="px-4 pt-6 pb-2">
      {hasSearch && (
        <View className="mb-5">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
            <View className="flex-row gap-2 pb-1">
              {filterChips.map((chip) => {
                const { Icon } = chip;
                const isHeaderOn =
                  chip.active || activeFilter === chip.id
                    ? 'bg-primary/10 border-primary/40'
                    : 'bg-card border-border';
                return (
                  <TouchableOpacity
                    key={chip.id}
                    onPress={() => setActiveFilter(activeFilter === chip.id ? null : chip.id)}
                    activeOpacity={0.7}
                    className={`${searchFilterPill} ${isHeaderOn}`}
                  >
                    <Icon size={12} color={Theme.colors.foreground} />
                    <Text className="text-xs font-medium text-foreground">{chip.label}</Text>
                  </TouchableOpacity>
                );
              })}
              {hasActiveSearchFilters && (
                <TouchableOpacity onPress={clearAllFilters} className="px-2 justify-center">
                  <Text className="text-xs text-destructive font-medium">Clear all</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

          {activeFilter && (
            <View className="p-4 bg-card border border-border rounded-xl mb-2">
              {activeFilter === 'budget' && (
                <View className="flex-row flex-wrap gap-2">
                  {DISCOVER_VALUE_LABELS.map((label, i) => {
                    const val = i + 1;
                    const selected = vfmFilter.includes(val);
                    return (
                      <TouchableOpacity
                        key={val}
                        onPress={() => toggleVfm(val)}
                        className={`${searchFilterPill} ${
                          selected ? 'bg-primary border-primary' : 'bg-card border-border'
                        }`}
                      >
                        <Text
                          className={`text-xs font-medium ${
                            selected ? 'text-primary-foreground' : 'text-foreground'
                          }`}
                        >
                          {label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
              {activeFilter === 'category' && (
                <View className="flex-row flex-wrap gap-2">
                  {allCats.map((c) => {
                    const selected = searchCategoryFilter.includes(c.code);
                    return (
                      <TouchableOpacity
                        key={c.id}
                        onPress={() => toggleSearchCategory(c.code)}
                        className={`${searchFilterPill} ${
                          selected ? 'bg-primary border-primary' : 'bg-card border-border'
                        }`}
                      >
                        <Text style={{ fontSize: 12 }}>{c.emoji}</Text>
                        <Text
                          className={`text-xs font-medium ${selected ? 'text-primary-foreground' : 'text-foreground'}`}
                        >
                          {c.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
              {activeFilter === 'time' && (
                <View className="flex-row flex-wrap gap-2">
                  {DISCOVER_TIME_FILTER_OPTIONS.map((o) => {
                    const selected = recencyFilterDays.includes(o.days);
                    return (
                      <TouchableOpacity
                        key={o.days}
                        onPress={() => toggleRecencyDay(o.days)}
                        className={`${searchFilterPill} ${
                          selected ? 'bg-primary border-primary' : 'bg-card border-border'
                        }`}
                      >
                        <Text
                          className={`text-xs font-medium ${selected ? 'text-primary-foreground' : 'text-foreground'}`}
                        >
                          {o.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          )}
        </View>
      )}

      {!hasSearch && (
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-3">
            <TrendingUp size={16} color={Theme.colors.accent} />
            <Text className="text-sm font-display font-semibold text-foreground">Trending Now</Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {trendingTags.map((tag) => {
              const active = activeTag === tag.slug;
              return (
                <TouchableOpacity
                  key={tag.id}
                  onPress={() => setActiveTag(active ? null : tag.slug)}
                  activeOpacity={0.7}
                  className={`px-3 py-1.5 rounded-full border ${active ? 'bg-primary border-primary' : 'bg-card border-border'}`}
                >
                  <Text className={`text-xs ${active ? 'text-primary-foreground font-semibold' : 'text-muted-foreground'}`}>
                    #{tag.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {!hasSearch && pinnedCats.length > 0 && (
        <View className="mb-5">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <Star size={14} color={Theme.colors.primary} fill={Theme.colors.primary} />
              <Text className="text-sm font-display font-semibold text-foreground">
                Your Categories
              </Text>
            </View>
            <TouchableOpacity onPress={() => setEditingPinned((v) => !v)}>
              <Text className="text-xs text-primary font-medium">
                {editingPinned ? 'Done' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row flex-nowrap gap-2 pb-1">
              {pinnedCats.map((cat) => {
                const isActive = activeCategory === cat.code;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => {
                      if (editingPinned) {
                        if (cat.serverId) togglePin(cat.serverId, true);
                      } else {
                        setActiveCategory(cat.code === activeCategory ? 'all' : cat.code);
                      }
                    }}
                    className={`flex-row items-center gap-1.5 px-3.5 py-2 rounded-xl border ${isActive && !editingPinned ? 'border-primary/40 bg-primary/10' : 'bg-card border-border'}`}
                  >
                    <Text style={{ fontSize: 18 }}>{cat.emoji}</Text>
                    <Text
                      className={`text-xs font-semibold ${isActive && !editingPinned ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                      {cat.label}
                    </Text>
                    {editingPinned && <Text className="ml-1 text-destructive font-bold">×</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}

      {!hasSearch && (categoriesPending || allCats.length > 0) && (
        <View className="mb-8 w-full">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-display font-semibold text-foreground">
              {pinnedCats.length > 0 ? 'All Categories' : 'Browse by Category'}
            </Text>
            {!categoriesPending && pinnedCats.length > 0 && (
              <TouchableOpacity
                onPress={() => setShowAllCategories((v) => !v)}
                activeOpacity={0.7}
                className="flex-row items-center gap-1"
              >
                <Text className="text-xs text-muted-foreground">
                  {showAllCategories ? 'Show less' : `Show all ${allCats.length}`}
                </Text>
                {showAllCategories ? (
                  <ChevronUp size={14} color={Theme.colors.muted} />
                ) : (
                  <ChevronDown size={14} color={Theme.colors.muted} />
                )}
              </TouchableOpacity>
            )}
          </View>

          {categoriesPending && allCats.length === 0 ? (
            <View className="min-h-[120px] w-full items-center justify-center py-8">
              <ActivityIndicator color={Theme.colors.primary} />
            </View>
          ) : pinnedCats.length === 0 || showAllCategories ? (
            <View className="w-full flex-row flex-wrap">
              {allCats.map((cat) => {
                const isActive = activeCategory === cat.code;
                const pinned = isPinned(cat);
                return (
                  <View key={cat.id} className="relative" style={{ width: itemPct, padding: 6 }}>
                    <TouchableOpacity
                      onPress={() =>
                        setActiveCategory(cat.code === activeCategory ? 'all' : cat.code)
                      }
                      activeOpacity={0.8}
                      style={{ width: '100%', height: 74 }}
                      className={`flex-col items-center justify-center gap-1 rounded-2xl border ${
                        isActive ? 'bg-primary/10 border-primary/40' : 'bg-white border-gray-200'
                      }`}
                    >
                      {getCategoryImage(cat.code) ? (
                        <Image
                          source={getCategoryImage(cat.code)!}
                          style={{ width: 32, height: 32 }}
                          contentFit="contain"
                        />
                      ) : (
                        <Text style={{ fontSize: 24 }}>{cat.emoji}</Text>
                      )}
                      <Text
                        numberOfLines={2}
                        className={`text-[10px] font-bold tracking-tight text-center leading-tight px-1 ${
                          isActive ? 'text-primary' : 'text-gray-700'
                        }`}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                    <DiscoverCategoryPinButton
                      isPinned={pinned}
                      disabled={!cat.serverId || isTogglingPin}
                      onPress={() => {
                        if (cat.serverId) togglePin(cat.serverId, pinned);
                      }}
                    />
                  </View>
                );
              })}
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row flex-nowrap gap-2 pb-1">
                {remainingCats.map((cat) => {
                  const isActive = activeCategory === cat.code;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setActiveCategory(cat.code === activeCategory ? 'all' : cat.code)}
                      activeOpacity={0.8}
                      className={`flex-row items-center gap-1.5 px-3 py-2 rounded-xl border ${
                        isActive ? 'border-primary/40 bg-primary/10' : 'bg-card border-border'
                      }`}
                    >
                      <Text style={{ fontSize: 16 }}>{cat.emoji}</Text>
                      <Text className={`text-[10px] font-semibold whitespace-nowrap ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}

          {pinnedCats.length === 0 && !categoriesPending && (
            <View className="mt-3 flex-row items-center justify-center gap-1.5">
              <DiscoverCategoryPinHintIcon />
              <Text className="shrink text-xs text-muted-foreground text-center">
                Tap the pin on categories you use most to add them to your quick-access bar
              </Text>
            </View>
          )}
        </View>
      )}

      <Text className="text-sm font-display font-semibold text-foreground mb-4">
        {hasSearch
          ? `Results for "${searchQuery}"${hasActiveSearchFilters ? ' (filtered)' : ''}`
          : activeCategory !== 'all'
            ? `${activeCat?.emoji ?? ''} ${activeCat?.label ?? ''} Recs`
            : 'Latest Rex'}
      </Text>

      {isLoading && (
        <View className="gap-3">
          {[1, 2, 3].map((i) => (
            <View key={i} className="h-16 rounded-xl bg-muted" />
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1">
      <FlatList
        data={isLoading ? [] : filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={webContainerStyle}
        contentContainerClassName="pb-24"
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          isLoading ? null : (
            <View className="items-center py-16 px-4 gap-4">
              <Text className="text-4xl">🔍</Text>
              <Text className="font-display font-semibold text-foreground text-center">
                No recommendations here yet.
              </Text>
              <Text className="text-sm text-muted-foreground text-center">
                Know a great one? Add it.
              </Text>
              {onCreateRex && (
                <TouchableOpacity
                  onPress={onCreateRex}
                  activeOpacity={0.8}
                  className="flex-row items-center gap-2 px-5 py-2.5 rounded-xl bg-primary"
                >
                  <PlusCircle size={16} color="white" />
                  <Text className="text-sm font-semibold text-white">Add Recommendation</Text>
                </TouchableOpacity>
              )}
            </View>
          )
        }
        renderItem={({ item }) => (
          <View
            className="px-4 mb-4"
            style={isWeb ? { maxWidth: 680, width: '100%', alignSelf: 'center' } : undefined}
          >
            <RecommendationCard
              recommendation={item}
              onTap={onOpenRec}
              onSave={handleSavePress}
            />
          </View>
        )}
      />

      <AddToCollectionSheet
        open={!!saveTarget}
        onClose={() => setSaveTarget(null)}
        rec={saveTarget}
      />
    </View>
  );
};

export default DiscoverView;
