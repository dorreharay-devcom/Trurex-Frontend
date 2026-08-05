import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { ArrowLeft } from 'lucide-react-native';
import { useCollectionDetail } from '~/features/collections/hooks/data/useCollectionQueries';
import { useRemoveRexFromCollection } from '~/features/collections/hooks/data/useCollectionRexMutations';
import { useCollectionActions } from '~/features/collections/hooks/collection-detail/useCollectionActions';
import { useRexNoteEditor } from '~/features/collections/hooks/collection-detail/useRexNoteEditor';
import CollectionDetailOverlays from '~/features/collections/ui/collection-detail/CollectionDetailOverlays';
import CollectionHeaderBar from '~/features/collections/ui/collection-detail/CollectionHeaderBar';
import CollectionRexCard from '~/features/collections/ui/collection-detail/rex-card/CollectionRexCard';
import CollectionSummaryHeader from '~/features/collections/ui/collection-detail/CollectionSummaryHeader';
import { entryToRecommendation } from '~/features/collections/lib/mappers';
import type { Recommendation, RecommendationOpenOptions } from '~/shared/types/recommendation';
import { Theme } from '~/shared/theme/Theme';
import { KEYBOARD_BEHAVIOR_PADDING_OR_HEIGHT } from '~/shared/config/keyboard';
import { webContainerStyle } from '~/shared/lib/ui/styles';
import QueryErrorState from '~/shared/ui/query/QueryErrorState';
import { buttonA11y } from '~/shared/lib/a11y';

function EmptyCollection() {
  return (
    <View className="items-center py-12 gap-1 px-4">
      <Text className="text-3xl mb-1">📦</Text>
      <Text className="text-base font-semibold text-foreground text-center">
        Your collection is ready
      </Text>
      <Text className="text-sm text-muted-foreground text-center">
        Start adding recommendations.
      </Text>
    </View>
  );
}

function CollectionBack({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute left-4 top-4 z-10 flex-row items-center gap-1"
      {...buttonA11y('Back')}
    >
      <ArrowLeft size={16} color={Theme.colors.muted} />
      <Text className="text-sm text-muted-foreground">Back</Text>
    </TouchableOpacity>
  );
}

function CollectionNotFound({ onBack }: { onBack: () => void }) {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-8" style={webContainerStyle}>
      <CollectionBack onPress={onBack} />
      <Text className="text-lg font-semibold text-foreground" accessibilityRole="header">
        Collection not found
      </Text>
      <Text className="text-center text-sm text-muted-foreground">
        This collection doesn&apos;t exist or may have been removed.
      </Text>
    </View>
  );
}

export type CollectionDetailViewProps = {
  collectionId: string;
  onBack: () => void;
  onAddItem: (collectionId: string) => void;
  onRecommendationPress?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
};

function CollectionDetailView({
  collectionId,
  onBack,
  onAddItem,
  onRecommendationPress,
}: CollectionDetailViewProps) {
  const {
    data: detail,
    isLoading,
    isError,
    isFetched,
    refetch,
  } = useCollectionDetail(collectionId);
  const removeMutation = useRemoveRexFromCollection(collectionId);
  const actions = useCollectionActions({ collectionId, detail, onBack });
  const noteEditor = useRexNoteEditor(collectionId);

  if (isLoading) {
    return (
      <View className="px-4 pt-4" style={webContainerStyle}>
        <ActivityIndicator className="mt-6" color={Theme.colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center" style={webContainerStyle}>
        <CollectionBack onPress={onBack} />
        <QueryErrorState title="Couldn't load collection" onRetry={() => void refetch()} />
      </View>
    );
  }

  if (isFetched && !detail) {
    return <CollectionNotFound onBack={onBack} />;
  }

  if (!detail) {
    return (
      <View className="px-4 pt-4" style={webContainerStyle}>
        <ActivityIndicator className="mt-6" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <KeyboardAvoidingView
        behavior={KEYBOARD_BEHAVIOR_PADDING_OR_HEIGHT}
        className="min-h-0 flex-1"
      >
        <CollectionHeaderBar
          isMyCollection={detail.is_my_collection}
          actions={actions}
          onBack={onBack}
        />
        <FlashList
          data={detail.rexes}
          keyExtractor={(item) => item.rex_id}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          contentContainerStyle={[webContainerStyle, { paddingBottom: 144 }]}
          ListHeaderComponent={
            <CollectionSummaryHeader detail={detail} onAddItem={() => onAddItem(collectionId)} />
          }
          ListEmptyComponent={<EmptyCollection />}
          drawDistance={400}
          renderItem={({ item }) => (
            <CollectionRexCard
              item={item}
              isMyCollection={detail.is_my_collection}
              noteEditor={noteEditor}
              onPress={() => onRecommendationPress?.(entryToRecommendation(item))}
              onRemove={() => removeMutation.mutate(item.rex_id)}
            />
          )}
        />
      </KeyboardAvoidingView>

      <CollectionDetailOverlays collectionId={collectionId} detail={detail} actions={actions} />
    </>
  );
}

export default CollectionDetailView;
