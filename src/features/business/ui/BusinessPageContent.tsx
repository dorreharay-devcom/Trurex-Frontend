import React, { type ReactNode } from 'react';
import { View } from 'react-native';
import type { PlaceBusinessPageState } from '~/features/business/hooks/usePlaceBusinessPage';
import type { PlaceSummaryRow } from '~/features/business/types/placeSummary';
import BusinessHeader from '~/features/business/ui/BusinessHeader';
import BusinessScoreCards from '~/features/business/ui/BusinessScoreCards';
import BusinessScorecardBars from '~/features/business/ui/BusinessScorecardBars';
import BusinessTopTags from '~/features/business/ui/BusinessTopTags';
import BusinessRexTabs from '~/features/business/ui/BusinessRexTabs';
import BusinessRexList from '~/features/business/ui/BusinessRexList';

type Props = {
  summary: PlaceSummaryRow;
  page: PlaceBusinessPageState;
  onOpenRex: (rexId: string) => void;
  headerAction?: ReactNode;
  footer?: ReactNode;
};

function BusinessPageContent({ summary, page, onOpenRex, headerAction, footer }: Props) {
  const showScoreSection = summary.scored_rex_count > 0 && summary.global_score != null;
  const showScorecardSection = page.scorecardRows.length > 0;
  const firstCategoryIcon = summary.categories[0]?.icon ?? null;

  return (
    <View className="w-full max-w-xl gap-6 self-center">
      <BusinessHeader summary={summary} photoPaths={page.headerPhotos} action={headerAction} />
      {showScoreSection ? <BusinessScoreCards summary={summary} /> : null}
      {showScorecardSection ? <BusinessScorecardBars rows={page.scorecardRows} /> : null}
      <BusinessTopTags tags={summary.top_tags} />
      <BusinessRexTabs
        networkOnly={page.networkOnly}
        onChange={page.setNetworkOnly}
        networkCount={summary.network_rex_count}
        totalCount={summary.total_rex_count}
      />
      <BusinessRexList
        rows={page.activeList.rows}
        categoryIcon={firstCategoryIcon}
        isInitialLoading={page.activeList.isInitialLoading}
        hasNextPage={page.activeList.hasNextPage}
        isFetchingNextPage={page.activeList.isFetchingNextPage}
        onLoadMore={page.activeList.fetchNextPage}
        onOpenRex={onOpenRex}
      />
      {footer}
    </View>
  );
}

export default BusinessPageContent;
