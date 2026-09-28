import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  brandName: string | null | undefined;
  productName: string | null | undefined;
};

function DetailBrandProduct({ brandName, productName }: Props) {
  if (!brandName && !productName) return null;

  return (
    <View className="gap-3">
      {brandName ? (
        <View className="gap-1">
          <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Brand
          </Text>
          <Text className="text-sm text-foreground">{brandName}</Text>
        </View>
      ) : null}
      {productName ? (
        <View className="gap-1">
          <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Product
          </Text>
          <Text className="text-sm text-foreground">{productName}</Text>
        </View>
      ) : null}
    </View>
  );
}

export default DetailBrandProduct;
