import React, { useCallback } from 'react';
import AddToCollectionSheet from '~/features/collections/ui/AddToCollectionSheet';
import type { RecSummary } from '~/features/collections/types/recSummary';
import MapPinDetailSheet from '~/features/map/ui/pin-detail/MapPinDetailSheet';
import type { MapPinType } from '~/features/map/types/mapPin';
import type { Recommendation } from '~/shared/types/recommendation';

type Props = {
  visible: boolean;
  selectedRec: Recommendation | null;
  pinType: MapPinType;
  distanceLabel?: string;
  canSave: boolean;
  onClose: () => void;
  onViewFullRex: () => void;
  onSave: () => void;
  saveTarget: RecSummary | null;
  onCloseSave: () => void;
  markRecSaved: (id: string) => void;
  markRecUnsaved: (id: string) => void;
  clearRecSavedOverride: (id: string) => void;
};

const MapPinOverlays = ({
  visible,
  selectedRec,
  pinType,
  distanceLabel,
  canSave,
  onClose,
  onViewFullRex,
  onSave,
  saveTarget,
  onCloseSave,
  markRecSaved,
  markRecUnsaved,
  clearRecSavedOverride,
}: Props) => {
  const handleSaved = useCallback(() => {
    if (!saveTarget) return;
    markRecSaved(saveTarget.id);
  }, [saveTarget, markRecSaved]);

  const handleUnsaved = useCallback(() => {
    if (!saveTarget) return;
    markRecUnsaved(saveTarget.id);
  }, [saveTarget, markRecUnsaved]);

  const handleUnsaveFailed = useCallback(() => {
    if (!saveTarget) return;
    markRecSaved(saveTarget.id);
  }, [saveTarget, markRecSaved]);

  const handleSaveRexFailed = useCallback(() => {
    if (!saveTarget) return;
    clearRecSavedOverride(saveTarget.id);
  }, [saveTarget, clearRecSavedOverride]);

  if (!visible) return null;

  return (
    <>
      {selectedRec && (
        <MapPinDetailSheet
          recommendation={selectedRec}
          pinType={pinType}
          distanceLabel={distanceLabel}
          onClose={onClose}
          onViewFullRex={onViewFullRex}
          canSave={canSave}
          onSave={onSave}
        />
      )}

      <AddToCollectionSheet
        open={saveTarget != null}
        rec={saveTarget}
        onClose={onCloseSave}
        onSaved={handleSaved}
        onUnsaved={handleUnsaved}
        onUnsaveFailed={handleUnsaveFailed}
        onSaveRexFailed={handleSaveRexFailed}
      />
    </>
  );
};

export default MapPinOverlays;
