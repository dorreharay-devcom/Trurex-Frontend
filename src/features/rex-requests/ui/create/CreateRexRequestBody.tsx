import React from 'react';
import { ActivityIndicator, View, Animated as RNAnimated } from 'react-native';
import { Theme } from '~/shared/theme/Theme';
import QueryErrorState from '~/shared/ui/query/QueryErrorState';
import type { CreateRexRequestFlow } from '~/features/rex-requests/hooks/create/useCreateRexRequestWizard';
import DetailsStep from '~/features/rex-requests/ui/create/steps/DetailsStep';
import CategoryStep from '~/features/rex-requests/ui/create/steps/CategoryStep';
import NeedByStep from '~/features/rex-requests/ui/create/steps/NeedByStep';
import CirclesStep from '~/features/rex-requests/ui/create/steps/CirclesStep';
import ConfirmStep from '~/features/rex-requests/ui/create/steps/ConfirmStep';

type Props = {
  flow: CreateRexRequestFlow;
  stepOpacity: RNAnimated.Value;
};

function CreateRexRequestBody({ flow, stepOpacity }: Props) {
  if (flow.initialLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={Theme.colors.primary} />
      </View>
    );
  }
  if (flow.initialLoadError) {
    return (
      <QueryErrorState
        title="Couldn't load this request"
        message="It may no longer be editable. Check your connection and try again."
      />
    );
  }

  return (
    <View className="min-h-0 w-full flex-1">
      <RNAnimated.View key={flow.stepId} style={{ flex: 1, width: '100%', opacity: stepOpacity }}>
        {flow.stepId === 'details' && <DetailsStep flow={flow} />}
        {flow.stepId === 'category' && <CategoryStep flow={flow} />}
        {flow.stepId === 'needBy' && <NeedByStep flow={flow} />}
        {flow.stepId === 'circles' && <CirclesStep flow={flow} />}
        {flow.stepId === 'confirm' && <ConfirmStep flow={flow} />}
      </RNAnimated.View>
    </View>
  );
}

export default CreateRexRequestBody;
