import React, { useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { OverlayModal } from '~/shared/ui/overlay/OverlayModal';
import { useCreateRecWizard } from '~/features/rex-create/hooks/useCreateRecWizard';
import { useModalPresentation } from '~/features/rex-create/hooks/useModalPresentation';
import { useCategoryCreateConfig } from '~/features/rex-create/hooks/useCategoryCreateConfig';
import { usePrimaryAction } from '~/features/rex-create/hooks/usePrimaryAction';
import { useEditPrefill } from '~/features/rex-create/hooks/useEditPrefill';
import { useTagLocation } from '~/features/rex-create/hooks/useTagLocation';
import { useDraftDiscard } from '~/features/rex-create/hooks/useDraftDiscard';
import { useCreateWizardDraftPersistence } from '~/features/rex-create/hooks/useCreateWizardDraftPersistence';
import type { AddYourOwnRecSource } from '~/features/rex-create/lib/addYourOwn';
import CreateModalHeader from './CreateModalHeader';
import CreateModalFooter from './CreateModalFooter';
import CreateModalBody from './CreateModalBody';

type Props = {
  onClose: () => void;
  addYourOwnPrefill?: AddYourOwnRecSource | null;
  editRexId?: string | null;
};

const CreateScreen: React.FC<Props> = ({ onClose, addYourOwnPrefill = null, editRexId = null }) => {
  const { height: windowHeight } = useWindowDimensions();
  const flow = useCreateRecWizard();
  const { applyAddYourOwnPrefill, reset } = flow;
  const isEditMode = editRexId != null;

  const { sheetTranslateY, stepOpacity, handleClose } = useModalPresentation({
    visible: true,
    windowHeight,
    stepIndex: flow.nav.stepIndex,
    onClose,
  });

  const draftPersistence = useCreateWizardDraftPersistence({
    visible: true,
    isEditMode,
    hasExternalPrefill: addYourOwnPrefill != null,
    flow,
  });

  const { isGeotagging, handleTagLocation } = useTagLocation(flow);

  const { markPosted, abandonDraftAndClose } = useDraftDiscard({
    visible: true,
    closeModal: handleClose,
    cancelPendingSave: draftPersistence.cancelPendingSave,
    resetWizard: reset,
  });

  const { editLoading, editLoadError, retryEdit } = useEditPrefill({
    visible: true,
    editRexId,
    applyEditPrefill: flow.applyEditPrefill,
  });
  const config = useCategoryCreateConfig({ visible: true, flow });

  useEffect(() => {
    if (addYourOwnPrefill) applyAddYourOwnPrefill(addYourOwnPrefill);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { submitting, primaryDisabled, handlePrimaryFooter } = usePrimaryAction({
    flow,
    config,
    isEditMode,
    editRexId,
    editLoading,
    isGeotagging,
    onClose: handleClose,
    onPosted: markPosted,
  });

  return (
    <OverlayModal
      embedded
      onRequestClose={abandonDraftAndClose}
      contentTranslateY={sheetTranslateY}
    >
      <View className="min-h-0 flex-1 flex-col">
        <CreateModalHeader
          isFirstStep={flow.nav.isFirstStep}
          isEditMode={isEditMode}
          steps={flow.nav.activeSteps}
          currentIndex={flow.nav.stepIndex}
          onBack={flow.nav.goBack}
          onCancel={abandonDraftAndClose}
        />

        <CreateModalBody
          visible
          flow={flow}
          config={config}
          stepOpacity={stepOpacity}
          onTagLocation={handleTagLocation}
          tagLocationLoading={isGeotagging}
          initialLoading={editLoading}
          loadError={editLoadError}
          onRetryLoad={retryEdit}
        />

        <CreateModalFooter
          isLastStep={flow.nav.isLastStep}
          isEditMode={isEditMode}
          disabled={primaryDisabled || editLoadError}
          submitting={submitting}
          onPress={() => {
            void handlePrimaryFooter();
          }}
        />
      </View>
    </OverlayModal>
  );
};

export default CreateScreen;
