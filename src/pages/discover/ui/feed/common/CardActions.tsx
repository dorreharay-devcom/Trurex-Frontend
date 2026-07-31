import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react-native';
import { useLikeRex } from '~/pages/discover/hooks/useLikeRex';
import { useShareRex } from '~/hooks/useShareRex';
import { Theme } from '~/shared/theme/Theme';
import type { Recommendation, RecommendationOpenOptions } from '~/shared/types/recommendation';

type Props = {
  rec: Recommendation;
  onTap: ((rec: Recommendation, options?: RecommendationOpenOptions) => void) | undefined;
  onSave: ((rec: Recommendation) => void) | undefined;
};

function CardActions({ rec, onTap, onSave }: Props) {
  const { liked, likes, toggleLike } = useLikeRex(rec);
  const { shareRecommendation } = useShareRex();
  const saved = rec.isSaved ?? false;

  return (
    <View className="flex-row items-center justify-between px-4 py-3 mt-1">
      <View className="flex-row items-center gap-5">
        <TouchableOpacity onPress={toggleLike} className="flex-row items-center gap-1.5">
          <Heart
            size={20}
            color={liked ? Theme.colors.destructive : Theme.colors.muted}
            fill={liked ? Theme.colors.destructive : 'transparent'}
          />
          <Text className="text-xs text-muted">{likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onTap?.(rec, { scrollToComments: true })}
          disabled={!onTap}
          accessibilityRole="button"
          accessibilityLabel="View comments"
          className="flex-row items-center gap-1.5"
        >
          <MessageCircle size={20} color={Theme.colors.muted} />
          <Text className="text-xs text-muted">{rec.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => void shareRecommendation(rec)}
          accessibilityRole="button"
          accessibilityLabel="Share recommendation"
        >
          <Share2 size={20} color={Theme.colors.muted} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => onSave?.(rec)}>
        <Bookmark
          size={20}
          color={saved ? Theme.colors.primary : Theme.colors.muted}
          fill={saved ? Theme.colors.primary : 'transparent'}
        />
      </TouchableOpacity>
    </View>
  );
}

export default CardActions;
