import React from 'react';
import type { CreateRecFlow } from '~/features/rex-create/hooks/useCreateRecWizard';
import type { CreateConfigState } from '~/features/rex-create/hooks/useCategoryCreateConfig';
import Confirm from './Confirm';

type Props = {
  flow: CreateRecFlow;
  config: CreateConfigState;
  circleTitleLookup: { id: string; title: string }[];
};

function ConfirmStep({ flow, config, circleTitleLookup }: Props) {
  const { place, scorecard, circles } = flow;
  return (
    <Confirm
      searchMode={place.searchMode}
      selectedSearchPlace={place.selectedSearchPlace}
      manualName={place.manualName}
      manualAddress={place.manualAddress}
      manualGeotag={place.manualGeotag}
      onlineName={place.onlineName}
      onlineWebsiteUrl={place.onlineWebsiteUrl}
      selectedCategoryId={flow.category.selectedCategoryId}
      categoryDisplayName={config.activeCreateConfig?.display_name ?? null}
      categoryRatings={scorecard.categoryRatings}
      scoreValueForMoney={scorecard.scoreValueForMoney}
      scoreQuickTip={scorecard.scoreQuickTip}
      scoreReview={scorecard.scoreReview}
      selectedCircleIds={circles.selectedCircleIds}
      privateRex={circles.privateRex}
      circleTitleLookup={circleTitleLookup}
      subcategoryLabel={config.subcategoryLabel}
      photoCount={flow.photos.paths.length}
      selectedTagSlugs={scorecard.selectedTagSlugs}
      tagOptions={config.mergedTagOptions}
    />
  );
}

export default ConfirmStep;
