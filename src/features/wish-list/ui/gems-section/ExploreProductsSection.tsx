import React from 'react';
import { Text, View } from 'react-native';
import { ClearableSearchInput } from '~/shared/ui/primitives/ClearableSearchInput';
import { LoadMoreButton } from '~/shared/ui/primitives/LoadMoreButton';
import QueryListFooter from '~/shared/ui/query/QueryListFooter';
import QueryErrorState from '~/shared/ui/query/QueryErrorState';
import ProductBrandRexRow from '~/features/wish-list/ui/gems-section/ProductBrandRexRow';
import type { ProductBrandRexesState } from '~/features/wish-list/hooks/useProductBrandRexes';
import type { ProductBrandRexRow as ProductBrandRexRowData } from '~/features/wish-list/api/types';
import {
  Theme,
  textFieldCaretStyle,
  textFieldSingleLineDefaultHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';

type Props = {
  explore: ProductBrandRexesState;
  onAddToWishList: (row: ProductBrandRexRowData) => void;
};

function ExploreProductsSection({ explore, onAddToWishList }: Props) {
  const isInitialLoading = explore.isFetching && explore.rows.length === 0;
  const showEmpty = !isInitialLoading && !explore.isError && explore.rows.length === 0;

  return (
    <View>
      <Text className="text-base font-display font-medium text-foreground mb-1">
        Explore Products & Brands inspired by others
      </Text>
      <Text className="text-xs text-muted-foreground mb-4">
        See what other members are loving and add it to your own Wish List
      </Text>

      <ClearableSearchInput
        value={explore.query}
        onChangeText={explore.setQuery}
        placeholder="Search products and brands..."
        placeholderTextColor={Theme.colors.muted}
        containerClassName="mb-4"
        iconColor={Theme.colors.muted}
        clearIconColor={Theme.colors.muted}
        inputClassName="w-full pl-9 pr-10 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground"
        inputStyle={[
          textFieldCaretStyle,
          textFieldSingleLineStyle,
          textFieldSingleLineDefaultHeightStyle,
        ]}
        multiline={false}
        numberOfLines={1}
        scrollEnabled={false}
      />

      {explore.isError && explore.rows.length === 0 ? (
        <QueryErrorState compact title="Couldn't load" onRetry={explore.retry} />
      ) : null}

      {showEmpty ? (
        <View className="items-center py-8 gap-2">
          <Text className="text-sm text-muted-foreground">
            {explore.query.trim() ? 'No matches' : 'Nothing to explore yet'}
          </Text>
        </View>
      ) : null}

      {explore.rows.map((row) => (
        <ProductBrandRexRow key={row.id} item={row} onPress={() => onAddToWishList(row)} />
      ))}

      {explore.isFetchNextPageError ? (
        <QueryListFooter isError onRetry={explore.fetchNextPage} />
      ) : (
        <LoadMoreButton
          visible={explore.hasNextPage}
          loading={explore.isFetchingNextPage}
          onPress={explore.fetchNextPage}
        />
      )}
    </View>
  );
}

export default ExploreProductsSection;
