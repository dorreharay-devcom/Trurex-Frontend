import React, { type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { ConfirmModalActions } from '~/shared/ui/destructive-confirm/ConfirmModalActions';
import SheetHandle from '~/shared/ui/overlay/SheetHandle';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/shared/lib/ui/platform';
import { cn } from '~/shared/lib/ui/styles';

type Props = {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  icon?: ReactNode;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmModalCard({ title, message, icon, ...actions }: Props) {
  return (
    <View
      className={cn(
        'w-full border border-border bg-card pt-3 pb-8',
        isWeb ? 'max-w-[400px] rounded-2xl' : 'rounded-t-2xl border-t-0',
      )}
    >
      <View className="px-4">
        <SheetHandle className="mb-4" />
        <View className="mb-4 h-12 w-12 items-center justify-center self-center rounded-full bg-destructive/10">
          {icon ?? <Trash2 size={22} color={Theme.colors.destructive} />}
        </View>
        <Text className="mb-1 text-center font-display text-lg font-bold text-foreground">
          {title}
        </Text>
        <Text className="mb-6 text-center text-sm leading-relaxed text-muted-foreground">
          {message}
        </Text>
        <ConfirmModalActions {...actions} />
      </View>
    </View>
  );
}
