import CollectionDetailRoute from '~/features/collections/ui/CollectionDetailRoute';
import { COLLECTION_FROM } from '~/shared/lib/navigation/openCollection';

export default function GemsCollectionScreen() {
  return <CollectionDetailRoute from={COLLECTION_FROM.gems} />;
}
