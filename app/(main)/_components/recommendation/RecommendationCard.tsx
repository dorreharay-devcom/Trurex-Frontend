import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Heart, MessageCircle, Share2, Bookmark, Star, MapPin } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';
import type { Recommendation } from '~/types/recommendation/recommendation';

export type { Recommendation };

interface RecommendationCardProps {
  recommendation: Recommendation;
  onTap?: (rec: Recommendation) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation: rec, onTap }) => {
  const [liked, setLiked] = useState(rec.isLiked);
  const [likes, setLikes] = useState(rec.likes);
  const [saved, setSaved] = useState(rec.isSaved);

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
      {/* Header */}
      <View className="flex-row items-center gap-3 p-4 pb-2">
        <Image
          source={{ uri: rec.user.avatar }}
          className="w-9 h-9 rounded-full border-2 border-border"
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text className="text-sm font-semibold text-foreground">{rec.user.name}</Text>
          <Text className="text-xs text-muted">
            {rec.user.handle} · {rec.timeAgo}
          </Text>
        </View>
        <View className="px-2.5 py-1 rounded-full bg-muted/20">
          <Text className="text-xs font-medium text-muted capitalize">{rec.category}</Text>
        </View>
      </View>

      {/* Image with gradient overlay */}
      <View className="mx-4 rounded-lg overflow-hidden">
        <Image source={{ uri: rec.image }} className="w-full aspect-[4/3]" resizeMode="cover" />
        <View className="absolute bottom-0 left-0 right-0 p-3 bg-black/55">
          <Text className="text-lg font-bold text-white">{rec.title}</Text>
          <View className="flex-row items-center gap-3 mt-1">
            {rec.location && (
              <View className="flex-row items-center gap-1">
                <MapPin size={12} color="rgba(255,255,255,0.8)" />
                <Text className="text-xs text-white/80">{rec.location}</Text>
              </View>
            )}
            {rec.rating && (
              <View className="flex-row items-center gap-1">
                <Star
                  size={12}
                  color={Theme.colors.accentForeground}
                  fill={Theme.colors.accentForeground}
                />
                <Text className="text-xs text-accent-foreground">{rec.rating}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Description */}
      <Text className="px-4 pt-3 text-sm text-foreground opacity-[0.85]" numberOfLines={3}>
        {rec.description}
      </Text>

      {/* Tags */}
      {rec.tags.length > 0 && (
        <View className="flex-row flex-wrap gap-1.5 px-4 pt-2">
          {rec.tags.map((tag) => (
            <View key={tag} className="px-2 py-0.5 rounded-full bg-muted/20">
              <Text className="text-xs text-muted">#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Actions */}
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
