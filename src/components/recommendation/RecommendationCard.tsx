import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Star,
  MapPin,
  DollarSign,
} from 'lucide-react-native';
import { SignedStorageImage } from '~/components/common/SignedStorageImage';
import { SignedUserAvatar } from '~/components/common/SignedUserAvatar';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { Theme } from '~/theme/Theme';
import type { Recommendation } from '~/types/recommendation/recommendation';
import {
  rexCoverRemoteHttpUrl,
  rexCoverStoragePathFromRecommendation,
} from '~/utils/recommendation/rexMediaPaths';
import { valueForMoneyLabel } from '~/utils/recommendation/rexFeedDisplay';

export type { Recommendation };

interface RecommendationCardProps {
  recommendation: Recommendation;
  onTap?: (rec: Recommendation) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation: rec, onTap }) => {
  const [liked, setLiked] = useState(rec.isLiked);
  const [likes, setLikes] = useState(rec.likes);
  const [saved, setSaved] = useState(rec.isSaved);

  const user = rec.user ?? { name: 'Member', handle: '', avatar: '' };
  const tags = rec.tags ?? [];
  const coverPath = rexCoverStoragePathFromRecommendation(rec);
  const coverHttp = rexCoverRemoteHttpUrl(rec);
  const vfmLabel =
    rec.scoreValueForMoney != null ? valueForMoneyLabel(rec.scoreValueForMoney) : null;
  const showStarRating = rec.rating != null && rec.rating > 0;

  const toggleLike = () => {
    setLiked((v) => !v);
    setLikes((v) => (liked ? v - 1 : v + 1));
  };

  const Wrapper = onTap ? TouchableOpacity : View;

  return (
    <Wrapper
      {...(onTap ? { activeOpacity: 0.95, onPress: () => onTap(rec) } : {})}
      className="bg-card border border-border rounded-xl overflow-hidden mb-4"
    >
      <View className="flex-row items-center gap-3 p-4 pb-2">
        <SignedUserAvatar name={user.name} avatar={user.avatar} />
        <View className="flex-1">
          <Text className="text-sm font-semibold text-foreground">{user.name}</Text>
          <Text className="text-xs text-muted">
            {user.handle ? `${user.handle} · ` : ''}
            {rec.timeAgo}
          </Text>
        </View>
        <View className="rounded-full border border-border/80 bg-border/40 px-2.5 py-1">
          <Text className="text-xs font-medium capitalize text-foreground">{rec.category}</Text>
        </View>
      </View>

      <View className="mx-4 rounded-lg overflow-hidden">
        <SignedStorageImage
          bucket={REX_IMAGES_BUCKET}
          storagePath={coverPath}
          remoteUri={coverHttp}
          className="w-full aspect-[4/3]"
          accessibilityLabel={rec.title}
        />
        <View className="absolute bottom-0 left-0 right-0 p-3 bg-black/55">
          <Text className="text-lg font-bold text-white">{rec.title}</Text>
          <View className="mt-1 flex-row flex-wrap items-center gap-x-3 gap-y-1">
            {rec.location ? (
              <View className="flex-row items-center gap-1">
                <MapPin size={12} color="rgba(255,255,255,0.8)" />
                <Text className="text-xs text-white/80">{rec.location}</Text>
              </View>
            ) : null}
            {showStarRating ? (
              <View className="flex-row items-center gap-1">
                <Star
                  size={12}
                  color={Theme.colors.accentForeground}
                  fill={Theme.colors.accentForeground}
                />
                <Text className="text-xs text-accent-foreground">
                  {rec.rating != null && rec.rating % 1 === 0
                    ? String(rec.rating)
                    : rec.rating!.toFixed(1)}
                </Text>
              </View>
            ) : null}
            {vfmLabel ? (
              <View className="flex-row items-center gap-0.5">
                <DollarSign size={12} color="rgba(255,255,255,0.9)" />
                <Text className="text-[11px] text-white/90">{vfmLabel}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <Text className="px-4 pt-3 text-sm text-foreground opacity-[0.85]" numberOfLines={3}>
        {rec.description ?? ''}
      </Text>

      {tags.length > 0 && (
        <View className="flex-row flex-wrap gap-1.5 px-4 pt-2">
          {tags.map((tag) => (
            <View key={tag} className="rounded-full bg-muted px-2 py-0.5">
              <Text className="text-xs font-medium text-foreground">#{tag}</Text>
            </View>
          ))}
        </View>
      )}

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

          <TouchableOpacity className="flex-row items-center gap-1.5">
            <MessageCircle size={20} color={Theme.colors.muted} />
            <Text className="text-xs text-muted">{rec.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Share2 size={20} color={Theme.colors.muted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setSaved((v) => !v)}>
          <Bookmark
            size={20}
            color={saved ? Theme.colors.foreground : Theme.colors.muted}
            fill={saved ? Theme.colors.foreground : 'transparent'}
          />
        </TouchableOpacity>
      </View>
    </Wrapper>
  );
};

export default RecommendationCard;
