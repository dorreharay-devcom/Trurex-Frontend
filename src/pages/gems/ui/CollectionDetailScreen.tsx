import React, { useState } from 'react';
import CollectionDetailView from '~/features/collections/ui/CollectionDetailView';
import AddRexToCollectionSheet from '~/features/collections/ui/AddRexToCollectionSheet';
import type { Recommendation, RecommendationOpenOptions } from '~/shared/types/recommendation';

type Props = {
  collectionId: string;
  onBack: () => void;
  onRecommendationPress?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
};

function CollectionDetailScreen({ collectionId, onBack, onRecommendationPress }: Props) {
  const [addRexCollectionId, setAddRexCollectionId] = useState<string | null>(null);

  return (
    <>
      <CollectionDetailView
        collectionId={collectionId}
        onBack={onBack}
        onAddItem={setAddRexCollectionId}
        onRecommendationPress={onRecommendationPress}
      />
      <AddRexToCollectionSheet
        open={!!addRexCollectionId}
        collectionId={addRexCollectionId}
        onClose={() => setAddRexCollectionId(null)}
      />
    </>
  );
}

export default CollectionDetailScreen;
