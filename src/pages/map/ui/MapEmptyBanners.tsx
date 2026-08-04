import React from 'react';
import { Text, View } from 'react-native';
import { MAP_ACTION_INSET, MAP_LOCATION_PROMPT_TOP } from '~/features/map/config/mapUi';
import MapSearchRow from '~/features/map/ui/search/MapSearchRow';
import { androidElevation } from '~/shared/lib/ui/styles';

type Props = {
  showEmptyArea: boolean;
  showNoSearchMatch: boolean;
};

const bannerShellStyle = [
  {
    position: 'absolute' as const,
    left: MAP_ACTION_INSET,
    right: MAP_ACTION_INSET,
    top: MAP_LOCATION_PROMPT_TOP,
    zIndex: 1250,
  },
  androidElevation(14),
];

const MapEmptyBanners = ({ showEmptyArea, showNoSearchMatch }: Props) => {
  if (!showEmptyArea && !showNoSearchMatch) return null;

  return (
    <>
      {showEmptyArea && (
        <View pointerEvents="box-none" style={bannerShellStyle}>
          <MapSearchRow
            preserveTrailingWidth
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
      )}

      {showNoSearchMatch && (
        <View pointerEvents="box-none" style={bannerShellStyle}>
          <MapSearchRow
            preserveTrailingWidth
            field={
              <View className="rounded-2xl border border-border bg-card/95 p-4 text-center shadow-md">
                <Text className="text-sm font-medium text-foreground">
                  Looks like this business is waiting for its first Rex.
                </Text>
                <Text className="mt-1 text-xs text-muted-foreground">
                  Been here? Any insider tips? Help your network discover it. Add your Rex now.
                </Text>
              </View>
            }
          />
        </View>
      )}
    </>
  );
};

export default MapEmptyBanners;
