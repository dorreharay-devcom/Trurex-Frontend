import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import BusinessRexCard, { BUSINESS_REX_CARD_WIDTH } from '~/features/business/ui/BusinessRexCard';
import { LoadMoreButton } from '~/shared/ui/primitives/LoadMoreButton';
import type { PlaceRexRow } from '~/features/business/types/placeRex';

const ROW_CONTENT_STYLE = { alignItems: 'flex-start' as const };
const EMPTY_CARD_HEIGHT = 280;
const SKELETON_COUNT = 3;

function BusinessRexEmptyCard() {
  return (
    <View
      style={{ width: BUSINESS_REX_CARD_WIDTH, height: EMPTY_CARD_HEIGHT }}
      className="items-center justify-center rounded-2xl border border-border bg-border/30"
    >
      <Text className="text-sm text-muted-foreground">No content added</Text>
    </View>
  );
}

function BusinessRexListSkeleton() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-3 pb-1"
    >
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <View
          key={i}
          style={{ width: BUSINESS_REX_CARD_WIDTH, height: EMPTY_CARD_HEIGHT }}
          className="rounded-2xl bg-border/40"
        />
      ))}
    </ScrollView>
  );
}

type Props = {
  rows: PlaceRexRow[];
  categoryIcon?: string | null;
  isInitialLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  onOpenRex: (rexId: string) => void;
};

function BusinessRexList({
  rows,
  categoryIcon,
  isInitialLoading,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onOpenRex,
}: Props) {
  if (isInitialLoading) {
    return <BusinessRexListSkeleton />;
  }

  if (rows.length === 0) {
    return <BusinessRexEmptyCard />;
  }

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 pb-1"
        contentContainerStyle={ROW_CONTENT_STYLE}
      >
        {rows.map((row) => (
          <BusinessRexCard
            key={row.id}
            row={row}
            categoryIcon={categoryIcon}
            onPress={() => onOpenRex(row.id)}
          />
        ))}
      </ScrollView>
      <LoadMoreButton visible={hasNextPage} loading={isFetchingNextPage} onPress={onLoadMore} />
    </View>
  );
}

export default BusinessRexList;
