import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import type { BusinessPageState } from '~/pages/business/hooks/useBusinessPage';
import BusinessPageHeaderBar from '~/features/business/ui/BusinessPageHeaderBar';
import BusinessHeader from '~/features/business/ui/BusinessHeader';
import BusinessScoreCards from '~/features/business/ui/BusinessScoreCards';
import BusinessScorecardBars from '~/features/business/ui/BusinessScorecardBars';
import BusinessTopTags from '~/features/business/ui/BusinessTopTags';
import BusinessRexTabs from '~/features/business/ui/BusinessRexTabs';
import BusinessRexList from '~/features/business/ui/BusinessRexList';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  page: BusinessPageState;
  onBack: () => void;
  onOpenRex: (rexId: string) => void;
};

function BusinessPageBody({ page, onBack, onOpenRex }: Props) {
  const { rexId, summary } = page;

  if (!rexId || summary.isError) {
    return (
      <View className="flex-1">
        <BusinessPageHeaderBar onBack={onBack} />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-foreground">Couldn&apos;t load this business.</Text>
        </View>
      </View>
    );
  }

  if (summary.isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  if (!summary.data?.is_visible_business_page) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  const data = summary.data;
  const showScoreSection = data.scored_rex_count > 0 && data.global_score != null;
  const showScorecardSection = page.scorecardRows.length > 0;
  const firstCategoryIcon = data.categories[0]?.icon ?? null;

  return (
    <View className="flex-1">
      <BusinessPageHeaderBar onBack={onBack} />
      <ScrollView
        className="flex-1 w-full"
        contentContainerClassName="w-full max-w-xl mx-auto gap-6 px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        <BusinessHeader summary={data} photoPaths={page.headerPhotos} />
        {showScoreSection ? <BusinessScoreCards summary={data} /> : null}
        {showScorecardSection ? <BusinessScorecardBars rows={page.scorecardRows} /> : null}
        <BusinessTopTags tags={data.top_tags} />
        <BusinessRexTabs
          networkOnly={page.networkOnly}
          onChange={page.setNetworkOnly}
          networkCount={data.network_rex_count}
          totalCount={data.total_rex_count}
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
      </ScrollView>
    </View>
  );
}

export default BusinessPageBody;
