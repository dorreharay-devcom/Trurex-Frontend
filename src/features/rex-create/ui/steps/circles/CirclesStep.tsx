import React from 'react';
import type { CreateRecFlow } from '~/features/rex-create/hooks/useCreateRecWizard';
import type { DisplayCirclesState } from '~/features/rex-create/hooks/useDisplayCircles';
import Circles from './Circles';

type Props = {
  flow: CreateRecFlow;
  circles: DisplayCirclesState;
};

function CirclesStep({ flow, circles }: Props) {
  const share = flow.circles;
  return (
    <Circles
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
