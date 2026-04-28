import React from 'react';
import { Platform, Pressable, Text } from 'react-native';
import { Heart, Reply, Trash2 } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';

type PressProps = {
  onPress: () => void;
};

const LIKE_ICON_SIZE = 15;

type LikeActionProps = {
  count: number;
  liked: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function LikeAction({ count, liked, disabled, onPress }: LikeActionProps) {
  const label = liked ? 'Unlike' : 'Like';
  const countLabel = count > 0 ? String(count) : '';
  const countColor = liked ? Theme.colors.primary : Theme.colors.secondaryText;
  if (Platform.OS === 'web') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={count ? `${label}, ${count} likes` : label}
        className="flex-row cursor-pointer items-center gap-0.5 rounded-md bg-transparent px-0 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors active:opacity-70 disabled:opacity-40"
        style={{ opacity: disabled ? 0.5 : 1 }}
        hitSlop={6}
      >
        <Heart
          size={LIKE_ICON_SIZE}
          color={liked ? Theme.colors.primary : Theme.colors.secondaryText}
          fill={liked ? Theme.colors.primary : 'transparent'}
        />
        {countLabel ? (
          <Text
            className="text-[11px] font-medium leading-[15px] tabular-nums"
            style={{ color: countColor }}
          >
            {countLabel}
          </Text>
        ) : null}
      </Pressable>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={count ? `${label}, ${count} likes` : label}
      className="flex-row items-center gap-0.5 rounded-md px-0 py-0.5"
      style={{ opacity: disabled ? 0.5 : 1 }}
      hitSlop={8}
    >
      <Heart
        size={LIKE_ICON_SIZE}
        color={liked ? Theme.colors.primary : Theme.colors.secondaryText}
        fill={liked ? Theme.colors.primary : 'transparent'}
      />
      {countLabel ? (
        <Text
          className="text-[11px] font-medium leading-[15px] tabular-nums"
          style={{ color: countColor }}
        >
          {countLabel}
        </Text>
      ) : null}
    </Pressable>
  );
}

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
