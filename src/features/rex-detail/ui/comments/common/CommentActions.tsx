import React from 'react';
import { Pressable, Text } from 'react-native';
import { Heart, Reply, Trash2, type LucideIcon } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/utils';
import { cn } from '~/utils/general';

const LIKE_ICON_SIZE = 15;
const LIKE_ACTIVE_COLOR = Theme.colors.destructive;

const WEB_ACTION_CLASS =
  'cursor-pointer bg-transparent text-[11px] font-medium text-muted-foreground transition-colors active:opacity-70';

type LikeActionProps = {
  count: number;
  liked: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function LikeAction({ count, liked, disabled, onPress }: LikeActionProps) {
  const label = liked ? 'Unlike' : 'Like';
  const countLabel = count > 0 ? String(count) : '';
  const countColor = liked ? LIKE_ACTIVE_COLOR : Theme.colors.secondaryText;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={count ? `${label}, ${count} likes` : label}
      className={cn(
        'flex-row items-center gap-0.5 rounded-md px-0 py-0.5',
        isWeb && cn(WEB_ACTION_CLASS, 'disabled:opacity-40'),
      )}
      style={{ opacity: disabled ? 0.5 : 1 }}
      hitSlop={isWeb ? 6 : 8}
    >
      <Heart
        size={LIKE_ICON_SIZE}
        color={liked ? LIKE_ACTIVE_COLOR : Theme.colors.secondaryText}
        fill={liked ? LIKE_ACTIVE_COLOR : 'transparent'}
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

type TextActionProps = {
  icon: LucideIcon;
  label: string;
  accessibilityLabel: string;
  webHoverClass: string;
  onPress: () => void;
};

function TextAction({
  icon: Icon,
  label,
  accessibilityLabel,
  webHoverClass,
  onPress,
}: TextActionProps) {
  if (isWeb) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        className={cn(
          'flex-row items-center gap-1 rounded-md px-0 py-0.5',
          WEB_ACTION_CLASS,
          webHoverClass,
        )}
      >
        <Icon size={11} />
        <Text className="text-inherit">{label}</Text>
      </Pressable>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className="flex-row items-center gap-1 rounded-md"
    >
      <Icon size={11} color={Theme.colors.secondaryText} />
      <Text className="text-[11px] font-medium" style={{ color: Theme.colors.secondaryText }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ReplyAction({ onPress }: { onPress: () => void }) {
  return (
    <TextAction
      icon={Reply}
      label="Reply"
      accessibilityLabel="Reply"
      webHoverClass="hover:text-foreground"
      onPress={onPress}
    />
  );
}

export function DeleteAction({ onPress }: { onPress: () => void }) {
  return (
    <TextAction
      icon={Trash2}
      label="Delete"
      accessibilityLabel="Delete comment"
      webHoverClass="hover:text-destructive"
      onPress={onPress}
    />
  );
}
