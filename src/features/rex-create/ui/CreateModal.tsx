import React, { useLayoutEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { OverlayModal } from '~/shared/ui/OverlayModal';
import { useCreateRecWizard } from '~/features/rex-create/hooks/useCreateRecWizard';
import { useModalPresentation } from '~/features/rex-create/hooks/useModalPresentation';
import { useCategoryCreateConfig } from '~/features/rex-create/hooks/useCategoryCreateConfig';
import { usePrimaryAction } from '~/features/rex-create/hooks/usePrimaryAction';
import { useEditPrefill } from '~/features/rex-create/hooks/useEditPrefill';
import { useTagLocation } from '~/features/rex-create/hooks/useTagLocation';
import { useDraftDiscard } from '~/features/rex-create/hooks/useDraftDiscard';
import type { AddYourOwnRecSource } from '~/features/rex-create/lib/addYourOwn';
import CreateModalHeader from './CreateModalHeader';
import CreateModalFooter from './CreateModalFooter';
import CreateModalBody from './CreateModalBody';

type Props = {
  visible: boolean;
  onClose: () => void;
  addYourOwnPrefill?: AddYourOwnRecSource | null;
  editRexId?: string | null;
};

const CreateModal: React.FC<Props> = ({
  visible,
  onClose,
  addYourOwnPrefill = null,
  editRexId = null,
}) => {
  const { height: windowHeight } = useWindowDimensions();
  const flow = useCreateRecWizard();
  const { applyAddYourOwnPrefill } = flow;
  const isEditMode = editRexId != null;

  const { sheetTranslateY, stepOpacity, handleClose } = useModalPresentation({
    visible,
    windowHeight,
    stepIndex: flow.nav.stepIndex,
    onClose,
    reset: flow.reset,
  });

  const { isGeotagging, handleTagLocation } = useTagLocation(flow);
  const { markPosted, abandonDraftAndClose } = useDraftDiscard({
    visible,
    closeModal: handleClose,
  });
  const { editLoading } = useEditPrefill({
    visible,
    editRexId,
    applyEditPrefill: flow.applyEditPrefill,
  });
  const config = useCategoryCreateConfig({ visible, flow });

  useLayoutEffect(() => {
    if (!visible || !addYourOwnPrefill) return;
    applyAddYourOwnPrefill(addYourOwnPrefill);
  }, [visible, addYourOwnPrefill, applyAddYourOwnPrefill]);

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
      visible={visible}
      onRequestClose={abandonDraftAndClose}
      contentTranslateY={sheetTranslateY}
    >
      <View className="flex-1 min-h-0 flex-col">
        <CreateModalHeader
          isFirstStep={flow.nav.isFirstStep}
          isEditMode={isEditMode}
          steps={flow.nav.activeSteps}
          currentIndex={flow.nav.stepIndex}
          onBack={flow.nav.goBack}
          onCancel={abandonDraftAndClose}
        />

        <CreateModalBody
          visible={visible}
          flow={flow}
          config={config}
          stepOpacity={stepOpacity}
          onTagLocation={handleTagLocation}
          tagLocationLoading={isGeotagging}
          initialLoading={editLoading}
        />

        <CreateModalFooter
          isLastStep={flow.nav.isLastStep}
          isEditMode={isEditMode}
          disabled={primaryDisabled}
          submitting={submitting}
          onPress={() => {
            void handlePrimaryFooter();
          }}
        />
      </View>
    </OverlayModal>
  );
};

export default CreateModal;
