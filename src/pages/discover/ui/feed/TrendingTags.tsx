import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TrendingUp } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { useTrendingTags } from '~/hooks/useTags';
import PillSkeletonRow from '~/pages/discover/ui/feed/PillSkeletonRow';

type TrendingTagsProps = {
  activeTag: string | null;
  onToggleTag: (slug: string) => void;
};

const TrendingTags = ({ activeTag, onToggleTag }: TrendingTagsProps) => {
  const { data: trendingTags = [], isPending } = useTrendingTags();

  return (
    <View className="mb-6">
      <View className="flex-row items-center gap-2 mb-3">
        <TrendingUp size={16} color={Theme.colors.primary} />
        <Text className="text-sm font-display font-semibold text-foreground">Trending Now</Text>
      </View>
      {isPending ? (
        <PillSkeletonRow />
      ) : (
        <View className="flex-row flex-wrap gap-2">
          {trendingTags.map((tag) => {
            const active = activeTag === tag.slug;
            return (
              <TouchableOpacity
                key={tag.id}
                onPress={() => onToggleTag(tag.slug)}
                activeOpacity={0.7}
                className={`px-3 py-1.5 rounded-full border ${active ? 'bg-primary border-primary' : 'bg-card border-border'}`}
              >
                <Text
                  className={`text-xs ${active ? 'text-primary-foreground font-semibold' : 'text-muted-foreground'}`}
                >
                  #{tag.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default TrendingTags;
