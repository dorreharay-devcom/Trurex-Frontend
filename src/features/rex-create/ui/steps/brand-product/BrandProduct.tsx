import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import CreateStepTitle from '../../CreateStepTitle';
import SearchTextField from '../search/common/SearchTextField';
import { CREATE_REC_STEP_INNER } from '~/features/rex-create/config/layout';
import { cn } from '~/shared/lib/ui/styles';

type Props = {
  brandName: string;
  onChangeBrandName: (v: string) => void;
  productName: string;
  onChangeProductName: (v: string) => void;
};

function FieldLabel({ label, required }: { label: string; required: boolean }) {
  return (
    <View className="flex-row flex-wrap items-center gap-x-2 gap-y-1">
      <Text className="text-sm font-medium text-foreground">{label}</Text>
      <Text
        className={cn(
          'text-[10px] italic',
          required ? 'text-destructive' : 'text-black opacity-80',
        )}
      >
        {required ? 'required' : 'optional'}
      </Text>
    </View>
  );
}

function BrandProduct({ brandName, onChangeBrandName, productName, onChangeProductName }: Props) {
  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center pb-36"
    >
      <View className={cn(CREATE_REC_STEP_INNER, 'gap-6')}>
        <View className="items-center gap-2">
          <CreateStepTitle>What are you recommending?</CreateStepTitle>
          <Text className="text-center text-sm text-muted-foreground">
            Tell us the brand and, if relevant, the specific product
          </Text>
        </View>

        <View className="gap-2">
          <FieldLabel label="Brand name" required />
          <SearchTextField
            value={brandName}
            onChangeText={onChangeBrandName}
            placeholder="e.g. Aesop"
            autoCapitalize="words"
          />
        </View>

        <View className="gap-2">
          <FieldLabel label="Product name" required={false} />
          <SearchTextField
            value={productName}
            onChangeText={onChangeProductName}
            placeholder="e.g. Resurrection Aromatique Hand Balm"
            autoCapitalize="words"
          />
        </View>
      </View>
    </ScrollView>
  );
}

export default BrandProduct;
