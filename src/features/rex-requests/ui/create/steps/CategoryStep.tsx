import React from 'react';
import MultiCategoryGrid from '~/features/rex-requests/ui/create/steps/common/MultiCategoryGrid';
import type { CreateRexRequestFlow } from '~/features/rex-requests/hooks/create/useCreateRexRequestWizard';

type Props = {
  flow: CreateRexRequestFlow;
};

function CategoryStep({ flow }: Props) {
  return (
    <MultiCategoryGrid
      selectedCategoryIds={flow.category.selectedCodes}
      onToggleCategory={flow.category.toggleCode}
    />
  );
}

export default CategoryStep;
