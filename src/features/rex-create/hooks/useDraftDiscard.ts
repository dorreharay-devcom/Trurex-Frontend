import { useCallback, useEffect, useRef } from 'react';
import { discardDraftRexData } from '~/features/rex-create/api/rexCreateApi';
import { clearCreateWizardDraft } from '~/features/rex-create/lib/createWizardDraft';

type UseDraftDiscardArgs = {
  visible: boolean;
  closeModal: () => void;
  cancelPendingSave?: () => void;
  resetWizard?: () => void;
};

export function useDraftDiscard({
  visible,
  closeModal,
  cancelPendingSave,
  resetWizard,
}: UseDraftDiscardArgs) {
  const postedSuccessfullyRef = useRef(false);

  useEffect(() => {
    if (visible) postedSuccessfullyRef.current = false;
  }, [visible]);

  const wipeLocalDraft = useCallback(() => {
    cancelPendingSave?.();
    void clearCreateWizardDraft();
    resetWizard?.();
  }, [cancelPendingSave, resetWizard]);

  const markPosted = useCallback(() => {
    postedSuccessfullyRef.current = true;
    wipeLocalDraft();
  }, [wipeLocalDraft]);

  const abandonDraftAndClose = useCallback(() => {
    if (!postedSuccessfullyRef.current) {
      void discardDraftRexData().catch(() => {});
      wipeLocalDraft();
    }
    closeModal();
  }, [closeModal, wipeLocalDraft]);

  return { markPosted, abandonDraftAndClose };
}
