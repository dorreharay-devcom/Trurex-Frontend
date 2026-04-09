import React from 'react';
import { View, Text, Pressable, Image, Platform, type PressableProps } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';
import type { Recommendation } from '~/types/recommendation/recommendation';
import { cn } from '~/utils/general';

type HoverProps = Pick<PressableProps, 'onHoverIn' | 'onHoverOut'>;

type Props = {
  rec: Recommendation;
  highlighted: boolean;
  onPress: () => void;
} & Partial<HoverProps>;

export const ListRow: React.FC<Props> = ({ rec, highlighted, onPress, ...hoverProps }) => (
  <Pressable
    {...hoverProps}
    onPress={onPress}
    className={cn(
      'flex-row items-center gap-3 p-3 rounded-xl bg-card border border-border shadow-card active:opacity-90',
      Platform.OS === 'web' && highlighted && 'border-primary ring-2 ring-primary/25',
    )}
  >
    <Image source={{ uri: rec.image }} className="w-12 h-12 rounded-lg" resizeMode="cover" />
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
);
