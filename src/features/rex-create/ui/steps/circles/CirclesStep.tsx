import React from 'react';
import type { CreateRecFlow } from '~/features/rex-create/hooks/useCreateRecWizard';
import type { DisplayCirclesState } from '~/features/circles/hooks/useDisplayCircles';
import CirclesPicker from '~/features/circles/ui/picker/CirclesPicker';

type Props = {
  flow: CreateRecFlow;
  circles: DisplayCirclesState;
};

function CirclesStep({ flow, circles }: Props) {
  const share = flow.circles;
  return (
    <CirclesPicker
      circles={circles.displayCircles}
      showFetchSpinner={circles.showFetchSpinner}
      loadError={circles.loadError}
      onRetry={() => void circles.refetch()}
      selectedIds={share.selectedCircleIds}
      onToggle={share.toggleCircleId}
      privateSelected={share.privateRex}
      onPrivateSelectedChange={share.setPrivateRex}
    />
  );
}

export default CirclesStep;
