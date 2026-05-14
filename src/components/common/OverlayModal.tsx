import React from 'react';
import {
  Animated as RNAnimated,
  Modal,
  View,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { OverlayModalProps } from '~/types/overlayModal';
import { ModalToastLayer } from '~/components/toast/ModalToastLayer';

export type { OverlayModalProps } from '~/types/overlayModal';

const styles = StyleSheet.create({
  overlayRoot: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
});

const webOverlayRoot: ViewStyle | undefined =
  Platform.OS === 'web'
    ? ({ width: '100%', height: '100%', minHeight: '100%' } as ViewStyle)
    : undefined;

export const OverlayModal: React.FC<OverlayModalProps> = ({
  visible,
  onRequestClose,
  contentTranslateY,
  backdropBackground,
  children,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      presentationStyle={Platform.OS === 'ios' ? 'overFullScreen' : undefined}
      statusBarTranslucent={Platform.OS === 'android'}
      onRequestClose={onRequestClose}
    >
      <View style={[styles.overlayRoot, webOverlayRoot]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close dialog"
          onPress={onRequestClose}
          style={[StyleSheet.absoluteFill, { zIndex: 60 }]}
        >
          <View
            pointerEvents="none"
            className={Platform.OS === 'web' ? 'backdrop-blur-sm' : ''}
            style={[StyleSheet.absoluteFill, { backgroundColor: backdropBackground }]}
          />
        </Pressable>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          pointerEvents="box-none"
          style={[StyleSheet.absoluteFillObject, { zIndex: 61 }]}
        >
          <RNAnimated.View
            style={{
              flex: 1,
              width: '100%',
              transform: [{ translateY: contentTranslateY }],
            }}
          >
            <View
              className="absolute inset-0 sm:inset-4 sm:top-8 flex flex-col overflow-hidden bg-card sm:rounded-2xl sm:shadow-elevated"
              style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                ...(Platform.OS === 'android' ? { elevation: 12 } : null),
              }}
            >
              {children}
            </View>
          </RNAnimated.View>
        </KeyboardAvoidingView>
      </View>
      <ModalToastLayer />
    </Modal>
  );
};
