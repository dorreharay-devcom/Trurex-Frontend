import React from 'react';
import { View, Pressable, KeyboardAvoidingView, useWindowDimensions } from 'react-native';
import { isIos, isWeb } from '~/shared/lib/ui/platform';
import { cn } from '~/shared/lib/ui/styles';
import { CREATE_REC_MODAL_MAX_W } from '~/features/rex-create/config/layout';

type Props = {
  maxSheetHeight: number;
  onDismiss: () => void;
  children: React.ReactNode;
};

function ReportDialogShell({ maxSheetHeight, onDismiss, children }: Props) {
  const { width: windowWidth } = useWindowDimensions();

  const shellLayoutStyle = {
    width: '100%' as const,
    maxWidth: isWeb ? CREATE_REC_MODAL_MAX_W : windowWidth,
    ...(isWeb ? { alignSelf: 'center' as const } : null),
  };

  const card = (
    <View
      className={cn(
        'w-full bg-card',
        isWeb
          ? 'max-w-full rounded-2xl border border-border shadow-elevated'
          : 'rounded-t-2xl border-x border-t border-border',
      )}
      style={{
        maxHeight: maxSheetHeight,
        width: '100%',
        paddingBottom: isWeb ? 0 : undefined,
        ...(isWeb ? { overflow: 'hidden' as const } : null),
      }}
    >
      {children}
    </View>
  );

  return (
    <View
      className="flex-1"
      style={{
        justifyContent: isWeb ? 'center' : 'flex-end',
        paddingHorizontal: isWeb ? 16 : 0,
      }}
      pointerEvents="box-none"
    >
      <Pressable
        className="absolute bottom-0 left-0 right-0 top-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
      />
      <View className={isWeb ? 'w-full items-center' : 'w-full'} pointerEvents="box-none">
        {isIos ? (
          <KeyboardAvoidingView behavior="padding" style={shellLayoutStyle}>
            {card}
          </KeyboardAvoidingView>
        ) : (
          <View style={shellLayoutStyle}>{card}</View>
        )}
      </View>
    </View>
  );
}

export default ReportDialogShell;
