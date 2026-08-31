import React from 'react';
import Category from '~/features/rex-create/ui/steps/category/Category';
import type { CreateRexRequestFlow } from '~/features/rex-requests/hooks/create/useCreateRexRequestWizard';

type Props = {
  flow: CreateRexRequestFlow;
};

function CategoryStep({ flow }: Props) {
  return (
    <Category
      selectedCategoryId={flow.category.selectedCode}
      onSelectCategory={flow.category.setSelectedCode}
      autoSuggestedCategoryId={null}
    />
  );
}

export default CategoryStep;
