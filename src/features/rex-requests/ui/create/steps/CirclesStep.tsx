import React from 'react';
import { View } from 'react-native';
import { useDisplayCircles } from '~/features/circles/hooks/useDisplayCircles';
import CirclesPicker from '~/features/circles/ui/picker/CirclesPicker';
import type { CreateRexRequestFlow } from '~/features/rex-requests/hooks/create/useCreateRexRequestWizard';

type Props = {
  flow: CreateRexRequestFlow;
};

function CirclesStep({ flow }: Props) {
  const { selectedCircleIds, toggleCircleId, ensureDefaultCircleSelectionFromApiOrder } =
    flow.circles;
  const circles = useDisplayCircles({
    visible: true,
    onLoaded: ensureDefaultCircleSelectionFromApiOrder,
  });

  return (
    <View className="flex-1">
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
