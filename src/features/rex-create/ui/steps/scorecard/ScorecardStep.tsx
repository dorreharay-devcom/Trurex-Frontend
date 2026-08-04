import React from 'react';
import type { CreateRecFlow } from '~/features/rex-create/hooks/useCreateRecWizard';
import type { CreateConfigState } from '~/features/rex-create/hooks/useCategoryCreateConfig';
import Scorecard from './Scorecard';

type Props = {
  flow: CreateRecFlow;
  config: CreateConfigState;
};

function ScorecardStep({ flow, config }: Props) {
  return (
    <Scorecard
      selectedCategoryId={flow.category.selectedCategoryId}
      scorecard={flow.scorecard}
      config={config}
    />
  );
}

export default ScorecardStep;
