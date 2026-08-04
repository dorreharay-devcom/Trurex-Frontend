import React from 'react';
import { View, Text, Pressable, type PressableProps } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { RexCoverThumbnail } from '~/shared/ui/RexCoverThumbnail';
import { Theme } from '~/shared/theme/Theme';
import type { Recommendation } from '~/shared/types/recommendation';
import { cn } from '~/shared/lib/ui/styles';
import { isWeb } from '~/shared/lib/ui/platform';

type HoverProps = Pick<PressableProps, 'onHoverIn' | 'onHoverOut'>;

type Props = {
  rec: Recommendation;
  highlighted: boolean;
  onPress: () => void;
} & Partial<HoverProps>;

const ListRow = ({ rec, highlighted, onPress, ...hoverProps }: Props) => {
  const tags = rec.tags ?? [];
  return (
    <Pressable
      {...hoverProps}
      onPress={onPress}
      className={cn(
        'flex-row items-center gap-3 p-3 rounded-xl bg-card border border-border shadow-card active:opacity-90',
        isWeb && highlighted && 'border-primary ring-2 ring-primary/25',
      )}
    >
      <RexCoverThumbnail rec={rec} className="h-12 w-12 rounded-lg" />
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
        {tags.length > 0 && (
          <View className="flex-row gap-1 mt-1 flex-wrap">
            {tags.slice(0, 2).map((tag) => (
              <View key={tag} className="px-1.5 py-0.5 rounded-md bg-muted/30">
                <Text className="text-[10px] text-muted-foreground">{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <View className="items-end shrink-0">
        {rec.rating != null && (
          <Text className="text-xs font-medium text-rating-star">★ {rec.rating}</Text>
        )}
        <Text className="text-[10px] text-muted-foreground mt-0.5">{rec.category}</Text>
      </View>
    </Pressable>
  );
};

export default ListRow;
