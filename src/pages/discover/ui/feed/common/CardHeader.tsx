import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { SignedUserAvatar } from '~/shared/ui/SignedUserAvatar';
import type { Recommendation } from '~/shared/types/recommendation';

type Props = {
  rec: Recommendation;
  onRemove: (() => void) | undefined;
};

function CardHeader({ rec, onRemove }: Props) {
  const author = rec.user ?? { name: 'Member', handle: '', avatar: '' };
  return (
    <View className="flex-row items-center gap-3 p-4 pb-2">
      <SignedUserAvatar name={author.name} avatar={author.avatar} />
      <View className="flex-1">
        <Text className="text-sm font-semibold text-foreground">{author.name}</Text>
        <Text className="text-xs text-muted">
          {author.handle ? `${author.handle}\u00A0·\u00A0` : ''}
          {rec.timeAgo}
        </Text>
      </View>
      <View className="rounded-full border border-border/80 bg-border/40 px-2.5 py-1">
        <Text className="text-xs font-medium capitalize text-foreground">{rec.category}</Text>
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
