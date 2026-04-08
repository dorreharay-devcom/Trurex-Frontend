import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { MapPin, Search, X, SlidersHorizontal } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';
import { textFieldCaretStyle } from '~/theme/Theme';
import type { Recommendation } from '~/types/recommendation/recommendation';
import { recommendations } from '~/data/mockData';
import RecommendationsMap from '~/components/map/RecommendationsMap';
import type { MapMarkerItem } from '~/components/map/mapTypes';
import { cn } from '~/utils/general';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FILTER_CATEGORIES: { id: string; label: string; emoji: string; color: string }[] = [
  { id: 'restaurants', label: 'Restaurants', emoji: '🍽️', color: '#f04a1e' },
  { id: 'cafes', label: 'Cafes', emoji: '☕', color: '#df7a11' },
  { id: 'hotels', label: 'Hotels', emoji: '🏨', color: '#2e86de' },
  { id: 'bars', label: 'Bars', emoji: '🍸', color: '#7a57d4' },
];

type Props = {
  onRecommendationPress?: (rec: Recommendation) => void;
};

const MapScreen: React.FC<Props> = ({ onRecommendationPress }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [highlightedRecId, setHighlightedRecId] = useState<string | null>(null);

  const locatedRecs = useMemo(
    () => (recommendations as Recommendation[]).filter((r) => r.location),
    [],
  );

  const filtered = useMemo(() => {
    let results = locatedRecs;
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      results = results.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.location?.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)) ||
          r.description.toLowerCase().includes(q),
      );
    }
    if (selectedCategory !== 'all') {
      results = results.filter((r) => r.categoryId === selectedCategory);
    }
    return results;
  }, [locatedRecs, searchQuery, selectedCategory]);

  const mapMarkers: MapMarkerItem[] = useMemo(
    () =>
      filtered
        .filter(
          (r): r is Recommendation & { latitude: number; longitude: number } =>
            r.latitude != null && r.longitude != null,
        )
        .map((r) => ({
          id: r.id,
          latitude: r.latitude,
          longitude: r.longitude,
          title: r.title,
          subtitle: r.location,
          imageUrl: r.image,
        })),
    [filtered],
  );

  const toggleFilters = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowFilters((v) => !v);
  };

  const openRec = (rec: Recommendation) => {
    setHighlightedRecId(rec.id);
    onRecommendationPress?.(rec);
  };

  const webHoverProps = (recId: string) =>
    Platform.OS === 'web'
      ? {
          onHoverIn: () => setHighlightedRecId(recId),
          onHoverOut: () => setHighlightedRecId(null),
        }
      : {};

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-4 pt-4 pb-28"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="relative mb-4">
        <View className="absolute left-3.5 top-0 bottom-0 z-10 justify-center">
          <Search size={16} color={Theme.colors.secondaryText} />
        </View>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search nearby — restaurants, cafés, bars..."
          placeholderTextColor={Theme.colors.muted}
          className="w-full pl-10 pr-24 py-3 rounded-2xl bg-card border border-border text-sm text-foreground"
          style={textFieldCaretStyle}
        />
        <View className="absolute right-2 top-0 bottom-0 flex-row items-center gap-1">
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => setSearchQuery('')}
              className="p-1.5 rounded-lg active:bg-muted/50"
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <X size={16} color={Theme.colors.secondaryText} />
            </Pressable>
          )}
          <Pressable
            onPress={toggleFilters}
            className={`p-2 rounded-xl ${showFilters || selectedCategory !== 'all' ? 'bg-primary/10' : 'active:bg-muted/50'}`}
            accessibilityRole="button"
            accessibilityLabel="Toggle filters"
          >
            <SlidersHorizontal
              size={16}
              color={
                showFilters || selectedCategory !== 'all'
                  ? Theme.colors.primary
                  : Theme.colors.secondaryText
              }
            />
          </Pressable>
        </View>
      </View>

      {showFilters && (
        <View className="mb-4">
          <View className="flex-row flex-wrap gap-2 pb-1">
            <Pressable
              onPress={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl border ${
                selectedCategory === 'all'
                  ? 'bg-primary border-primary'
                  : 'bg-card border-border active:opacity-80'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  selectedCategory === 'all' ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                All
              </Text>
            </Pressable>
            {FILTER_CATEGORIES.map((cat) => {
              const selected = selectedCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(selected ? 'all' : cat.id)}
                  className="px-3 py-1.5 rounded-xl border flex-row items-center gap-1.5 active:opacity-90"
                  style={{
                    backgroundColor: selected ? `${cat.color}26` : Theme.colors.card,
                    borderColor: selected ? `${cat.color}66` : Theme.colors.border,
                  }}
                >
                  <Text className="text-xs">{cat.emoji}</Text>
                  <Text
                    className="text-xs font-medium"
                    style={{ color: selected ? cat.color : Theme.colors.secondaryText }}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      <View className="relative mb-5">
        <RecommendationsMap
          markers={mapMarkers}
          highlightedId={highlightedRecId}
          onMarkerHoverIn={setHighlightedRecId}
          onMarkerHoverOut={() => setHighlightedRecId(null)}
          onMarkerPress={(id) => {
            const rec = filtered.find((r) => r.id === id);
            if (rec) openRec(rec);
          }}
        />
        {filtered.length === 0 && (
          <View className="absolute inset-0 items-center justify-center z-10 px-4 pointer-events-none rounded-2xl">
            <Search
              size={32}
              color={Theme.colors.muted}
              style={{ opacity: 0.4, marginBottom: 8 }}
            />
            <Text className="text-sm text-muted-foreground font-medium text-center">
              No results nearby
            </Text>
            <Text className="text-xs text-muted-foreground mt-0.5 text-center">
              Try a different search
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-sm font-display font-semibold text-foreground flex-1 pr-2">
          {searchQuery.trim() ? `Results for "${searchQuery.trim()}"` : 'Nearby Recommendations'}
        </Text>
        <Text className="text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? 'spot' : 'spots'}
        </Text>
      </View>

      <View className="gap-2.5">
        {filtered.map((rec) => (
          <Pressable
            key={rec.id}
            {...webHoverProps(rec.id)}
            onPress={() => openRec(rec)}
            className={cn(
              'flex-row items-center gap-3 p-3 rounded-xl bg-card border border-border shadow-card active:opacity-90',
              Platform.OS === 'web' &&
                highlightedRecId === rec.id &&
                'border-primary ring-2 ring-primary/25',
            )}
          >
            <Image
              source={{ uri: rec.image }}
              className="w-12 h-12 rounded-lg"
              resizeMode="cover"
            />
            <View className="flex-1 min-w-0">
              <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
                {rec.title}
              </Text>
              <View className="flex-row items-center gap-1 mt-0.5">
                <MapPin size={10} color={Theme.colors.secondaryText} />
                <Text className="text-xs text-muted-foreground flex-1" numberOfLines={1}>
                  {rec.location}
                </Text>
              </View>
              {rec.tags.length > 0 && (
                <View className="flex-row gap-1 mt-1 flex-wrap">
                  {rec.tags.slice(0, 2).map((tag) => (
                    <View key={tag} className="px-1.5 py-0.5 rounded-md bg-muted/30">
                      <Text className="text-[10px] text-muted-foreground">{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <View className="items-end shrink-0">
              {rec.rating != null && (
                <Text className="text-xs text-accent-foreground font-medium">★ {rec.rating}</Text>
              )}
              <Text className="text-[10px] text-muted-foreground mt-0.5">{rec.category}</Text>
            </View>
          </Pressable>
        ))}
        {filtered.length === 0 && locatedRecs.length > 0 && (
          <View className="items-center py-8">
            <Text className="text-sm text-muted-foreground text-center">
              No recommendations match your search.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default MapScreen;
