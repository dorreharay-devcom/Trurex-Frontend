import React from 'react';
import { View } from 'react-native';
import { useMapScreen } from '~/features/map/hooks/screen/useMapScreen';
import MapLocationPromptBanner from '~/features/map/ui/overlays/MapLocationPromptBanner';
import MapSearchBar from '~/features/map/ui/search/MapSearchBar';
import { useMapLocationPrompt } from '~/pages/map/hooks/useMapLocationPrompt';
import { useMapPageState } from '~/pages/map/hooks/useMapPageState';
import MapCanvas from '~/pages/map/ui/MapCanvas';
import MapControlsOverlay from '~/pages/map/ui/MapControlsOverlay';
import MapEmptyBanners from '~/pages/map/ui/MapEmptyBanners';
import MapListView from '~/pages/map/ui/MapListView';
import MapPinOverlays from '~/pages/map/ui/MapPinOverlays';
import type { Recommendation } from '~/shared/types/recommendation';
import { webContainerStyle } from '~/utils';

type Props = {
  onRecommendationPress?: (rec: Recommendation) => void;
  onRexSheetOpenChange?: (open: boolean) => void;
};

const MapPage = ({ onRecommendationPress, onRexSheetOpenChange }: Props) => {
  const flow = useMapScreen({ onRecommendationPress });
  const page = useMapPageState({ flow, onRexSheetOpenChange });
  const locationPrompt = useMapLocationPrompt({
    locateMe: flow.locateMe,
    mapViewVisible: page.mapViewVisible,
  });

  return (
    <View className="relative min-h-0 w-full flex-1 bg-background pt-4">
      <View className="relative min-h-0 w-full flex-1 px-4 pb-5" style={webContainerStyle}>
        <View className="relative min-h-0 w-full flex-1">
          <MapCanvas
            hidden={flow.listView}
            markers={flow.mapMarkers}
            selectedId={flow.selectedRecId}
            onMarkerPress={page.onMarkerPress}
            onRegionChangeComplete={flow.onBoundsChange}
            initialRegion={flow.mapRegion}
            recenterTo={flow.recenterTo}
          />

          <MapControlsOverlay
            visible={page.mapViewVisible}
            layers={flow.layers}
            onLayersChange={flow.setLayers}
            onLocateMe={flow.locateMe}
            isError={flow.isError}
            onRetry={flow.refetch}
          />

          <MapPinOverlays
            visible={page.mapViewVisible}
            selectedRec={page.selectedRec}
            pinType={page.pinType}
            distanceLabel={page.distanceLabel}
            canSave={page.canSave}
            onClose={page.onClosePin}
            onViewFullRex={page.onViewFullRex}
            onSave={page.onSave}
            saveTarget={page.saveTarget}
            onCloseSave={page.onCloseSave}
            markRecSaved={page.markRecSaved}
            markRecUnsaved={page.markRecUnsaved}
            clearRecSavedOverride={page.clearRecSavedOverride}
          />

          <MapListView
            visible={flow.listView}
            rows={page.sortedList}
            selectedRecId={flow.selectedRecId}
            onPress={flow.focusOnRecommendation}
          />
        </View>

        <MapEmptyBanners
          showEmptyArea={page.showEmptyMapAreaBanner}
          showNoSearchMatch={page.showNoSearchMatchBanner}
        />

        <MapLocationPromptBanner
          visible={locationPrompt.visible}
          onAllow={locationPrompt.onAllow}
          onNotNow={locationPrompt.onNotNow}
        />

        <MapSearchBar
          value={flow.searchQuery}
          onChangeText={flow.setSearchQuery}
          suggestions={flow.suggestions}
          onSelectSuggestion={flow.focusOnRecommendation}
          listView={flow.listView}
          onToggleListView={page.toggleListView}
        />
      </View>
    </View>
  );
};

export default MapPage;
