import React from 'react';
import { Text, View } from 'react-native';
import { useDisplayCircles } from '~/features/circles/hooks/useDisplayCircles';
import CirclesPicker from '~/features/circles/ui/picker/CirclesPicker';
import { CREATE_REC_STEP_INNER } from '~/features/rex-create/config/layout';
import type { CreateRexRequestFlow } from '~/features/rex-requests/hooks/create/useCreateRexRequestWizard';

type Props = {
  flow: CreateRexRequestFlow;
};

function CirclesStep({ flow }: Props) {
  const {
    selectedCircleIds,
    toggleCircleId,
    ensureDefaultCircleSelectionFromApiOrder,
    existingAudienceLabel,
  } = flow.circles;
  const circles = useDisplayCircles({
    visible: true,
    onLoaded: ensureDefaultCircleSelectionFromApiOrder,
  });

  return (
    <View className="flex-1">
      {existingAudienceLabel != null ? (
        <View className={CREATE_REC_STEP_INNER}>
          <View className="rounded-xl border border-border bg-muted/50 px-3 py-2.5">
            <Text className="text-xs text-muted-foreground">
              Currently shared with:{' '}
              <Text className="font-medium text-foreground">{existingAudienceLabel}</Text>. Select
              circles below to update it.
            </Text>
          </View>
        </View>
      ) : null}
      <CirclesPicker
        circles={circles.displayCircles}
        showFetchSpinner={circles.showFetchSpinner}
        loadError={circles.loadError}
        onRetry={() => void circles.refetch()}
        selectedIds={selectedCircleIds}
        onToggle={toggleCircleId}
        showPrivateOption={false}
      />
    </View>
  );
}

export default CirclesStep;
