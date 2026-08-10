import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Star } from 'lucide-react-native';
import SignedStorageImage from '~/shared/ui/media/SignedStorageImage';
import { RexPhotoPlaceholder } from '~/shared/ui/media/RexPhotoPlaceholder';
import { REX_IMAGES_BUCKET } from '~/shared/config/app';
import { Theme } from '~/shared/theme/Theme';
import type { Recommendation } from '~/shared/types/recommendation';
import {
  rexCoverRemoteHttpUrl,
  rexCoverStoragePathFromRecommendation,
} from '~/shared/lib/media/rexImages';
import { gridCoverImageTransform } from '~/shared/lib/media/imageTransform';

type Props = {
  rec: Recommendation;
  width: number;
  onPress?: () => void;
};

function ProfileRexCard({ rec, width, onPress }: Props) {
  const coverPath = rexCoverStoragePathFromRecommendation(rec);
  const coverHttp = rexCoverRemoteHttpUrl(rec);
  const hasCoverImage = Boolean(coverPath || coverHttp);
  const transform = gridCoverImageTransform(width);

  return (
    <View style={{ width: '100%' }}>
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
            imageTransform={transform}
            recyclingKey={rec.id}
            priority="low"
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
    </View>
  );
}

export default ProfileRexCard;
