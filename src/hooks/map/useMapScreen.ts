import { useCallback, useMemo, useState } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import type { Recommendation } from '~/types/recommendation/recommendation';
import type { MapMarkerItem } from '~/types/map/mapMarker';
import {
  filterLocatedRecommendations,
  filterRecommendationsByCategoryId,
  filterRecommendationsBySearchQuery,
  recommendationsToMapMarkers,
} from '~/utils/map/mapRecommendationData';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Params = {
  recommendations: Recommendation[];
  onRecommendationPress?: (rec: Recommendation) => void;
};

/** Map tab state: search, category filters, marker list, highlighted recommendation. */
export function useMapScreen({ recommendations, onRecommendationPress }: Params) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [highlightedRecId, setHighlightedRecId] = useState<string | null>(null);

  const locatedRecs = useMemo(
    () => filterLocatedRecommendations(recommendations),
    [recommendations],
  );

  const filtered = useMemo(() => {
    let results = locatedRecs;
    results = filterRecommendationsBySearchQuery(results, searchQuery);
    results = filterRecommendationsByCategoryId(results, selectedCategory);
    return results;
  }, [locatedRecs, searchQuery, selectedCategory]);

  const mapMarkers: MapMarkerItem[] = useMemo(
    () => recommendationsToMapMarkers(filtered),
    [filtered],
  );

  const toggleFilters = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowFilters((v) => !v);
  }, []);

  const openRec = useCallback(
    (rec: Recommendation) => {
      setHighlightedRecId(rec.id);
      onRecommendationPress?.(rec);
    },
    [onRecommendationPress],
  );

  const webHoverProps = useCallback(
    (recId: string) =>
      Platform.OS === 'web'
        ? {
            onHoverIn: () => setHighlightedRecId(recId),
            onHoverOut: () => setHighlightedRecId(null),
          }
        : {},
    [],
  );

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    showFilters,
    setShowFilters,
    toggleFilters,
    highlightedRecId,
    setHighlightedRecId,
    locatedRecs,
    filtered,
    mapMarkers,
    openRec,
    webHoverProps,
  };
}
