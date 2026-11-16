import React from 'react';
import { useWindowDimensions } from 'react-native';
import { CLAIM_FLOW_STEP } from '~/features/business-account/config/claim';
import type { BusinessClaimFlow } from '~/features/business-account/hooks/useBusinessClaimFlow';
import BusinessClaimFindStep from '~/features/business-account/ui/claim/BusinessClaimFindStep';
import BusinessClaimInstructionsStep from '~/features/business-account/ui/claim/BusinessClaimInstructionsStep';
import BusinessClaimPromptStep from '~/features/business-account/ui/claim/BusinessClaimPromptStep';
import BusinessClaimSubmittedStep from '~/features/business-account/ui/claim/BusinessClaimSubmittedStep';
import BottomSheet from '~/shared/ui/overlay/BottomSheet';

const FIND_SHEET_MAX_HEIGHT = 560;
const FIND_SHEET_HEIGHT_RATIO = 0.7;

type Props = {
  flow: BusinessClaimFlow;
};

function ClaimStep({ flow }: Props) {
  if (flow.step === CLAIM_FLOW_STEP.find) {
    return <BusinessClaimFindStep onPick={flow.pick} onCancel={flow.close} />;
  }
  if (flow.step === CLAIM_FLOW_STEP.prompt) {
    return (
      <BusinessClaimPromptStep
        businessName={flow.subjectTitle}
        targetLoading={flow.targetLoading}
        canContinue={flow.target != null}
        returnsToSearch={flow.returnsToSearch}
        onStart={flow.startVerification}
        onBack={flow.back}
      />
    );
  }
  if (flow.step === CLAIM_FLOW_STEP.instructions) {
    return (
      <BusinessClaimInstructionsStep
        submitting={flow.submitting}
        onProceed={flow.proceed}
        onBack={flow.back}
      />
    );
  }
  return <BusinessClaimSubmittedStep onDone={flow.close} />;
}

function BusinessClaimSheet({ flow }: Props) {
  const { height } = useWindowDimensions();
  const findSheetStyle =
    flow.step === CLAIM_FLOW_STEP.find
      ? {
          height: Math.min(FIND_SHEET_MAX_HEIGHT, height * FIND_SHEET_HEIGHT_RATIO),
          maxHeight: FIND_SHEET_MAX_HEIGHT,
        }
      : undefined;

  return (
    <BottomSheet
      open={flow.open}
      onClose={flow.close}
      onClosed={flow.reset}
      sheetStyle={findSheetStyle}
    >
      <ClaimStep flow={flow} />
    </BottomSheet>
  );
}

export default BusinessClaimSheet;
