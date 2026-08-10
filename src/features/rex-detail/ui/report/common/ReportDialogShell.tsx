import React from 'react';
import {
  View,
  Pressable,
  KeyboardAvoidingView,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();

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
        paddingBottom: isWeb ? 0 : Math.max(insets.bottom, 12),
        ...(isWeb ? { overflow: 'hidden' as const } : null),
      }}
    >
      {children}
    </View>
  );

  return (
    <View style={styles.root} pointerEvents="box-none">
      <Pressable
        style={styles.backdrop}
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
      />
      <View
        style={[
          styles.sheetHost,
          {
            justifyContent: isWeb ? 'center' : 'flex-end',
            paddingHorizontal: isWeb ? 16 : 0,
            paddingTop: isWeb ? insets.top : 0,
          },
        ]}
        pointerEvents="box-none"
      >
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

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheetHost: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
  },
});

export default ReportDialogShell;
