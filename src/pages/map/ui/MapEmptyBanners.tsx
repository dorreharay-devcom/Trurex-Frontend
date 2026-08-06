import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { MAP_ACTION_INSET, MAP_LOCATION_PROMPT_TOP } from '~/features/map/config/mapUi';
import MapSearchRow from '~/features/map/ui/search/MapSearchRow';
import { androidElevation } from '~/shared/lib/ui/styles';

type Props = {
  showEmptyArea: boolean;
  showNoSearchMatch: boolean;
  showLoadError: boolean;
  onRetry?: () => void | Promise<void>;
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

function BannerCard({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <View className="rounded-2xl border border-border bg-card/95 p-4 text-center shadow-md">
      <Text className="text-sm font-medium text-foreground">{title}</Text>
      {subtitle ? <Text className="mt-1 text-xs text-muted-foreground">{subtitle}</Text> : null}
      {action}
    </View>
  );
}

const MapEmptyBanners = ({ showEmptyArea, showNoSearchMatch, showLoadError, onRetry }: Props) => {
  if (!showEmptyArea && !showNoSearchMatch && !showLoadError) return null;

  return (
    <>
      {showLoadError && (
        <View pointerEvents="box-none" style={bannerShellStyle}>
          <MapSearchRow
            preserveTrailingWidth
            field={
              <BannerCard
                title="Couldn't load map data"
                subtitle="Check your connection, then try again."
                action={
                  onRetry ? (
                    <Pressable
                      onPress={() => void onRetry()}
                      className="mt-3 self-center rounded-xl bg-primary px-4 py-2"
                      accessibilityRole="button"
                      accessibilityLabel="Retry loading map data"
                    >
                      <Text className="text-xs font-medium text-primary-foreground">Retry</Text>
                    </Pressable>
                  ) : null
                }
              />
            }
          />
        </View>
      )}

      {!showLoadError && showEmptyArea && (
        <View pointerEvents="box-none" style={bannerShellStyle}>
          <MapSearchRow
            preserveTrailingWidth
            field={
              <BannerCard
                title="Nothing in this area yet"
                subtitle="Pan the map or zoom out to load more Rex."
              />
            }
          />
        </View>
      )}

      {!showLoadError && showNoSearchMatch && (
        <View pointerEvents="box-none" style={bannerShellStyle}>
          <MapSearchRow
            preserveTrailingWidth
            field={
              <BannerCard
                title="Looks like this business is waiting for its first Rex."
                subtitle="Been here? Any insider tips? Help your network discover it. Add your Rex now."
              />
            }
          />
        </View>
      )}
    </>
  );
};

export default MapEmptyBanners;
