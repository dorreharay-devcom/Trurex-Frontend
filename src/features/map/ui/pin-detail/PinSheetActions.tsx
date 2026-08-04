import React from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { Bookmark, ExternalLink, Navigation, Share2 } from 'lucide-react-native';
import { mapDirectionsUrl } from '~/features/map/lib/directions';
import { useShareRex } from '~/features/rex-detail/hooks/useShareRex';
import { Theme } from '~/shared/theme/Theme';
import type { Recommendation } from '~/shared/types/recommendation';

type Props = {
  pin: Recommendation;
  onViewFullRex: () => void;
  canSave: boolean;
  onSave: () => void;
};

const PinSheetActions = ({ pin, onViewFullRex, canSave, onSave }: Props) => {
  const { shareRecommendation } = useShareRex();

  return (
    <View className="flex-row flex-wrap gap-2">
      <Pressable
        onPress={onViewFullRex}
        className="min-w-0 flex-1 flex-row items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5"
      >
        <ExternalLink size={14} color={Theme.colors.primaryForeground} />
        <Text className="text-xs font-medium text-primary-foreground">View Full Rex</Text>
      </Pressable>

      {canSave && (
        <Pressable
          onPress={onSave}
          className="rounded-xl border border-border p-2.5 active:bg-muted/30"
          accessibilityRole="button"
        >
          <Bookmark
            size={16}
            color={pin.isSaved ? Theme.colors.primary : Theme.colors.foreground}
            fill={pin.isSaved ? Theme.colors.primary : 'transparent'}
          />
        </Pressable>
      )}

      <Pressable
        onPress={() => void Linking.openURL(mapDirectionsUrl(pin.location ?? pin.title))}
        className="rounded-xl border border-border p-2.5 active:bg-muted/30"
      >
        <Navigation size={16} color={Theme.colors.foreground} />
      </Pressable>

      <Pressable
        onPress={() => void shareRecommendation(pin)}
        className="rounded-xl border border-border p-2.5 active:bg-muted/30"
        accessibilityRole="button"
        accessibilityLabel="Share this recommendation"
      >
        <Share2 size={16} color={Theme.colors.foreground} />
      </Pressable>
    </View>
  );
};

export default PinSheetActions;
