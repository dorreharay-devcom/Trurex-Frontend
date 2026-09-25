import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { WishListWizardFlow } from '~/features/wish-list/hooks/create/useWishListItemWizard';
import TagPillPicker from '~/features/wish-list/ui/create/steps/common/TagPillPicker';
import WishListTextField from '~/features/wish-list/ui/create/steps/common/WishListTextField';
import CreateStepTitle from '~/features/rex-create/ui/CreateStepTitle';
import { CREATE_REC_STEP_INNER } from '~/features/rex-create/config/layout';

type Props = {
  flow: WishListWizardFlow;
};

function DetailsStep({ flow }: Props) {
  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center pb-36"
    >
      <View className={`${CREATE_REC_STEP_INNER} gap-4`}>
        <View className="items-center gap-1 pb-2">
          <CreateStepTitle>Item details</CreateStepTitle>
          <Text className="text-center text-sm text-muted-foreground">
            What are you hoping to get?
          </Text>
        </View>

        <WishListTextField
          label="Brand name"
          required
          value={flow.brandName}
          onChangeText={flow.setBrandName}
          placeholder="e.g. Aesop"
          autoCapitalize="words"
        />

        <WishListTextField
          label="Product name"
          value={flow.productName}
          onChangeText={flow.setProductName}
          placeholder="e.g. Resurrection Aromatique Hand Balm"
          autoCapitalize="words"
        />

        <WishListTextField
          label="What size do you need?"
          value={flow.size}
          onChangeText={flow.setSize}
          placeholder="e.g. Size 10, Medium, 30ml"
        />

        <WishListTextField
          label="Any colour, shade, or variant preference?"
          value={flow.colour}
          onChangeText={flow.setColour}
          placeholder="e.g. Navy, matte black…"
        />

        <WishListTextField
          label="Note to self"
          value={flow.note}
          onChangeText={flow.setNote}
          placeholder="Anything else you want to remember?"
          multiline
        />

        <TagPillPicker selected={flow.tags.selected} onToggle={flow.tags.toggle} />
      </View>
    </ScrollView>
  );
}

export default DetailsStep;
