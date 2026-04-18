import React from 'react';
import { Platform, Pressable, Text } from 'react-native';
import { Reply, Trash2 } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';

type PressProps = {
  onPress: () => void;
};

export function ReplyAction({ onPress }: PressProps) {
  if (Platform.OS === 'web') {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Reply"
        className="flex-row cursor-pointer items-center gap-1 rounded-md bg-transparent px-0 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-primary active:opacity-70"
      >
        <Reply size={11} />
        <Text className="text-inherit">Reply</Text>
      </Pressable>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Reply"
      className="flex-row items-center gap-1 rounded-md"
    >
      <Reply size={11} color={Theme.colors.secondaryText} />
      <Text className="text-[11px] font-medium" style={{ color: Theme.colors.secondaryText }}>
        Reply
      </Text>
    </Pressable>
  );
}

export function DeleteAction({ onPress }: PressProps) {
  if (Platform.OS === 'web') {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Delete comment"
        className="flex-row cursor-pointer items-center gap-1 rounded-md bg-transparent px-0 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-destructive active:opacity-70"
      >
        <Trash2 size={11} />
        <Text className="text-inherit">Delete</Text>
      </Pressable>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Delete comment"
      className="flex-row items-center gap-1 rounded-md"
    >
      <Trash2 size={11} color={Theme.colors.secondaryText} />
      <Text className="text-[11px] font-medium" style={{ color: Theme.colors.secondaryText }}>
        Delete
      </Text>
    </Pressable>
  );
}
