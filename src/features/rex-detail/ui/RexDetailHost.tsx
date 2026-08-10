import React from 'react';
import RecommendationDetailModal from '~/features/rex-detail/ui/RecommendationDetailModal';
import type { AddYourOwnRecSource } from '~/features/rex-create/lib/addYourOwn';
import type { Recommendation, RecommendationOpenOptions } from '~/shared/types/recommendation';

type Props = {
  visible: boolean;
  embedded?: boolean;
  recommendation: Recommendation | null;
  onClose: () => void;
  onDismiss?: () => void;
  onAddYourOwn?: (source: AddYourOwnRecSource) => void;
  onCommentCountChange?: (total: number) => void;
  scrollToComments?: boolean;
  scrollToCommentId?: string;
  onAuthorPress?: (authorId: string) => void;
  onUserPress?: (userId: string) => void;
  onEditRex?: (rexId: string) => void;
};

function RexDetailHost({
  visible,
  embedded = false,
  recommendation,
  onClose,
  onDismiss,
  ...rest
}: Props) {
  if (!recommendation) return null;

  return (
    <RecommendationDetailModal
      visible={visible}
      embedded={embedded}
      recommendation={recommendation}
      onClose={onClose}
      onDismiss={onDismiss}
      {...rest}
    />
  );
}

export default RexDetailHost;
export type { Props as RexDetailHostProps };
export type { RecommendationOpenOptions };
