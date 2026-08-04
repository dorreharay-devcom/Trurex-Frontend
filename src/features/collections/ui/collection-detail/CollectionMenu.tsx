import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  BookmarkMinus,
  BookmarkPlus,
  Pencil,
  Share2,
  Trash2,
  type LucideIcon,
} from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import type { CollectionActionsState } from '~/features/collections/hooks/collection-detail/useCollectionActions';
import { cn } from '~/shared/lib/ui/styles';

type MenuItemProps = {
  icon: LucideIcon;
  label: string;
  destructive?: boolean;
  onPress: () => void;
};

function MenuItem({ icon: Icon, label, destructive, onPress }: MenuItemProps) {
  const color = destructive ? Theme.colors.destructive : Theme.colors.foreground;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="mx-1 flex-row items-center gap-3 rounded-md px-3 py-2.5 hover:bg-zinc-100"
    >
      <Icon size={15} color={color} />
      <Text className={cn('text-sm', destructive ? 'text-destructive' : 'text-foreground')}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

type Props = {
  isMyCollection: boolean;
  actions: CollectionActionsState;
};

function CollectionMenu({ isMyCollection, actions }: Props) {
  if (!actions.showMenu) return null;

  return (
    <View
      className="absolute right-0 top-10 z-20 min-w-[200px] rounded-xl border border-border bg-card p-2 shadow-lg"
      style={{ elevation: 8 }}
    >
      {isMyCollection ? (
        <MenuItem
          icon={Pencil}
          label="Edit details"
          onPress={() => {
            actions.setShowEdit(true);
            actions.setShowMenu(false);
          }}
        />
      ) : null}
      <MenuItem
        icon={Share2}
        label="Share collection"
        onPress={() => void actions.shareCollection()}
      />
      {isMyCollection ? (
        <MenuItem
          icon={Trash2}
          label="Delete collection"
          destructive
          onPress={() => {
            actions.setShowDeleteConfirm(true);
            actions.setShowMenu(false);
          }}
        />
      ) : (
        <MenuItem
          icon={actions.isSaved ? BookmarkMinus : BookmarkPlus}
          label={actions.isSaved ? 'Remove from saved' : 'Save to my collections'}
          destructive={actions.isSaved}
          onPress={actions.toggleSaved}
        />
      )}
    </View>
  );
}

export default CollectionMenu;
