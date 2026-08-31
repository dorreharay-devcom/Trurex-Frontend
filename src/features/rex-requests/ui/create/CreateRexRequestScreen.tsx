import React from 'react';
import { useWindowDimensions } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { OverlayModal } from '~/shared/ui/overlay/OverlayModal';
import { useModalPresentation } from '~/features/rex-create/hooks/useModalPresentation';
import { useCreateRexRequestWizard } from '~/features/rex-requests/hooks/create/useCreateRexRequestWizard';
import { REX_REQUEST_QUERY_KEYS } from '~/features/rex-requests/config/queryKeys';
import { toastSuccess } from '~/shared/lib/appToast';
import CreateRexRequestHeader from '~/features/rex-requests/ui/create/CreateRexRequestHeader';
import CreateRexRequestBody from '~/features/rex-requests/ui/create/CreateRexRequestBody';
import CreateRexRequestFooter from '~/features/rex-requests/ui/create/CreateRexRequestFooter';

type Props = {
  onClose: () => void;
  editRequestId?: string | null;
};

const CreateRexRequestScreen = ({ onClose, editRequestId = null }: Props) => {
  const { height: windowHeight } = useWindowDimensions();
  const flow = useCreateRexRequestWizard(editRequestId);
  const queryClient = useQueryClient();

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
    const posted = await flow.submit();
    if (!posted) return;
    void queryClient.invalidateQueries({ queryKey: REX_REQUEST_QUERY_KEYS.feed });
    if (editRequestId) {
      void queryClient.invalidateQueries({
        queryKey: REX_REQUEST_QUERY_KEYS.detail(editRequestId),
      });
      toastSuccess('Rex Request updated!');
    } else {
      toastSuccess('Rex Request posted!', 'Your circles will be notified.');
    }
    handleClose();
  };

  return (
    <OverlayModal embedded onRequestClose={handleClose} contentTranslateY={sheetTranslateY}>
      <CreateRexRequestHeader
        isFirstStep={flow.isFirstStep}
        isEditMode={flow.isEditMode}
        currentIndex={flow.stepIndex}
        onBack={flow.goBack}
        onCancel={handleClose}
      />

      <CreateRexRequestBody flow={flow} stepOpacity={stepOpacity} />

      <CreateRexRequestFooter
        isLastStep={flow.isLastStep}
        isEditMode={flow.isEditMode}
        disabled={
          !flow.canProceed || flow.submitting || flow.initialLoading || flow.initialLoadError
        }
        submitting={flow.submitting}
        onPress={() => {
          void handlePrimary();
        }}
      />
    </OverlayModal>
  );
};

export default CreateRexRequestScreen;
