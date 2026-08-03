import React from 'react';
import type { Animated } from 'react-native';
import AddRexToCollectionSheet from '~/features/collections/ui/AddRexToCollectionSheet';
import CollectionDetailView from '~/features/collections/ui/CollectionDetailView';
import type { Recommendation } from '~/shared/types/recommendation';
import { OverlayModal } from '~/shared/ui/OverlayModal';

export type ProfileCollectionOverlayState = {
  openCollectionId: string | null;
  closeCollection: () => void;
  setAddToCollectionId: (id: string) => void;
  handleCollectionRexPress: (rec: Recommendation) => void;
  sheetTranslateY: Animated.Value;
  addSheetOpen: boolean;
  addToCollectionId: string | null;
  closeAddSheet: () => void;
};

type Props = ProfileCollectionOverlayState & {
  fullscreen?: boolean;
};

function ProfileCollectionOverlays({
  openCollectionId,
  closeCollection,
  setAddToCollectionId,
  handleCollectionRexPress,
  sheetTranslateY,
  addSheetOpen,
  addToCollectionId,
  closeAddSheet,
  fullscreen = false,
}: Props) {
  if (fullscreen && !openCollectionId) return null;

  const detail = openCollectionId ? (
    <CollectionDetailView
      collectionId={openCollectionId}
      onBack={closeCollection}
      onAddItem={setAddToCollectionId}
      onRecommendationPress={handleCollectionRexPress}
    />
  ) : null;

  const addSheet = (
    <AddRexToCollectionSheet
      open={addSheetOpen}
      collectionId={addToCollectionId}
      onClose={closeAddSheet}
    />
  );

  if (fullscreen) {
    return (
      <>
        {detail}
        {addSheet}
      </>
    );
  }

  return (
    <>
      <OverlayModal
        visible={openCollectionId != null}
        onRequestClose={closeCollection}
        contentTranslateY={sheetTranslateY}
      >
        {detail}
      </OverlayModal>
      {addSheet}
    </>
  );
}

export default ProfileCollectionOverlays;
