import { useCallback, useEffect, useRef } from 'react';
import { discardDraftRexData } from '~/features/rex-create/api/rexCreateApi';

type UseDraftDiscardArgs = {
  visible: boolean;
  closeModal: () => void;
};

export function useDraftDiscard({ visible, closeModal }: UseDraftDiscardArgs) {
  const postedSuccessfullyRef = useRef(false);

  useEffect(() => {
    if (visible) postedSuccessfullyRef.current = false;
  }, [visible]);

  const markPosted = useCallback(() => {
    postedSuccessfullyRef.current = true;
  }, []);

  const abandonDraftAndClose = useCallback(() => {
    closeModal();
    if (!postedSuccessfullyRef.current) {
      void discardDraftRexData().catch(() => {});
    }
  }, [closeModal]);

  return { markPosted, abandonDraftAndClose };
}
