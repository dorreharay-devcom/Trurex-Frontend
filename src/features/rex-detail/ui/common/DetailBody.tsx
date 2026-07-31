import React from 'react';
import { View, ScrollView } from 'react-native';
import { RexCommentsSection } from '~/features/rex-detail/ui/comments';
import { CREATE_REC_STEP_INNER } from '~/features/rex-create/config/layout';
import type { RexDetailView } from '~/features/rex-detail/hooks/useRexDetail';
import type { SaveRexState } from '~/features/rex-detail/hooks/useSaveRex';
import type { CommentsScrollState } from '~/features/rex-detail/hooks/comments/useCommentsScroll';
import {
  buildAddYourOwnRecSource,
  type AddYourOwnRecSource,
} from '~/features/rex-create/lib/addYourOwn';
import type { Recommendation } from '~/shared/types/recommendation';
import { isIos, isWeb } from '~/utils';
import { cn } from '~/utils/general';
import AddYourOwnButton from './AddYourOwnButton';
import DetailAuthorCard from './DetailAuthorCard';
import DetailHero from './DetailHero';
import DetailQuote from './DetailQuote';
import DetailRatings from './DetailRatings';
import DetailTags from './DetailTags';
import DetailTitleBlock from './DetailTitleBlock';

type Props = {
  recommendation: Recommendation;
  detail: RexDetailView;
  save: SaveRexState;
  commentsScroll: CommentsScrollState;
  effectiveAuthorId: string | undefined;
  onAuthorPress: () => void;
  onAddYourOwn?: (source: AddYourOwnRecSource) => void;
  onCommentCountChange?: (total: number) => void;
  scrollToComments?: boolean;
  scrollToCommentId?: string;
  onUserPress?: (userId: string) => void;
  onReportComment: (commentId: string) => void;
};

function DetailBody({
  recommendation,
  detail,
  save,
  commentsScroll,
  effectiveAuthorId,
  onAuthorPress,
  onAddYourOwn,
  onCommentCountChange,
  scrollToComments,
  scrollToCommentId,
  onUserPress,
  onReportComment,
}: Props) {
  const user = recommendation.user ?? { name: 'Member', handle: '', avatar: '' };
  return (
    <ScrollView
      ref={commentsScroll.scrollRef}
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={isIos ? 'interactive' : 'none'}
      automaticallyAdjustKeyboardInsets={false}
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center pb-8"
      contentContainerStyle={isWeb ? undefined : { paddingBottom: 180 }}
    >
      <View className={cn(CREATE_REC_STEP_INNER, 'gap-6')}>
        <DetailHero recommendation={recommendation} detail={detail} />
        <DetailTitleBlock
          recommendation={recommendation}
          detail={detail}
          isSaved={save.isSaved}
          onSavePress={save.openSave}
        />
        <DetailAuthorCard
          name={user.name}
          avatar={user.avatar}
          authorId={effectiveAuthorId}
          onPress={onAuthorPress}
        />
        <DetailQuote text={recommendation.description} />
        <DetailRatings ratings={detail.detailRatings} />
        <DetailTags tags={recommendation.tags} />
        {onAddYourOwn ? (
          <AddYourOwnButton
            onPress={() => onAddYourOwn(buildAddYourOwnRecSource(recommendation, detail.rexDetail))}
          />
        ) : null}

        <View ref={commentsScroll.commentsSectionWrapRef} collapsable={false}>
          <RexCommentsSection
            rexId={recommendation.id}
            onCommentTotalChange={onCommentCountChange}
            composerAnchorRef={commentsScroll.composerAnchorRef}
            autoFocusComposer={scrollToComments === true && !scrollToCommentId}
            focusCommentId={scrollToCommentId}
            onFocusCommentReady={commentsScroll.handleFocusCommentReady}
            onUserPress={onUserPress}
            onReportComment={onReportComment}
            onComposerFocus={commentsScroll.handleComposerFocus}
          />
        </View>

        <View className="h-8" />
      </View>
    </ScrollView>
  );
}

export default DetailBody;
