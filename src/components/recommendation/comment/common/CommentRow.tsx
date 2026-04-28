import React from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Flag } from 'lucide-react-native';
import { SignedUserAvatar } from '~/components/common/SignedUserAvatar';
import type { RexComment } from '~/types/recommendation/rexComment';
import { formatCompactRelativeTime } from '~/utils/date';
import { Theme } from '~/theme/Theme';
import { DeleteAction, LikeAction, ReplyAction } from './CommentActions';

export type CommentRowProps = {
  comment: RexComment;
  currentUserId?: string;
  rexOwnerId?: string;
  isReply?: boolean;
  onReply: (id: string) => void;
  onDelete: (id: string) => void;
  onUserPress?: (userId: string) => void;
  onToggleLike: (commentId: string, currentlyLiked: boolean) => void;
  onReport?: (commentId: string) => void;
};

export const CommentRow: React.FC<CommentRowProps> = ({
  comment,
  currentUserId,
  rexOwnerId,
  isReply,
  onReply,
  onDelete,
  onUserPress,
  onToggleLike,
  onReport,
}) => {
  const canDelete =
    (currentUserId && currentUserId === comment.author_id) ||
    (currentUserId && rexOwnerId && currentUserId === rexOwnerId);
  const name = comment.profile?.display_name?.trim() || 'Member';
  const canReport = Boolean(
    onReport && currentUserId && comment.author_id && currentUserId !== comment.author_id,
  );

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
        <View className="mt-1.5 flex-row flex-wrap items-center gap-2">
          <LikeAction
            count={comment.like_count ?? 0}
            liked={comment.liked_by_me ?? false}
            disabled={!currentUserId}
            onPress={() => onToggleLike(comment.id, comment.liked_by_me ?? false)}
          />
          <View className="flex-row flex-wrap items-center gap-1.5">
            {!isReply ? <ReplyAction onPress={() => onReply(comment.id)} /> : null}
            {canDelete ? <DeleteAction onPress={() => onDelete(comment.id)} /> : null}
            {canReport ? (
              <Pressable
                onPress={() => onReport?.(comment.id)}
                className="h-7 w-7 items-center justify-center rounded-md active:opacity-80"
                hitSlop={6}
                accessibilityLabel="Report comment"
                accessibilityRole="button"
              >
                <Flag size={12} color={Theme.colors.foreground} strokeWidth={1.5} />
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};
