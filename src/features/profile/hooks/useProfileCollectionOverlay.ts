import { useCallback, useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useOverlaySheetPresentation } from '~/shared/hooks/useOverlaySheetPresentation';
import type { Recommendation } from '~/shared/types/recommendation';
import { isWeb } from '~/shared/lib/ui/platform';

const COLLECTION_REX_OPEN_DELAY_MS = 120;

type Params = {
  onRexPress?: (rec: Recommendation) => void;
};

export function useProfileCollectionOverlay({ onRexPress }: Params) {
  const [openCollectionId, setOpenCollectionId] = useState<string | null>(null);
  const [pendingCollectionRex, setPendingCollectionRex] = useState<Recommendation | null>(null);
  const [addToCollectionId, setAddToCollectionId] = useState<string | null>(null);
  const { height: windowHeight } = useWindowDimensions();

  const { sheetTranslateY, handleClose: handleCollectionClose } = useOverlaySheetPresentation({
    visible: openCollectionId != null,
    windowHeight,
    onClose: () => setOpenCollectionId(null),
  });

  const closeCollection = useCallback(() => {
    if (isWeb) {
      handleCollectionClose();
      return;
    }
    setOpenCollectionId(null);
  }, [handleCollectionClose]);

  const handleCollectionRexPress = useCallback(
    (rec: Recommendation) => {
      if (!isWeb) {
        setOpenCollectionId(null);
        onRexPress?.(rec);
        return;
      }
      setPendingCollectionRex(rec);
      handleCollectionClose();
    },
    [handleCollectionClose, onRexPress],
  );

  useEffect(() => {
    if (pendingCollectionRex == null) return;
    const rec = pendingCollectionRex;
    const timeout = setTimeout(() => {
      setPendingCollectionRex(null);
      onRexPress?.(rec);
    }, COLLECTION_REX_OPEN_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [pendingCollectionRex, onRexPress]);

  const openCollection = useCallback((id: string) => setOpenCollectionId(id), []);
  const closeAddSheet = useCallback(() => setAddToCollectionId(null), []);

  return {
    openCollectionId,
    openCollection,
    closeCollection,
    handleCollectionRexPress,
    sheetTranslateY,
    addToCollectionId,
    setAddToCollectionId,
    closeAddSheet,
    addSheetOpen: addToCollectionId != null,
  };
}
