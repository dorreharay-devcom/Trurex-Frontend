import React from 'react';
import { useWindowDimensions } from 'react-native';
import { useModalPresentation } from '~/features/rex-create/hooks/useModalPresentation';
import { useWishListItemWizard } from '~/features/wish-list/hooks/create/useWishListItemWizard';
import type { WishListWizardPrefill } from '~/features/wish-list/types/wizardPrefill';
import WishListWizardBody from '~/features/wish-list/ui/create/WishListWizardBody';
import WishListWizardFooter from '~/features/wish-list/ui/create/WishListWizardFooter';
import WishListWizardHeader from '~/features/wish-list/ui/create/WishListWizardHeader';
import { OverlayModal } from '~/shared/ui/overlay/OverlayModal';

type Props = {
  onClose: () => void;
  prefill: WishListWizardPrefill | null;
};

const WishListWizardScreen = ({ onClose, prefill }: Props) => {
  const { height: windowHeight } = useWindowDimensions();
  const flow = useWishListItemWizard(prefill);

  const { sheetTranslateY, stepOpacity, handleClose } = useModalPresentation({
    visible: true,
    windowHeight,
    stepIndex: flow.stepIndex,
    onClose,
  });

  const handlePrimary = async () => {
    if (!flow.isLastStep) {
      flow.goNext();
      return;
    }
    const succeeded = await flow.submit();
    if (!succeeded) return;
    handleClose();
  };

  return (
    <OverlayModal embedded onRequestClose={handleClose} contentTranslateY={sheetTranslateY}>
      <WishListWizardHeader
        isFirstStep={flow.isFirstStep}
        isEditMode={flow.isEditMode}
        currentIndex={flow.stepIndex}
        onBack={flow.goBack}
        onCancel={handleClose}
      />

      <WishListWizardBody flow={flow} stepOpacity={stepOpacity} />

      <WishListWizardFooter
        isLastStep={flow.isLastStep}
        isEditMode={flow.isEditMode}
        disabled={!flow.canProceed || flow.submitting}
        submitting={flow.submitting}
        onPress={() => {
          void handlePrimary();
        }}
      />
    </OverlayModal>
  );
};

export default WishListWizardScreen;
