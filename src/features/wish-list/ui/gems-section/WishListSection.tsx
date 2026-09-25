import React from 'react';
import { View } from 'react-native';
import ExploreProductsSection from '~/features/wish-list/ui/gems-section/ExploreProductsSection';
import WishListOwnList from '~/features/wish-list/ui/gems-section/WishListOwnList';
import type { MyWishListState } from '~/features/wish-list/hooks/useMyWishList';
import type { ProductBrandRexesState } from '~/features/wish-list/hooks/useProductBrandRexes';
import type { ProductBrandRexRow, WishListItemRow } from '~/features/wish-list/api/types';

export type WishListSectionProps = {
  ownList: MyWishListState;
  explore: ProductBrandRexesState;
  onOpenItem: (item: WishListItemRow) => void;
  onTriedThis: (item: WishListItemRow) => void;
  onAddProduct: () => void;
  onAddFromExplore: (row: ProductBrandRexRow) => void;
};

// Renders the user's own Wish List first, then the "inspired by others" discovery
// feed below it. This ordering is a deliberate product requirement.
function WishListSection({
  ownList,
  explore,
  onOpenItem,
  onTriedThis,
  onAddProduct,
  onAddFromExplore,
}: WishListSectionProps) {
  return (
    <View className="mb-6">
      <WishListOwnList
        state={ownList}
        onOpenItem={onOpenItem}
        onTriedThis={onTriedThis}
        onAddProduct={onAddProduct}
      />
      <ExploreProductsSection explore={explore} onAddToWishList={onAddFromExplore} />
    </View>
  );
}

export default WishListSection;
