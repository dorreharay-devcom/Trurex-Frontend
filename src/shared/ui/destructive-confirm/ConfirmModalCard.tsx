import React, { type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import ConfirmModalActions from '~/shared/ui/destructive-confirm/ConfirmModalActions';
import SheetHandle from '~/shared/ui/destructive-confirm/SheetHandle';
import { Theme } from '~/shared/theme/Theme';
import { isWeb, webContainerStyle } from '~/utils';
import { cn } from '~/utils/general';

const WEB_CARD_MAX_WIDTH = 400;

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

function ConfirmModalCard({ title, message, icon, ...actions }: Props) {
  return (
    <View
      className={cn(
        'border border-border bg-card pt-3 pb-8',
        isWeb ? 'w-full rounded-2xl' : 'rounded-t-2xl border-t-0',
      )}
      style={isWeb ? { maxWidth: WEB_CARD_MAX_WIDTH } : undefined}
    >
      <View style={webContainerStyle} className="px-4">
        <SheetHandle />
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

export default ConfirmModalCard;
