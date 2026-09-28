import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import type { Recommendation } from '~/shared/types/recommendation';
import { authorDisplayName, categoryDisplayLabel } from '~/shared/lib/recommendation';
import { formatRelativeTime } from '~/shared/lib/data/date';
import { SignedUserAvatar } from '~/shared/ui/media/SignedUserAvatar';

type Props = {
  rec: Recommendation;
  onRemove: (() => void) | undefined;
};

function CardHeader({ rec, onRemove }: Props) {
  const name = authorDisplayName(rec.user);
  const handle = rec.user?.handle?.trim() ?? '';
  const timeAgo = formatRelativeTime(rec.createdAt);

  return (
    <View className="flex-row items-center gap-3 p-4 pb-2">
      <SignedUserAvatar name={name} avatar={rec.user?.avatar} />
      <View className="flex-1">
        <Text className="text-sm font-semibold text-foreground">{name}</Text>
        <Text className="text-xs text-muted">
          {handle ? `${handle}\u00A0·\u00A0` : ''}
          {timeAgo}
        </Text>
      </View>
      <View className="rounded-full border border-border/80 bg-border/40 px-2.5 py-1">
        <Text className="text-xs font-medium capitalize text-foreground">
          {categoryDisplayLabel(rec.category)}
        </Text>
      </View>
      {onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          className="w-7 h-7 rounded-full bg-destructive items-center justify-center"
        >
          <X size={13} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default CardHeader;
