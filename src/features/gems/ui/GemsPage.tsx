import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { LoadMoreButton } from '~/shared/ui/primitives/LoadMoreButton';
import QueryListFooter from '~/shared/ui/query/QueryListFooter';
import { useGemsData } from '~/features/gems/hooks/useGemsData';
import { useGemsPageState } from '~/features/gems/hooks/useGemsPageState';
import { useRemoveUncollected } from '~/features/gems/hooks/useRemoveUncollected';
import GemsHeader from '~/features/gems/ui/GemsHeader';
import GemsOverlays from '~/features/gems/ui/GemsOverlays';
import UncollectedEmpty from '~/features/gems/ui/UncollectedEmpty';
import UncollectedRexRow from '~/features/gems/ui/uncollected-rex-row/UncollectedRexRow';
import type { Recommendation, RecommendationOpenOptions } from '~/shared/types/recommendation';
import { webContainerStyle } from '~/shared/lib/ui/styles';
import type { AddYourOwnRecSource } from '~/features/rex-create/lib/addYourOwn';
import type { ProductBrandRexRow, WishListItemRow } from '~/features/wish-list/api/types';
import { useMyWishList } from '~/features/wish-list/hooks/useMyWishList';
import { useProductBrandRexes } from '~/features/wish-list/hooks/useProductBrandRexes';
import { useWishListPageState } from '~/features/wish-list/hooks/gems/useWishListPageState';
import type { WishListWizardPrefill } from '~/features/wish-list/types/wizardPrefill';

const ROW_KIND = {
  HEADER: 'header',
  EMPTY: 'empty',
  ROW: 'row',
} as const;

type GemsListRow =
  | { kind: typeof ROW_KIND.HEADER }
  | { kind: typeof ROW_KIND.EMPTY }
  | { kind: typeof ROW_KIND.ROW; item: Recommendation };

type GemsPageProps = {
  onRecommendationPress?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
  onOpenCollection?: (collectionId: string) => void;
  onOpenWishListWizard?: (prefill: WishListWizardPrefill | null) => void;
  onNavigateToCreateRex?: (source: AddYourOwnRecSource) => void;
  onOpenRexId?: (rexId: string) => void;
};

function GemsPage({
  onRecommendationPress,
  onOpenCollection,
  onOpenWishListWizard,
  onNavigateToCreateRex,
  onOpenRexId,
}: GemsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { collections, uncollected } = useGemsData(searchQuery);
  const page = useGemsPageState({ onOpenCollection });
  const removeUncollected = useRemoveUncollected();

  const myWishList = useMyWishList();
  const productBrandRexes = useProductBrandRexes();
  const wishListPage = useWishListPageState({
    onNavigateToCreateRex: onNavigateToCreateRex ?? (() => {}),
    onOpenWishListWizard: onOpenWishListWizard ?? (() => {}),
  });

  const wishList = {
    ownList: myWishList,
    explore: productBrandRexes,
    onOpenItem: (item: WishListItemRow) => wishListPage.openItem(item),
    onTriedThis: (item: WishListItemRow) => {
      wishListPage.openTriedThis(item);
      wishListPage.triedThis.open();
    },
    onAddProduct: () => wishListPage.openWizard(null),
    onAddFromExplore: (row: ProductBrandRexRow) =>
      wishListPage.openWizard({
        kind: 'fromRex',
        sourceRexId: row.id,
        brandName: row.brand_name,
        productName: row.product_name,
      }),
    onOpenExploreRex: (row: ProductBrandRexRow) => onOpenRexId?.(row.id),
  };

  const rows = useMemo<GemsListRow[]>(() => {
    if (uncollected.items.length === 0) {
      return [{ kind: ROW_KIND.HEADER }, { kind: ROW_KIND.EMPTY }];
    }
    return [
      { kind: ROW_KIND.HEADER },
      ...uncollected.items.map((item): GemsListRow => ({ kind: ROW_KIND.ROW, item })),
    ];
  }, [uncollected.items]);

  const keyExtractor = useCallback(
    (row: GemsListRow) => (row.kind === ROW_KIND.ROW ? row.item.id : row.kind),
    [],
  );

  const getItemType = useCallback((row: GemsListRow) => row.kind, []);

  const renderItem = useCallback(
    ({ item: row }: { item: GemsListRow }) => {
      if (row.kind === ROW_KIND.HEADER) {
        return (
          <GemsHeader
            searchQuery={searchQuery}
            onChangeSearch={setSearchQuery}
            collections={collections}
            onOpenCollection={page.openCollection}
            onCreateCollection={page.openCreateCollection}
            wishList={wishList}
          />
        );
      }

      if (row.kind === ROW_KIND.EMPTY) {
        return (
          <UncollectedEmpty
            loading={uncollected.loading}
            isError={uncollected.isError}
            hasSearch={Boolean(searchQuery.trim())}
            onRetry={uncollected.retry}
          />
        );
      }

      return (
        <UncollectedRexRow
          item={row.item}
          onPress={onRecommendationPress ? () => onRecommendationPress(row.item) : undefined}
          onAdd={() => page.openAddToCollection(row.item)}
          onRemove={() => removeUncollected.setTarget(row.item)}
        />
      );
    },
    [searchQuery, collections, page, wishList, uncollected, onRecommendationPress, removeUncollected],
  );

  return (
    <>
      <FlashList
        data={rows}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[webContainerStyle, { paddingBottom: 96 }]}
        ListFooterComponent={
          <View className="px-4">
            {uncollected.isFetchNextPageError ? (
              <QueryListFooter isError onRetry={uncollected.fetchNextPage} />
            ) : (
              <LoadMoreButton
                visible={!uncollected.loading && uncollected.hasNextPage}
                loading={uncollected.isFetchingNextPage}
                onPress={uncollected.fetchNextPage}
              />
            )}
          </View>
        }
        drawDistance={400}
      />

      <GemsOverlays page={page} removeUncollected={removeUncollected} wishListPage={wishListPage} />
    </>
  );
}

export default GemsPage;
