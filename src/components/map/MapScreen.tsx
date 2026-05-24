import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, ScrollView, Text, Pressable, Platform, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Recommendation } from '~/types/recommendation/recommendation';
import MarkerMap from '~/components/map/MarkerMap';
import { useMapScreen } from '~/hooks/map/useMapScreen';
import { MapSearchBar } from '~/components/map/MapSearchBar';
import { MapSearchRow } from '~/components/map/MapSearchRow';
import { MapLegend } from '~/components/map/MapLegend';
import { MapLayerToggle } from '~/components/map/MapLayerToggle';
import { MapPinDetailSheet } from '~/components/map/MapPinDetailSheet';
import { MapLocationPromptBanner } from '~/components/map/MapLocationPromptBanner';
import AddToCollectionSheet, { RecSummary } from '~/components/faves/AddToCollectionSheet';
import { ListRow } from '~/components/map/common/ListRow';
import { Theme } from '~/theme/Theme';
import { MapPin, List, LocateFixed } from 'lucide-react-native';
import { MAP_ACTION_INSET, MAP_LOCATION_PROMPT_TOP } from '~/constants/map/mapUi';
import {
  deriveMapPinType,
  formatDistanceKm,
  haversineKm,
  isOwnRecommendation,
} from '~/utils/map/mapRecommendationData';
import { webContainerStyle } from '~/utils';

const MAP_LOCATION_PROMPT_DISMISSED_KEY = 'mapLocationPromptDismissed';

type Props = {
  onRecommendationPress?: (rec: Recommendation) => void;
};

const MapScreen: React.FC<Props> = ({ onRecommendationPress }) => {
  const flow = useMapScreen({ onRecommendationPress });
  const { locateMe } = flow;
  const [locationPromptVisible, setLocationPromptVisible] = useState(false);
  const [saveTarget, setSaveTarget] = useState<RecSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const dismissed = await AsyncStorage.getItem(MAP_LOCATION_PROMPT_DISMISSED_KEY);
        if (cancelled || dismissed === '1') return;
        const { status } = await Location.getForegroundPermissionsAsync();
        if (cancelled) return;
        if (status === 'granted') return;
        setLocationPromptVisible(true);
      } catch {
        if (!cancelled) setLocationPromptVisible(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onLocationNotNow = useCallback(async () => {
    await AsyncStorage.setItem(MAP_LOCATION_PROMPT_DISMISSED_KEY, '1');
    setLocationPromptVisible(false);
  }, []);

  const onLocationAllow = useCallback(async () => {
    setLocationPromptVisible(false);
    await Location.requestForegroundPermissionsAsync();
    void locateMe();
  }, [locateMe]);

  const distanceLabel = useMemo(() => {
    if (!flow.selectedRec?.latitude || flow.selectedRec.longitude == null || !flow.userCoords) {
      return undefined;
    }
    const km = haversineKm(flow.userCoords, {
      latitude: flow.selectedRec.latitude,
      longitude: flow.selectedRec.longitude,
    });
    return formatDistanceKm(km);
  }, [flow.selectedRec, flow.userCoords]);

  const pinType = flow.selectedRec ? deriveMapPinType(flow.selectedRec, flow.userId) : 'network';

  const canSaveSelected =
    flow.selectedRec != null && !isOwnRecommendation(flow.selectedRec, flow.userId);

  const sortedList = useMemo(() => {
    const rows = flow.locatedRecsForList;
    if (!flow.userCoords) return rows;
    return [...rows].sort((a, b) => {
      if (a.latitude == null || a.longitude == null) return 1;
      if (b.latitude == null || b.longitude == null) return -1;
      const dA = haversineKm(flow.userCoords!, {
        latitude: a.latitude,
        longitude: a.longitude,
      });
      const dB = haversineKm(flow.userCoords!, {
        latitude: b.latitude,
        longitude: b.longitude,
      });
      return dA - dB;
    });
  }, [flow.locatedRecsForList, flow.userCoords]);

  const searchTrailing = (
    <Pressable
      onPress={() => flow.setListView(!flow.listView)}
      className="h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/95 shadow-md"
      accessibilityRole="button"
      accessibilityLabel={flow.listView ? 'Show map' : 'Show list'}
    >
      {flow.listView ? (
        <MapPin size={16} color={Theme.colors.foreground} />
      ) : (
        <List size={16} color={Theme.colors.foreground} />
      )}
    </Pressable>
  );

  const actionBannerBottom = MAP_ACTION_INSET + 112;

  const mapViewVisible = !flow.listView;
  const mapDataReady = !flow.isLoading && !flow.isError;
  const hasSearchQuery = flow.searchQuery.trim().length > 0;

  const showEmptyMapAreaBanner =
    mapViewVisible && mapDataReady && flow.locatedRexCount === 0 && !hasSearchQuery;

  const showNoSearchMatchBanner = mapViewVisible && flow.mapMarkers.length === 0 && hasSearchQuery;

  return (
    <View className="relative min-h-0 w-full flex-1 bg-background pt-4">
      <View className="relative min-h-0 w-full flex-1 px-4 pb-5" style={webContainerStyle}>
        {!flow.listView ? (
          <View className="relative min-h-0 w-full flex-1">
            <View
              style={[
                StyleSheet.absoluteFillObject,
                { zIndex: 0 },
                Platform.OS === 'web' ? ({ isolation: 'isolate' } as const) : {},
              ]}
            >
              <View className="h-full w-full flex-1">
                <MarkerMap
                  markers={flow.mapMarkers}
                  selectedId={flow.selectedRecId}
                  onMarkerPress={flow.selectMarker}
                  onRegionChangeComplete={flow.onBoundsChange}
                  recenterTo={flow.recenterTo}
                />
              </View>
            </View>

            <View
              pointerEvents="box-none"
              style={[
                StyleSheet.absoluteFillObject,
                Platform.select({
                  web: { zIndex: 1100 },
                  default: { zIndex: 1100, elevation: 0 },
                }),
              ]}
            >
              <MapLegend />
              <MapLayerToggle visibility={flow.layers} onChange={flow.setLayers} />

              <Pressable
                onPress={() => void flow.locateMe()}
                className="absolute z-[1100] h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-md"
                style={[
                  {
                    position: 'absolute',
                    right: MAP_ACTION_INSET,
                    bottom: MAP_ACTION_INSET,
                    zIndex: 1100,
                    elevation: Platform.OS === 'android' ? 12 : 0,
                  },
                  Platform.OS === 'web' ? ({ cursor: 'pointer' } as const) : null,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Center map on your location"
              >
                <LocateFixed size={16} color={Theme.colors.foreground} />
              </Pressable>

              {flow.isError ? (
                <View
                  className="absolute z-[1000]"
                  style={{
                    position: 'absolute',
                    left: MAP_ACTION_INSET,
                    right: MAP_ACTION_INSET,
                    bottom: actionBannerBottom,
                  }}
                >
                  <View className="rounded-2xl border border-border bg-card/95 p-4 text-center shadow-md">
                    <Text className="text-sm font-medium text-foreground">
                      Couldn&apos;t load map data
                    </Text>
                    <Pressable
                      onPress={() => void flow.refetch()}
                      className="mt-2 self-center rounded-xl bg-primary px-4 py-2"
                    >
                      <Text className="text-xs font-medium text-primary-foreground">Retry</Text>
                    </Pressable>
                  </View>
                </View>
              ) : null}
            </View>

            {flow.selectedRec && (
              <MapPinDetailSheet
                recommendation={flow.selectedRec}
                pinType={pinType}
                distanceLabel={distanceLabel}
                onClose={flow.clearSelection}
                onViewFullRex={() => {
                  flow.openRec(flow.selectedRec!);
                  flow.clearSelection();
                }}
                onSave={
                  canSaveSelected
                    ? () => {
                        const r = flow.selectedRec!;
                        setSaveTarget({
                          id: r.id,
                          place_name: r.title,
                          category_code: r.category,
                          location: r.location,
                          isSaved: r.isSaved ?? false,
                        });
                      }
                    : undefined
                }
              />
            )}

            <AddToCollectionSheet
              open={!!saveTarget}
              rec={saveTarget}
              onClose={() => setSaveTarget(null)}
              onSaved={
                saveTarget ? () => flow.markRecSaved(saveTarget.id) : undefined
              }
              onUnsaved={
                saveTarget ? () => flow.markRecUnsaved(saveTarget.id) : undefined
              }
              onUnsaveFailed={
                saveTarget ? () => flow.markRecSaved(saveTarget.id) : undefined
              }
              onSaveRexFailed={
                saveTarget
                  ? () => flow.clearRecSavedOverride(saveTarget.id)
                  : undefined
              }
            />
          </View>
        ) : (
          <ScrollView
            className="flex-1 w-full pt-32"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={webContainerStyle}
            contentContainerClassName="w-full pb-28"
          >
            {sortedList.length === 0 ? (
              <View className="items-center py-12">
                <MapPin size={32} color={Theme.colors.secondaryText} style={{ opacity: 0.4 }} />
                <Text className="mt-2 text-sm font-medium text-muted-foreground">No Rex found</Text>
                <Text className="mt-1 text-center text-xs text-muted-foreground">
                  Adjust search or map filters
                </Text>
              </View>
            ) : (
              <View className="gap-2.5">
                {sortedList.map((rec) => (
                  <ListRow
                    key={rec.id}
                    rec={rec}
                    highlighted={flow.selectedRecId === rec.id}
                    onPress={() => flow.focusOnRecommendation(rec)}
                  />
                ))}
              </View>
            )}
          </ScrollView>
        )}

        {showEmptyMapAreaBanner ? (
          <View pointerEvents="box-none" style={styles.mapSearchEmptyBannerShell}>
            <MapSearchRow
              trailingSlot="preserve-width"
              field={
                <View className="rounded-2xl border border-border bg-card/95 p-4 text-center shadow-md">
                  <Text className="text-sm font-medium text-foreground">
                    Nothing in this area yet
                  </Text>
                  <Text className="mt-1 text-xs text-muted-foreground">
                    Pan the map or zoom out to load more Rex.
                  </Text>
                </View>
              }
            />
          </View>
        ) : null}

        {showNoSearchMatchBanner ? (
          <View pointerEvents="box-none" style={styles.mapSearchEmptyBannerShell}>
            <MapSearchRow
              trailingSlot="preserve-width"
              field={
                <View className="rounded-2xl border border-border bg-card/95 p-4 text-center shadow-md">
                  <Text className="text-sm font-medium text-foreground">
                    No Rex match that name
                  </Text>
                  <Text className="mt-1 text-xs text-muted-foreground">
                    Try another title or clear the search.
                  </Text>
                </View>
              }
            />
          </View>
        ) : null}

        {!flow.listView ? (
          <MapLocationPromptBanner
            visible={locationPromptVisible}
            onAllow={onLocationAllow}
            onNotNow={onLocationNotNow}
          />
        ) : null}

        <MapSearchBar
          value={flow.searchQuery}
          onChangeText={flow.setSearchQuery}
          suggestions={flow.suggestions}
          onSelectSuggestion={(rec) => flow.focusOnRecommendation(rec)}
          trailing={searchTrailing}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapSearchEmptyBannerShell: {
    position: 'absolute',
    left: MAP_ACTION_INSET,
    right: MAP_ACTION_INSET,
    top: MAP_LOCATION_PROMPT_TOP,
    zIndex: 1250,
    elevation: Platform.OS === 'android' ? 14 : 0,
  },
});

export default MapScreen;
