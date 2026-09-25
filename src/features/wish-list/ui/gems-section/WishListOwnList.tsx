import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { LoadMoreButton } from '~/shared/ui/primitives/LoadMoreButton';
import QueryListFooter from '~/shared/ui/query/QueryListFooter';
import WishListItemCard, {
  WISH_LIST_CARD_WIDTH,
} from '~/features/wish-list/ui/card/WishListItemCard';
import WishListEmpty from '~/features/wish-list/ui/gems-section/WishListEmpty';
import type { MyWishListState } from '~/features/wish-list/hooks/useMyWishList';
import type { WishListItemRow } from '~/features/wish-list/api/types';
import { Theme } from '~/shared/theme/Theme';

function WishListSkeleton() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
      <View className="flex-row gap-3">
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={{ width: WISH_LIST_CARD_WIDTH, height: 280 }}
            className="rounded-2xl bg-border/40"
          />
        ))}
      </View>
    </ScrollView>
  );
}

type Props = {
  state: MyWishListState;
  onOpenItem: (item: WishListItemRow) => void;
  onTriedThis: (item: WishListItemRow) => void;
  onAddProduct: () => void;
};

function WishListOwnList({ state, onOpenItem, onTriedThis, onAddProduct }: Props) {
  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-base font-display font-medium text-foreground">Wish list</Text>
        <TouchableOpacity
          onPress={onAddProduct}
          activeOpacity={0.7}
          className="flex-row items-center gap-1.5 px-3 py-2 rounded-lg border border-border"
        >
          <Plus size={14} color={Theme.colors.foreground} />
          <Text className="text-xs font-medium text-foreground">Add a Product</Text>
        </TouchableOpacity>
      </View>

      {state.loading ? (
        <WishListSkeleton />
      ) : state.items.length === 0 ? (
        <WishListEmpty isError={state.isError} onRetry={state.retry} />
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-3 pb-1"
          >
            {state.items.map((item) => (
              <WishListItemCard
                key={item.id}
                item={item}
                onPress={() => onOpenItem(item)}
                onTriedThis={() => onTriedThis(item)}
              />
            ))}
          </ScrollView>
          {state.isFetchNextPageError ? (
            <QueryListFooter isError onRetry={state.fetchNextPage} />
          ) : (
            <LoadMoreButton
              visible={state.hasNextPage}
              loading={state.isFetchingNextPage}
              onPress={state.fetchNextPage}
            />
          )}
        </>
      )}
    </View>
  );
}

export default WishListOwnList;
