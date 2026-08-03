import React, { useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { OverlayModal } from '~/shared/ui/OverlayModal';
import { modalConfig, useOverlaySheetPresentation } from '~/hooks/useOverlaySheetPresentation';
import { useAuth } from '~/features/auth/providers';
import { useCommentsScroll } from '~/features/rex-detail/hooks/comments/useCommentsScroll';
import { useDeleteRex } from '~/features/rex-detail/hooks/useDeleteRex';
import { useReportTarget } from '~/features/rex-detail/hooks/report/useReportTarget';
import { useRexDetail } from '~/features/rex-detail/hooks/useRexDetail';
import { useSaveRex } from '~/features/rex-detail/hooks/useSaveRex';
import type { AddYourOwnRecSource } from '~/features/rex-create/lib/addYourOwn';
import type { Recommendation } from '~/shared/types/recommendation';
import { isIos } from '~/utils';
import DetailBody from './common/DetailBody';
import DetailHeader from './common/DetailHeader';
import DetailOverlays from './common/DetailOverlays';

type Props = {
  visible: boolean;
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

const RecommendationDetailModal: React.FC<Props> = ({
  visible,
  recommendation,
  onClose,
  onDismiss,
  onAddYourOwn,
  onCommentCountChange,
  scrollToComments,
  scrollToCommentId,
  onAuthorPress,
  onUserPress,
  onEditRex,
}) => {
  const { height: windowHeight } = useWindowDimensions();
  const { user: authUser } = useAuth();
  const recommendationId = recommendation?.id;

  const { sheetTranslateY, handleClose } = useOverlaySheetPresentation({
    visible: visible && recommendation != null,
    windowHeight,
    onClose,
  });

  const detail = useRexDetail(recommendation, visible);
  const report = useReportTarget(recommendation);
  const save = useSaveRex(recommendation);
  const del = useDeleteRex({ recommendationId, visible, onDeleted: handleClose });
  const commentsScroll = useCommentsScroll({
    visible,
    recommendationId,
    scrollToComments,
    scrollToCommentId,
  });

  useEffect(() => {
    if (visible || isIos || !recommendation) return;
    onDismiss?.();
  }, [visible, recommendation, onDismiss]);

  if (!recommendation) {
    return null;
  }

  const effectiveAuthorId = recommendation.authorId ?? detail.rexDetail?.author_id;
  const isOwner =
    authUser != null && effectiveAuthorId != null && authUser.id === effectiveAuthorId;
  const showReport =
    authUser != null &&
    (recommendation.authorId == null || authUser.id !== recommendation.authorId);

  const handleAuthorPress = () => {
    if (!effectiveAuthorId || !onAuthorPress) return;
    onClose();
    onAuthorPress(effectiveAuthorId);
  };

  return (
    <OverlayModal
      visible={visible}
      onRequestClose={handleClose}
      onDismiss={onDismiss}
      contentTranslateY={sheetTranslateY}
      backdropBackground={modalConfig.layout.backdropBackground}
    >
      <View className="flex-1 min-h-0 flex-col">
        <DetailHeader
          isOwner={isOwner}
          showReport={showReport}
          onBack={handleClose}
          onEdit={onEditRex ? () => onEditRex(recommendation.id) : undefined}
          onDelete={del.openConfirm}
          onReport={report.openRexReport}
        />
        <DetailBody
          recommendation={recommendation}
          detail={detail}
          save={save}
          commentsScroll={commentsScroll}
          effectiveAuthorId={effectiveAuthorId}
          onAuthorPress={handleAuthorPress}
          onAddYourOwn={onAddYourOwn}
          onCommentCountChange={onCommentCountChange}
          scrollToComments={scrollToComments}
          scrollToCommentId={scrollToCommentId}
          onUserPress={onUserPress}
          onReportComment={report.openCommentReport}
        />
        <DetailOverlays report={report} del={del} save={save} />
      </View>
    </OverlayModal>
  );
};

export default RecommendationDetailModal;
