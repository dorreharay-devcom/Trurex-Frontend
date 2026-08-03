import React, { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { SignedStorageImage } from '~/shared/ui/SignedStorageImage';
import { RexPhotoPlaceholder } from '~/shared/ui/RexPhotoPlaceholder';
import { REX_IMAGES_BUCKET } from '~/shared/config/app';
import { Theme } from '~/shared/theme/Theme';
import type { Recommendation } from '~/shared/types/recommendation';
import {
  rexCoverRemoteHttpUrl,
  rexCoverStoragePathFromRecommendation,
} from '~/shared/lib/media/rexImages';

type Props = {
  rec: Recommendation;
  index: number;
  width: number;
  onPress?: () => void;
};

const AnimatedRexCard = ({ rec, index, width, onPress }: Props) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;
  const coverPath = rexCoverStoragePathFromRecommendation(rec);
  const coverHttp = rexCoverRemoteHttpUrl(rec);
  const hasCoverImage = Boolean(coverPath || coverHttp);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 250,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, scale]);

  return (
    <Animated.View style={{ width, opacity, transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        className="overflow-hidden rounded-xl border border-border bg-background shadow-card"
      >
        {hasCoverImage ? (
          <SignedStorageImage
            bucket={REX_IMAGES_BUCKET}
            storagePath={coverPath}
            remoteUri={coverHttp}
            className="aspect-square w-full"
            accessibilityLabel={rec.title}
          />
        ) : (
          <RexPhotoPlaceholder
            categoryIcon={rec.categoryIcon}
            colors={rec.placeholderColors}
            className="aspect-square w-full"
            emojiSize={40}
            accessibilityLabel={rec.title}
          />
        )}
        <View className="p-2.5">
          <Text className="text-xs font-semibold text-foreground" numberOfLines={1}>
            {rec.title}
          </Text>
          <Text className="text-[11px] text-muted-foreground" numberOfLines={1}>
            {rec.location || rec.category}
          </Text>
          <View className="mt-1 h-4 flex-row items-center gap-1">
            {rec.rating != null && rec.rating > 0 && (
              <>
                <Star size={10} color={Theme.colors.ratingStar} fill={Theme.colors.ratingStar} />
                <Text className="text-[10px] font-medium text-rating-star">
                  {rec.rating % 1 === 0 ? String(rec.rating) : rec.rating.toFixed(1)}
                </Text>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AnimatedRexCard;
