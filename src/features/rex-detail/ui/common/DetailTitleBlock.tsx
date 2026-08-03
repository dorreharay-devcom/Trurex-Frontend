import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MapPin, Link2, Bookmark } from 'lucide-react-native';
import type { RexDetailView } from '~/features/rex-detail/hooks/useRexDetail';
import { Theme } from '~/shared/theme/Theme';
import type { Recommendation } from '~/shared/types/recommendation';
import { categoryDisplayLabel, placeDisplayTitle } from '~/shared/lib/recommendation';
import { singleLineEllipsisTextStyle } from '~/shared/lib/ui/styles';

type SaveButtonProps = {
  isSaved: boolean;
  onPress: () => void;
};

function SaveButton({ isSaved, onPress }: SaveButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={isSaved ? 'Saved' : 'Save this recommendation'}
      className="flex-row items-center gap-1.5 rounded-full border border-border px-3 py-1.5 active:opacity-80"
    >
      <Bookmark
        size={14}
        color={isSaved ? Theme.colors.primary : Theme.colors.foreground}
        fill={isSaved ? Theme.colors.primary : 'transparent'}
      />
      <Text className="text-xs font-medium text-foreground">{isSaved ? 'Saved' : 'Save'}</Text>
    </Pressable>
  );
}

function WebsiteLink({ website }: { website: RexDetailView['website'] }) {
  if (!website.href) return null;
  return (
    <Pressable
      onPress={website.open}
      accessibilityRole="link"
      accessibilityLabel={`Open ${website.text}`}
      className="mt-1 flex-row items-center gap-1.5 self-start active:opacity-80"
      style={{ maxWidth: '100%' }}
    >
      <Link2 size={14} color="#2563eb" />
      <Text
        className="min-w-0 flex-1 text-sm font-medium text-blue-600"
        numberOfLines={1}
        ellipsizeMode="tail"
        style={singleLineEllipsisTextStyle}
      >
        {website.text}
      </Text>
    </Pressable>
  );
}

type Props = {
  recommendation: Recommendation;
  detail: RexDetailView;
  isSaved: boolean;
  onSavePress: () => void;
};

function DetailTitleBlock({ recommendation, detail, isSaved, onSavePress }: Props) {
  return (
    <View>
      <View className="mb-1 flex-row items-center justify-between gap-2">
        <View className="rounded-full border border-border/80 bg-border/40 px-2.5 py-1">
          <Text className="text-xs font-medium capitalize text-foreground">
            {categoryDisplayLabel(recommendation.category)}
          </Text>
        </View>
        <SaveButton isSaved={isSaved} onPress={onSavePress} />
      </View>
      <Text className="mt-2 font-display text-2xl font-bold text-foreground">
        {placeDisplayTitle(recommendation.title)}
      </Text>
      {detail.placeLocationLine ? (
        <View className="mt-1 flex-row items-center gap-1.5">
          <MapPin size={14} color={Theme.colors.secondaryText} />
          <Text className="text-sm text-muted-foreground">{detail.placeLocationLine}</Text>
        </View>
      ) : null}
      <WebsiteLink website={detail.website} />
      {detail.onlineLocationText ? (
        <Text className="mt-1 text-sm text-muted-foreground">{detail.onlineLocationText}</Text>
      ) : null}
    </View>
  );
}

export default DetailTitleBlock;
