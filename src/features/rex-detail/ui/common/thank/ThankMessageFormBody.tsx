import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Theme } from '~/shared/theme/Theme';
import type { ThankMessageFlow } from '~/features/rex-detail/hooks/useThankMessageFlow';
import ThankMessageOptionsRadioGroup from './ThankMessageOptionsRadioGroup';
import ThankMessageCustomField from './ThankMessageCustomField';

const SUBTEXT = 'Pick a message to send along with your thank you.';

type Props = {
  flow: ThankMessageFlow;
};

function ThankMessageFormBody({ flow }: Props) {
  if (flow.optionsLoading) {
    return (
      <View className="items-center py-8">
        <ActivityIndicator color={Theme.colors.primary} />
        <Text className="mt-2 text-sm text-muted-foreground">Loading messages…</Text>
      </View>
    );
  }
  if (flow.optionsError) {
    return (
      <View className="items-center gap-2 py-6">
        <Text className="text-center text-sm text-muted-foreground">
          Could not load thank you messages.
        </Text>
        <Pressable onPress={() => void flow.refetchOptions()} className="rounded-lg py-2">
          <Text className="text-sm font-medium text-primary">Retry</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <>
      <Text className="mb-3 text-sm text-muted-foreground">{SUBTEXT}</Text>
      <ThankMessageOptionsRadioGroup
        options={flow.options}
        selected={flow.selectedOptionId}
        onSelect={flow.selectOption}
      />
      <ThankMessageCustomField message={flow.customMessage} onChangeMessage={flow.setMessage} />
    </>
  );
}

export default ThankMessageFormBody;
