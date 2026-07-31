import React from 'react';
import { View } from 'react-native';
import type { RexComment } from '~/features/rex-detail/types/rexComment';
import { CommentRow, type CommentRowProps } from './CommentRow';

type Props = {
  root: RexComment;
  highlightCommentId?: string | null;
} & Omit<CommentRowProps, 'comment' | 'isReply' | 'highlight'>;

export const CommentThread: React.FC<Props> = ({ root, highlightCommentId, ...rest }) => (
  <View className="gap-3">
    <CommentRow
      comment={root}
      isReply={false}
      highlight={highlightCommentId === root.id}
      {...rest}
    />
    {root.replies?.map((r) => (
      <CommentRow
        key={r.id}
        comment={r}
        isReply
        highlight={highlightCommentId === r.id}
        {...rest}
      />
    ))}
  </View>
);
