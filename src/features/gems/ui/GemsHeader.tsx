import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { ClearableSearchInput } from '~/shared/ui/primitives/ClearableSearchInput';
import CollectionsRail from '~/features/gems/ui/CollectionsRail';
import type { GemsCollectionsState } from '~/features/gems/hooks/useGemsData';
import {
  Theme,
  textFieldCaretStyle,
  textFieldSingleLineDefaultHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';

function UncollectedSkeleton() {
  return (
    <View className="gap-3 mb-3">
      {[1, 2].map((i) => (
        <View key={i} className="h-16 rounded-xl bg-border/40" />
      ))}
    </View>
  );
}

type Props = {
  searchQuery: string;
  onChangeSearch: (value: string) => void;
  collections: GemsCollectionsState;
  loadingUncollected: boolean;
  onOpenCollection: (id: string) => void;
  onCreateCollection: () => void;
};

function GemsHeader({
  searchQuery,
  onChangeSearch,
  collections,
  loadingUncollected,
  onOpenCollection,
  onCreateCollection,
}: Props) {
  const count = collections.items.length;

  return (
    <View className="px-4 pt-6">
      <ClearableSearchInput
        value={searchQuery}
        onChangeText={onChangeSearch}
        placeholder="Search your saved gems..."
        placeholderTextColor={Theme.colors.muted}
        containerClassName="mb-4"
        iconColor={Theme.colors.muted}
        clearIconColor={Theme.colors.muted}
        inputClassName="w-full pl-9 pr-10 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground"
        inputStyle={[
          textFieldCaretStyle,
          textFieldSingleLineStyle,
          textFieldSingleLineDefaultHeightStyle,
        ]}
        multiline={false}
        numberOfLines={1}
        scrollEnabled={false}
      />

      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-lg font-display font-bold text-foreground">Gems</Text>
        <TouchableOpacity
          onPress={onCreateCollection}
          activeOpacity={0.7}
          className="flex-row items-center gap-1.5 px-3 py-2 rounded-lg border border-border"
        >
          <Plus size={14} color={Theme.colors.foreground} />
          <Text className="text-xs font-medium text-foreground">New collection</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-xs text-muted-foreground mb-5">
        Showing {count} collection{count !== 1 ? 's' : ''}
      </Text>

      <CollectionsRail
        collections={collections}
        onOpenCollection={onOpenCollection}
        onCreateCollection={onCreateCollection}
      />

      <Text className="text-base font-display font-medium text-foreground mb-1">
        Uncollected Rex
      </Text>
      <Text className="text-xs text-muted-foreground mb-4">
        Rex you've saved but haven't added to a collection yet
      </Text>

      {loadingUncollected && <UncollectedSkeleton />}
    </View>
  );
}

export default GemsHeader;
