import React from 'react';
import { View } from 'react-native';
import type { RexComment } from '~/types/recommendation/rexComment';
import { CommentRow, type CommentRowProps } from './CommentRow';

type Props = {
  root: RexComment;
} & Omit<CommentRowProps, 'comment' | 'isReply'>;

export const CommentThread: React.FC<Props> = ({ root, ...rest }) => (
  <View className="gap-3">
    <CommentRow comment={root} isReply={false} {...rest} />
    {root.replies?.map((r) => (
      <CommentRow key={r.id} comment={r} isReply {...rest} />
    ))}
  </View>
);
