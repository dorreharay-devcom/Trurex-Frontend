import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Flag, Gift, MoreVertical, Pencil, Trash2, type LucideIcon } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/shared/lib/ui/platform';
import { cn } from '~/shared/lib/ui/styles';
import BottomSheet from '~/shared/ui/overlay/BottomSheet';

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

function buildItems({
  isOwner,
  showReport,
  canAddToWishList,
  onEdit,
  onDelete,
  onReport,
  onAddToWishList,
}: Props): MenuItem[] {
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
    items.push({ key: 'report', icon: Flag, label: 'Report', destructive: true, onPress: onReport });
  }
  return items;
}

function TriggerButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={isWeb ? 8 : undefined}
      accessibilityRole="button"
      accessibilityLabel="More options"
      className="h-9 w-9 items-center justify-center rounded-full active:opacity-80"
    >
      <MoreVertical size={20} color={Theme.colors.foreground} />
    </Pressable>
  );
}

function WebDropdownMenu({ items, onSelect }: { items: MenuItem[]; onSelect: (item: MenuItem) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <View className="relative">
      <TriggerButton onPress={() => setOpen((v) => !v)} />

      {open ? (
        <>
          <Pressable
            onPress={() => setOpen(false)}
            style={[StyleSheet.absoluteFill, { zIndex: 10 }]}
          />
          <View
            className="absolute right-0 top-9 z-20 rounded-lg border border-border bg-card p-1 shadow-sm"
            style={{ elevation: 3 }}
          >
            {items.map((item) => (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.7}
                onPress={() => {
                  setOpen(false);
                  onSelect(item);
                }}
                className="flex-row items-center gap-2 rounded-md px-2.5 py-2.5 hover:bg-zinc-100"
              >
                <item.icon
                  size={14}
                  color={item.destructive ? Theme.colors.destructive : Theme.colors.foreground}
                />
                <Text
                  numberOfLines={1}
                  className={cn('text-sm', item.destructive ? 'text-destructive' : 'text-foreground')}
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

function NativeSheetMenu({ items, onSelect }: { items: MenuItem[]; onSelect: (item: MenuItem) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <TriggerButton onPress={() => setOpen(true)} />

      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <View className="-mt-2 pb-10">
          <Text className="px-5 pb-4 pt-1 text-xl font-display font-bold text-foreground">
            Actions
          </Text>
          <View className="h-px bg-border" />
          {items.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => {
                setOpen(false);
                onSelect(item);
              }}
              className="flex-row items-center gap-3 px-5 py-3 active:bg-muted/40"
            >
              <item.icon
                size={20}
                color={item.destructive ? Theme.colors.destructive : Theme.colors.foreground}
              />
              <Text
                className={cn('text-base', item.destructive ? 'text-destructive' : 'text-foreground')}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </BottomSheet>
    </View>
  );
}

function HeaderOverflowMenu(props: Props) {
  const items = buildItems(props);
  if (items.length === 0) return null;

  const onSelect = (item: MenuItem) => item.onPress();

  if (isWeb) return <WebDropdownMenu items={items} onSelect={onSelect} />;
  return <NativeSheetMenu items={items} onSelect={onSelect} />;
}

export default HeaderOverflowMenu;
