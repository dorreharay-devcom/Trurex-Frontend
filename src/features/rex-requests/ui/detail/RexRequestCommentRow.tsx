import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SignedUserAvatar } from '~/shared/ui/media/SignedUserAvatar';
import { formatCompactRelativeTime } from '~/shared/lib/data/date';
import {
  DeleteAction,
  ReportAction,
} from '~/features/rex-detail/ui/comments/common/CommentActions';
import type { RexRequestCommentRow as RexRequestCommentRowType } from '~/features/rex-requests/api/types';
import CollapsibleMentionText from '~/features/mentions/ui/CollapsibleMentionText';
import BusinessAuthorTag from '~/shared/ui/primitives/BusinessAuthorTag';
import type { UserProfileOpenOptions } from '~/shared/types/userProfileOpen';

type Props = {
  comment: RexRequestCommentRowType;
  currentUserId?: string;
  onUserPress?: (userId: string, options?: UserProfileOpenOptions) => void;
  onReport?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
};

function RexRequestCommentRow({ comment, currentUserId, onUserPress, onReport, onDelete }: Props) {
  const name = comment.commenter_display_name?.trim() || 'Member';
  const goToProfile = () =>
    onUserPress?.(comment.commenter_id, { asBusiness: comment.posted_as_business });
  const isOwnComment = Boolean(currentUserId && currentUserId === comment.commenter_id);
  const canReport = Boolean(onReport && currentUserId && !isOwnComment);
  const canDelete = Boolean(onDelete && isOwnComment);

  return (
    <View className="flex-row gap-2.5">
      <TouchableOpacity onPress={goToProfile} activeOpacity={0.7}>
        <SignedUserAvatar
          name={name}
          avatar={comment.commenter_avatar_url ?? undefined}
          verified={comment.commenter_verified}
          className="mt-0.5 h-7 w-7"
          sizePt={28}
        />
      </TouchableOpacity>
      <View className="min-w-0 flex-1">
        <View className="flex-row flex-wrap items-baseline gap-2">
          <View className="min-w-0 flex-row items-center gap-1">
            <TouchableOpacity onPress={goToProfile} activeOpacity={0.7} className="shrink">
              <Text className="text-sm font-semibold text-foreground">{name}</Text>
            </TouchableOpacity>
            {comment.posted_as_business ? <BusinessAuthorTag /> : null}
          </View>
          <Text className="text-[10px] text-muted-foreground">
            {formatCompactRelativeTime(comment.created_at)}
          </Text>
        </View>
        <CollapsibleMentionText
          body={comment.body}
          mentions={comment.mentions}
          onUserPress={onUserPress}
          className="mt-0.5 text-sm leading-relaxed text-foreground/90"
        />
        {canDelete || canReport ? (
          <View className="mt-1.5 flex-row flex-wrap items-center gap-3">
            {canDelete ? <DeleteAction onPress={() => onDelete?.(comment.comment_id)} /> : null}
            {canReport ? <ReportAction onPress={() => onReport?.(comment.comment_id)} /> : null}
          </View>
        ) : null}
      </View>
    </View>
  );
}

export default RexRequestCommentRow;
