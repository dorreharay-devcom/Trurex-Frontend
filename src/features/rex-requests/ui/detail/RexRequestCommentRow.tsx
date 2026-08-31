import React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Flag } from 'lucide-react-native';
import { SignedUserAvatar } from '~/shared/ui/media/SignedUserAvatar';
import { formatCompactRelativeTime } from '~/shared/lib/data/date';
import { Theme } from '~/shared/theme/Theme';
import type { RexRequestCommentRow as RexRequestCommentRowType } from '~/features/rex-requests/api/types';

type Props = {
  comment: RexRequestCommentRowType;
  currentUserId?: string;
  onUserPress?: (userId: string) => void;
  onReport?: (commentId: string) => void;
};

function RexRequestCommentRow({ comment, currentUserId, onUserPress, onReport }: Props) {
  const name = comment.commenter_display_name?.trim() || 'Member';
  const goToProfile = () => onUserPress?.(comment.commenter_id);
  const canReport = Boolean(onReport && currentUserId && currentUserId !== comment.commenter_id);

  return (
    <View className="flex-row gap-2.5">
      <TouchableOpacity onPress={goToProfile} activeOpacity={0.7}>
        <SignedUserAvatar
          name={name}
          avatar={comment.commenter_avatar_url ?? undefined}
          className="mt-0.5 h-7 w-7"
          sizePt={28}
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
        {canReport ? (
          <Pressable
            onPress={() => onReport?.(comment.comment_id)}
            className="mt-1.5 h-8 w-8 items-center justify-center rounded-md active:opacity-80"
            hitSlop={10}
            accessibilityLabel="Report comment"
            accessibilityRole="button"
          >
            <View pointerEvents="none">
              <Flag size={13} color={Theme.colors.foreground} strokeWidth={1.5} />
            </View>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export default RexRequestCommentRow;
