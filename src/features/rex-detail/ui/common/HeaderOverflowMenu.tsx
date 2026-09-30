import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Flag, Gift, MoreVertical, Pencil, Trash2, type LucideIcon } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/shared/lib/ui/platform';
import { cn } from '~/shared/lib/ui/styles';

type MenuItem = {
  key: string;
  icon: LucideIcon;
  label: string;
  destructive?: boolean;
  onPress: () => void;
};

type Props = {
  isOwner: boolean;
  showReport: boolean;
  canAddToWishList: boolean;
  onEdit: (() => void) | undefined;
  onDelete: () => void;
  onReport: () => void;
  onAddToWishList: (() => void) | undefined;
};

function HeaderOverflowMenu({
  isOwner,
  showReport,
  canAddToWishList,
  onEdit,
  onDelete,
  onReport,
  onAddToWishList,
}: Props) {
  const [open, setOpen] = useState(false);

  const items: MenuItem[] = [];
  if (canAddToWishList && onAddToWishList) {
    items.push({
      key: 'wish-list',
      icon: Gift,
      label: 'Add to my Wish List',
      onPress: onAddToWishList,
    });
  }
  if (isOwner) {
    if (onEdit) items.push({ key: 'edit', icon: Pencil, label: 'Edit', onPress: onEdit });
    items.push({
      key: 'delete',
      icon: Trash2,
      label: 'Delete',
      destructive: true,
      onPress: onDelete,
    });
  }
  if (showReport) {
    items.push({
      key: 'report',
      icon: Flag,
      label: 'Report',
      destructive: true,
      onPress: onReport,
    });
  }

  if (items.length === 0) return null;

  return (
    <View className="relative">
      <Pressable
        onPress={() => setOpen((v) => !v)}
        hitSlop={isWeb ? 8 : undefined}
        accessibilityRole="button"
        accessibilityLabel="More options"
        className="h-9 w-9 items-center justify-center rounded-full active:opacity-80"
      >
        <MoreVertical size={20} color={Theme.colors.foreground} />
      </Pressable>

      {open ? (
        <>
          <Pressable
            onPress={() => setOpen(false)}
            style={[StyleSheet.absoluteFill, { zIndex: 10 }]}
          />
          <View
            className="absolute right-0 top-9 z-20 min-w-[190px] rounded-lg border border-border bg-card p-1 shadow-sm"
            style={{ elevation: 3 }}
          >
            {items.map((item) => (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.7}
                onPress={() => {
                  setOpen(false);
                  item.onPress();
                }}
                className="flex-row items-center gap-2 rounded-md px-2.5 py-2 hover:bg-zinc-100"
              >
                <item.icon
                  size={14}
                  color={item.destructive ? Theme.colors.destructive : Theme.colors.foreground}
                />
                <Text
                  numberOfLines={1}
                  className={cn(
                    'text-sm',
                    item.destructive ? 'text-destructive' : 'text-foreground',
                  )}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}

export default HeaderOverflowMenu;
