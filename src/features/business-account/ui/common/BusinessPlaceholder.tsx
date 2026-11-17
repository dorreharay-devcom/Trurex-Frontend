import React, { type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Button } from '~/shared/ui/primitives/Button';

type Props = {
  icon: ReactNode;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

function BusinessPlaceholder({ icon, title, message, actionLabel, onAction }: Props) {
  return (
    <View className="items-center gap-3 px-4 py-10">
      <View className="h-12 w-12 items-center justify-center rounded-full bg-accent">{icon}</View>
      <Text
        className="text-center font-display text-base font-semibold text-foreground"
        accessibilityRole="header"
      >
        {title}
      </Text>
      <Text className="text-center text-sm leading-relaxed text-muted-foreground">{message}</Text>
      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} className="mt-2" />
      ) : null}
    </View>
  );
}

export default BusinessPlaceholder;
