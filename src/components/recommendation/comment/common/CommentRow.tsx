import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SignedUserAvatar } from '~/components/common/SignedUserAvatar';
import type { RexComment } from '~/types/recommendation/rexComment';
import { formatCompactRelativeTime } from '~/utils/date';
import { DeleteAction, ReplyAction } from './CommentActions';

export type CommentRowProps = {
  comment: RexComment;
  currentUserId?: string;
  rexOwnerId?: string;
  isReply?: boolean;
  onReply: (id: string) => void;
  onDelete: (id: string) => void;
  onUserPress?: (userId: string) => void;
};

export const CommentRow: React.FC<CommentRowProps> = ({
  comment,
  currentUserId,
  rexOwnerId,
  isReply,
  onReply,
  onDelete,
  onUserPress,
}) => {
  const canDelete =
    (currentUserId && currentUserId === comment.author_id) ||
    (currentUserId && rexOwnerId && currentUserId === rexOwnerId);
  const name = comment.profile?.display_name?.trim() || 'Member';

  const goToProfile = () => comment.author_id && onUserPress?.(comment.author_id);

  return (
    <View className={`flex-row gap-2.5 ${isReply ? 'ml-10' : ''}`}>
      <TouchableOpacity onPress={goToProfile} activeOpacity={0.7}>
        <SignedUserAvatar
          name={name}
          avatar={comment.profile?.avatar_url ?? undefined}
          className="mt-0.5 h-7 w-7"
        />
      </TouchableOpacity>
      <View className="min-w-0 flex-1">
        <View className="flex-row flex-wrap items-baseline gap-2">
          <TouchableOpacity onPress={goToProfile} activeOpacity={0.7}>
            <Text className="text-sm font-semibold text-foreground">{name}</Text>
          </TouchableOpacity>
          <Text className="text-[10px] text-muted-foreground">
            {formatCompactRelativeTime(comment.created_at)}
          </Text>
        </View>
        <Text className="mt-0.5 text-sm leading-relaxed text-foreground/90">{comment.body}</Text>
        <View className="mt-1 flex-row items-center gap-3">
          {!isReply ? <ReplyAction onPress={() => onReply(comment.id)} /> : null}
          {canDelete ? <DeleteAction onPress={() => onDelete(comment.id)} /> : null}
        </View>
      </View>
    </View>
  );
};
