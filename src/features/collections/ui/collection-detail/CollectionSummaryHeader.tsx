import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Globe, Link2, Lock, Plus, type LucideIcon } from 'lucide-react-native';
import type {
  CollectionDetailRow,
  CollectionVisibility,
} from '~/features/collections/types/collection';
import { rexCountLabel } from '~/features/collections/lib/labels';
import { Theme } from '~/shared/theme/Theme';
import { webContainerStyle } from '~/shared/lib/ui/styles';

const VISIBILITY_BADGES: Record<CollectionVisibility, { Icon: LucideIcon; label: string }> = {
  public: { Icon: Globe, label: 'Public' },
  shared: { Icon: Link2, label: 'Shared' },
  private: { Icon: Lock, label: 'Private' },
};

function VisibilityBadge({ visibility }: { visibility: CollectionVisibility | undefined }) {
  if (!visibility) return null;
  const { Icon, label } = VISIBILITY_BADGES[visibility];

  return (
    <View className="flex-row items-center gap-1">
      <Icon size={12} color={Theme.colors.muted} />
      <Text className="text-xs text-muted-foreground">{label}</Text>
    </View>
  );
}

type Props = {
  detail: CollectionDetailRow;
  onAddItem: () => void;
};

function CollectionSummaryHeader({ detail, onAddItem }: Props) {
  const rexCount = detail.rexes.length;

  return (
    <View style={webContainerStyle} className="px-4 pt-1">
      <Text className="text-xl font-bold text-foreground">{detail.display_name}</Text>
      {detail.description ? (
        <Text className="text-sm text-muted-foreground mt-1">{detail.description}</Text>
      ) : null}
      <View className="flex-row items-center gap-3 mt-2">
        <VisibilityBadge visibility={detail.visibility} />
        <Text className="text-xs text-muted-foreground">{rexCountLabel(rexCount)}</Text>
      </View>

      {detail.is_my_collection ? (
        <Pressable
          onPress={onAddItem}
          accessibilityRole="button"
          accessibilityLabel="Add to collection"
          className="my-4 h-12 w-full flex-row items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border active:opacity-80"
        >
          <View pointerEvents="none" className="flex-row items-center justify-center gap-2">
            <Plus size={16} color={Theme.colors.muted} />
            <Text className="text-sm font-medium text-muted-foreground">Add to Collection</Text>
          </View>
        </Pressable>
      ) : (
        <View className="h-px bg-border my-4" />
      )}
    </View>
  );
}

export default CollectionSummaryHeader;
