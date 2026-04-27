import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import {
  TrendingUp,
  Star,
  DollarSign,
  Clock,
  Users,
  Tag,
  PlusCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import {
  DiscoverCategoryPinButton,
  DiscoverCategoryPinHintIcon,
} from '~/components/discover/DiscoverCategoryPin';
import { DiscoverRemainingCategoryPills } from '~/components/discover/DiscoverRemainingCategoryPills';
import AddToCollectionSheet, { RecSummary } from '~/components/faves/AddToCollectionSheet';
import { webContainerStyle } from '~/utils';
import RecommendationCard, { Recommendation } from '~/components/recommendation/RecommendationCard';
import { useDiscoverRecommendations, useSearchRexes } from '~/hooks/useDiscovery';
import { useActiveCategories } from '~/hooks/useActiveCategories';
import { usePinnedCategoryIds } from '~/hooks/usePinnedCategoryIds';
import { categoryPillColor } from '~/utils/recommendation/categoryPillColor';
import { getCategoryEmoji } from '~/constants/recommendation/rexCategories';
import { Theme } from '~/theme/Theme';
import { MOCK_RECS } from '~/constants/recommendation/mockRecommendations';
import type { RecommendationOpenOptions } from '~/types/recommendation/recommendation';

const VALUE_LABELS = ['Total Steal', 'Budget-Friendly', 'Good Value', 'Worth It', 'Splurge'];
const OCCASION_OPTIONS = [
  'Date night',
  'Family',
  'Solo',
  'Work',
  'Celebration',
  'Groups',
  'First timers',
];
const RECENCY_OPTIONS = [
  { label: 'Today', days: 1 },
  { label: 'This week', days: 7 },
  { label: 'This month', days: 30 },
  { label: 'All time', days: 9999 },
];
const TRENDING_TAGS = ['pasta', 'speakeasy', 'santorini', 'memoir'];

const FALLBACK_CATEGORY_CODES = [
  { code: 'restaurants', label: 'Restaurants' },
  { code: 'cafes_coffee_shops', label: 'Cafes' },
  { code: 'hotels_accommodation', label: 'Hotels' },
  { code: 'experiences_tour_guides', label: 'Experiences' },
  { code: 'growth_learning', label: 'Learning' },
  { code: 'bars_nightlife', label: 'Bars' },
  { code: 'real_estate', label: 'Real estate' },
];

type Category = {
  id: string;
  code: string;
  label: string;
  emoji: string;
  color: string;
  serverId?: string;
};

function buildFallbackCategories(): Category[] {
  return FALLBACK_CATEGORY_CODES.map(({ code, label }) => ({
    id: code,
    code,
    label,
    emoji: getCategoryEmoji(code),
    color: categoryPillColor(code),
  }));
}

type DiscoverViewProps = {
  searchQuery?: string;

  onRecommendationPress?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
  onTapRec?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
  onCreateRex?: () => void;
};

const DiscoverView = ({
  searchQuery = '',
  onRecommendationPress,
  onTapRec,
  onCreateRex,
}: DiscoverViewProps) => {
  const onOpenRec = onRecommendationPress ?? onTapRec;
  const { pinnedCategoryIds, togglePin, isTogglingPin } = usePinnedCategoryIds();

  const [activeCategory, setActiveCategory] = useState('all');
  const [saveTarget, setSaveTarget] = useState<RecSummary | null>(null);
  const [editingPinned, setEditingPinned] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const [budgetRange, setBudgetRange] = useState<[number, number]>([1, 5]);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterOccasion, setFilterOccasion] = useState<string | null>(null);
  const [filterRecency, setFilterRecency] = useState<number>(9999);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const hasSearch = searchQuery.trim().length > 0;
  const hasActiveFilters =
    budgetRange[0] !== 1 ||
    budgetRange[1] !== 5 ||
    filterCategory ||
    filterOccasion ||
    filterRecency !== 9999;

  const { data: activeCategoryRows } = useActiveCategories(true);
  const allCats = useMemo((): Category[] => {
    if (activeCategoryRows?.length) {
      return activeCategoryRows.map((row) => ({
        id: row.id,
        code: row.code,
        serverId: row.id,
        label: row.display_name,
        emoji: row.icon || '',
        color: categoryPillColor(row.code),
      }));
    }
    return buildFallbackCategories();
  }, [activeCategoryRows]);

  const isPinned = useCallback(
    (c: Category) => Boolean(c.serverId && pinnedCategoryIds.includes(c.serverId)),
    [pinnedCategoryIds],
  );

  const pinnedCats = useMemo(() => allCats.filter(isPinned), [allCats, isPinned]);
  const remainingCats = useMemo(
    () => allCats.filter((c) => !isPinned(c)),
    [allCats, isPinned],
  );
  const showRemainingPills =
    !hasSearch &&
    pinnedCats.length > 0 &&
    !showAllCategories &&
    remainingCats.length > 0;
  const activeCat = allCats.find((c) => c.code === activeCategory);

  const { data: discoverData, isLoading: discoverLoading } = useDiscoverRecommendations(undefined, {
    enabled: !hasSearch,
  });
  const { data: searchData, isLoading: searchLoading } = useSearchRexes(
    { searchTerm: searchQuery, categoryId: activeCategory },
    { enabled: hasSearch },
  );

  const rawRecs = hasSearch ? (searchData ?? []) : discoverData?.length ? discoverData : MOCK_RECS;

  const filtered = useMemo(() => {
    let results = [...rawRecs];
    if (!hasSearch && activeCategory !== 'all') {
      results = results.filter((r) => r.categoryId === activeCategory);
    }
    if (filterCategory) {
      results = results.filter(
        (r) => r.category === filterCategory || r.categoryId === filterCategory,
      );
    }
    if (budgetRange[0] !== 1 || budgetRange[1] !== 5) {
      results = results.filter((r) => {
        if (!r.scoreValueForMoney) return true;
        return r.scoreValueForMoney >= budgetRange[0] && r.scoreValueForMoney <= budgetRange[1];
      });
    }
    if (filterOccasion) {
      const occ = filterOccasion.toLowerCase();
      results = results.filter(
        (r) =>
          (r.tags ?? []).some((t) => t.toLowerCase().includes(occ)) ||
          (r.description ?? '').toLowerCase().includes(occ),
      );
    }
    if (filterRecency !== 9999) {
      const cutoff = Date.now() - filterRecency * 24 * 60 * 60 * 1000;
      results = results.filter((r) => new Date(r.timeAgo ?? 0).getTime() > cutoff);
    }
    return results;
  }, [
    rawRecs,
    hasSearch,
    activeCategory,
    filterCategory,
    budgetRange,
    filterOccasion,
    filterRecency,
  ]);

  const isLoading = hasSearch ? searchLoading : discoverLoading;

  const ListHeader = (
    <View className="px-4 pt-6 pb-2">
      {/* ── Search filters ─────────────────────────────────────────────────── */}
      {hasSearch && (
        <View className="mb-5">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
            <View className="flex-row gap-2 pb-1">
              {[
                {
                  id: 'budget',
                  label:
                    budgetRange[0] !== 1 || budgetRange[1] !== 5
                      ? `$${budgetRange[0]}–$${budgetRange[1]}`
                      : 'Budget',
                  Icon: DollarSign,
                  active: budgetRange[0] !== 1 || budgetRange[1] !== 5,
                },
                {
                  id: 'category',
                  label: filterCategory
                    ? (allCats.find((c) => c.code === filterCategory)?.label ?? 'Category')
                    : 'Category',
                  Icon: Tag,
                  active: !!filterCategory,
                },
                {
                  id: 'occasion',
                  label: filterOccasion ?? 'Occasion',
                  Icon: Users,
                  active: !!filterOccasion,
                },
                {
                  id: 'recency',
                  label: RECENCY_OPTIONS.find((r) => r.days === filterRecency)?.label ?? 'Recency',
                  Icon: Clock,
                  active: filterRecency !== 9999,
                },
              ].map((chip) => {
                const { Icon } = chip;
                return (
                  <TouchableOpacity
                    key={chip.id}
                    onPress={() => setActiveFilter(activeFilter === chip.id ? null : chip.id)}
                    activeOpacity={0.7}
                    className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                      chip.active
                        ? 'bg-primary border-primary'
                        : activeFilter === chip.id
                          ? 'bg-muted border-border'
                          : 'bg-card border-border'
                    }`}
                  >
                    <Icon
                      size={12}
                      color={chip.active ? Theme.colors.primaryForeground : Theme.colors.muted}
                    />
                    <Text
                      className={`text-xs font-medium ${chip.active ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                    >
                      {chip.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              {hasActiveFilters && (
                <TouchableOpacity
                  onPress={() => {
                    setBudgetRange([1, 5]);
                    setFilterCategory(null);
                    setFilterOccasion(null);
                    setFilterRecency(9999);
                    setActiveFilter(null);
                  }}
                  className="px-2 justify-center"
                >
                  <Text className="text-xs text-destructive font-medium">Clear all</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

          {activeFilter && (
            <View className="p-4 bg-card border border-border rounded-xl mb-2">
              {activeFilter === 'budget' && (
                <View className="flex-row gap-2">
                  {VALUE_LABELS.map((label, i) => {
                    const val = i + 1;
                    const selected = val >= budgetRange[0] && val <= budgetRange[1];
                    return (
                      <TouchableOpacity
                        key={val}
                        onPress={() =>
                          setBudgetRange(
                            budgetRange[0] === val && budgetRange[1] === val ? [1, 5] : [val, val],
                          )
                        }
                        className={`flex-1 py-1.5 rounded-lg items-center border ${selected ? 'bg-primary border-primary' : 'bg-muted/50 border-border'}`}
                      >
                        <Text
                          className={`text-[10px] font-semibold ${selected ? 'text-primary-foreground' : 'text-muted-foreground'}`}
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
                  {allCats.map((c) => (
                    <TouchableOpacity
                      key={c.id}
                      onPress={() => {
                        setFilterCategory(filterCategory === c.code ? null : c.code);
                        setActiveFilter(null);
                      }}
                      className={`flex-row items-center gap-1 px-3 py-1.5 rounded-full border ${filterCategory === c.code ? 'bg-primary border-primary' : 'bg-muted/50 border-border'}`}
                    >
                      <Text style={{ fontSize: 12 }}>{c.emoji}</Text>
                      <Text
                        className={`text-xs font-medium ${filterCategory === c.code ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                      >
                        {c.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {/* ... other filters ... */}
            </View>
          )}
        </View>
      )}

      {/* ── Trending tags ─────────────────────────────────────────────────── */}
      {!hasSearch && (
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-3">
            <TrendingUp size={16} color={Theme.colors.accent} />
            <Text className="text-sm font-display font-semibold text-foreground">Trending Now</Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {TRENDING_TAGS.map((tag) => (
              <TouchableOpacity
                key={tag}
                className="px-3 py-1.5 rounded-full bg-card border border-border"
              >
                <Text className="text-xs text-muted-foreground">#{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* ── Pinned categories ──────────────────────────────────────────────── */}
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
            <View className="flex-row gap-2 pb-1">
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
                    {editingPinned && (
                      <Text className="ml-1 text-destructive font-bold">×</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}

      {!hasSearch && allCats.length > 0 && (
        <View className="mb-8 w-full">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-display font-semibold text-foreground">
              {pinnedCats.length > 0 ? 'All Categories' : 'Browse by Category'}
            </Text>
            {pinnedCats.length > 0 && (
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

          {showRemainingPills ? (
            <DiscoverRemainingCategoryPills
              categories={remainingCats.map((c) => ({ id: c.code, label: c.label, emoji: c.emoji }))}
              activeCategoryId={activeCategory}
              onSelectCategory={(id) => setActiveCategory(id === activeCategory ? 'all' : id)}
            />
          ) : (
            <>
              <View className="w-full flex-row flex-wrap justify-center gap-3">
                {allCats.map((cat) => {
                  const isActive = activeCategory === cat.code;
                  const pinned = isPinned(cat);
                  return (
                    <View key={cat.id} className="relative" style={{ width: 230 }}>
                      <TouchableOpacity
                        onPress={() =>
                          setActiveCategory(cat.code === activeCategory ? 'all' : cat.code)
                        }
                        activeOpacity={0.8}
                        style={{ width: 230, height: 74 }}
                        className={`flex-col items-center justify-center gap-1 rounded-2xl border ${
                          isActive ? 'bg-primary/10 border-primary/40' : 'bg-white border-gray-200'
                        }`}
                      >
                        <Text style={{ fontSize: 24 }}>{cat.emoji}</Text>
                        <Text
                          className={`text-[11px] font-bold tracking-tight ${
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
              {pinnedCats.length === 0 && (
                <View className="mt-3 flex-row items-center justify-center gap-1.5">
                  <DiscoverCategoryPinHintIcon />
                  <Text className="shrink text-xs text-muted-foreground text-center">
                    Tap the pin on categories you use most to add them to your quick-access bar
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      )}

      {/* ── Feed title ──────────────────────────────────────────────────────── */}
      <Text className="text-sm font-display font-semibold text-foreground mb-4">
        {hasSearch
          ? `Results for "${searchQuery}"${hasActiveFilters ? ' (filtered)' : ''}`
          : activeCategory !== 'all'
            ? `${activeCat?.emoji ?? ''} ${activeCat?.label ?? ''} Recs`
            : 'Latest Rex'}
      </Text>

      {isLoading && (
        <View className="gap-4">
          {[1, 2, 3].map((i) => (
            <View key={i} className="bg-card border border-border rounded-xl p-4 gap-3">
              <View className="flex-row items-center gap-3">
                <View className="w-9 h-9 rounded-full bg-muted" />
                <View className="gap-1.5">
                  <View className="h-3.5 w-24 bg-muted rounded" />
                  <View className="h-3 w-32 bg-muted rounded" />
                </View>
              </View>
              <View className="w-full aspect-[4/3] rounded-lg bg-muted" />
              <View className="h-4 w-3/4 bg-muted rounded" />
            </View>
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
          <View className="px-4 mb-4">
            <RecommendationCard
              recommendation={item}
              onTap={onOpenRec}
              onSave={(rec) =>
                setSaveTarget({
                  id: rec.id,
                  place_name: rec.title,
                  category_code: rec.categoryId,
                  location: rec.location,
                  isSaved: rec.isSaved,
                })
              }
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
