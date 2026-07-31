import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Theme } from '~/shared/theme/Theme';
import { cn } from '~/utils/general';

type Props = {
  title: string;
  actionLabel: string;
  busy: boolean;
  onAction: () => void;
  className?: string;
};

function SheetHeader({ title, actionLabel, busy, onAction, className }: Props) {
  return (
    <>
      <View className={cn('w-full flex-row items-center justify-between px-4 pb-4', className)}>
        <Text className="text-base font-display font-medium text-foreground">{title}</Text>
        <TouchableOpacity onPress={onAction} activeOpacity={0.7} disabled={busy}>
          {busy ? (
            <ActivityIndicator size="small" color={Theme.colors.primary} />
          ) : (
            <Text className="text-sm font-semibold text-foreground">{actionLabel}</Text>
          )}
        </TouchableOpacity>
      </View>
      <View className="h-px w-full bg-border" />
    </>
  );
}

export default SheetHeader;
