import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { recommendations } from '~/data/mockData';
import type { Recommendation } from '~/types/recommendation/recommendation';
import MarkerMap from '~/components/map/MarkerMap';
import { useMapScreen } from '~/hooks/map/useMapScreen';
import { SearchBar } from '~/components/map/common/SearchBar';
import { CategoryFilters } from '~/components/map/common/CategoryFilters';
import { EmptyOverlay } from '~/components/map/common/EmptyOverlay';
import { ResultsHeader } from '~/components/map/common/ResultsHeader';
import { ListRow } from '~/components/map/common/ListRow';

type Props = {
  onRecommendationPress?: (rec: Recommendation) => void;
};

const MapScreen: React.FC<Props> = ({ onRecommendationPress }) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    showFilters,
    toggleFilters,
    highlightedRecId,
    setHighlightedRecId,
    locatedRecs,
    filtered,
    mapMarkers,
    openRec,
    webHoverProps,
  } = useMapScreen({ recommendations, onRecommendationPress });

  const filtersActive = selectedCategory !== 'all';

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-4 pt-4 pb-28"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        showFilters={showFilters}
        filtersActive={filtersActive}
        onToggleFilters={toggleFilters}
      />

      {showFilters && (
        <CategoryFilters
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      )}

      <View className="relative mb-5">
        <MarkerMap
          markers={mapMarkers}
          highlightedId={highlightedRecId}
          onMarkerHoverIn={setHighlightedRecId}
          onMarkerHoverOut={() => setHighlightedRecId(null)}
          onMarkerPress={(id) => {
            const rec = filtered.find((r) => r.id === id);
            if (rec) openRec(rec);
          }}
        />
        {filtered.length === 0 && <EmptyOverlay />}
      </View>

      <ResultsHeader searchQuery={searchQuery} resultCount={filtered.length} />

      <View className="gap-2.5">
        {filtered.map((rec) => (
          <ListRow
            key={rec.id}
            rec={rec}
            highlighted={highlightedRecId === rec.id}
            onPress={() => openRec(rec)}
            {...webHoverProps(rec.id)}
          />
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
