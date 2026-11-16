import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import SheetHeader from '~/features/collections/ui/common/SheetHeader';
import SelectableSheetRow from '~/features/collections/ui/common/SelectableSheetRow';
import SearchQueryField from '~/features/rex-create/ui/steps/search/common/SearchQueryField';
import { CLAIM_SEARCH_MIN_LENGTH } from '~/features/business-account/config/claim';
import { useBusinessClaimSearch } from '~/features/business-account/hooks/useBusinessClaimSearch';
import { Theme } from '~/shared/theme/Theme';
import { withWebContainer } from '~/shared/lib/ui/styles';
import { RexCoverThumbnail } from '~/shared/ui/media/RexCoverThumbnail';
import { LoadMoreButton } from '~/shared/ui/primitives/LoadMoreButton';
import QueryErrorState from '~/shared/ui/query/QueryErrorState';

type Props = {
  onPick: (rexId: string, title: string) => void;
  onCancel: () => void;
};

type Search = ReturnType<typeof useBusinessClaimSearch>;

function SearchResults({ search, onPick }: { search: Search; onPick: Props['onPick'] }) {
  if (search.isIdle) {
    return (
      <Text className="py-6 text-center text-sm text-muted-foreground">
        {`Type at least ${CLAIM_SEARCH_MIN_LENGTH} letters of your business name.`}
      </Text>
    );
  }
  if (search.isSearching) {
    return (
      <View className="items-center py-6">
        <ActivityIndicator color={Theme.colors.muted} />
      </View>
    );
  }
  if (search.isError) {
    return <QueryErrorState title="Couldn't search" compact onRetry={search.retry} />;
  }
  if (search.rows.length === 0) {
    return (
      <Text className="py-6 text-center text-sm text-muted-foreground">
        No Rex mention this business yet.
      </Text>
    );
  }
  return (
    <>
      {search.rows.map((rec) => (
        <SelectableSheetRow
          key={rec.id}
          thumbnail={<RexCoverThumbnail rec={rec} className="h-10 w-10 rounded-lg" />}
          title={rec.title}
          subtitle={rec.locationText ?? rec.location ?? rec.category}
          selected={false}
          onPress={() => onPick(rec.id, rec.title)}
        />
      ))}
      <LoadMoreButton
        visible={search.hasNextPage}
        loading={search.isFetchingNextPage}
        onPress={search.fetchNextPage}
      />
    </>
  );
}

function BusinessClaimFindStep({ onPick, onCancel }: Props) {
  const search = useBusinessClaimSearch();

  return (
    <>
      <SheetHeader
        title="Find my business"
        actionLabel="Cancel"
        busy={false}
        onAction={onCancel}
        className="pb-3"
      />
      <View className="px-3 pt-3">
        <SearchQueryField
          value={search.query}
          onChangeText={search.setQuery}
          placeholder="Search by business name"
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={withWebContainer({
          paddingHorizontal: 12,
          paddingBottom: 12,
          gap: 2,
        })}
        style={{ flex: 1 }}
      >
        <SearchResults search={search} onPick={onPick} />
      </ScrollView>
    </>
  );
}

export default BusinessClaimFindStep;
