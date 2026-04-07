import React from 'react';
import {
  Animated as RNAnimated,
  Modal,
  View,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';

export type OverlayModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  contentTranslateY: RNAnimated.Value;
  cardWidth: number;
  cardHeight: number;
  borderRadius: number;
  backdropBackground: string;
  /** Outer KeyboardAvoidingView padding (horizontal, top, bottom). */
  contentPadding: {
    horizontal: number;
    top: number;
    bottom: number;
  };
  children: React.ReactNode;
};

const styles = StyleSheet.create({
  overlayRoot: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

/**
 * Transparent RN Modal with backdrop dismiss and vertically animated content.
 * Sizes, colors, and padding are passed in by the caller.
 */
export const OverlayModal: React.FC<OverlayModalProps> = ({
  visible,
  onRequestClose,
  contentTranslateY,
  cardWidth,
  cardHeight,
  borderRadius,
  backdropBackground,
  contentPadding,
  children,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="none"
    presentationStyle={Platform.OS === 'ios' ? 'overFullScreen' : undefined}
    statusBarTranslucent={Platform.OS === 'android'}
    onRequestClose={onRequestClose}
  >
    <View style={styles.overlayRoot}>
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
        style={[
          StyleSheet.absoluteFillObject,
          {
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingHorizontal: contentPadding.horizontal,
            paddingTop: contentPadding.top,
            paddingBottom: contentPadding.bottom,
            zIndex: 61,
          },
        ]}
      >
        <RNAnimated.View
          style={{
            width: cardWidth,
            maxWidth: '100%',
            borderRadius,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.25,
            shadowRadius: 24,
            elevation: 12,
            transform: [{ translateY: contentTranslateY }],
          }}
        >
          <View
            style={{
              height: cardHeight,
              borderRadius,
            }}
          >
            {children}
          </View>
        </RNAnimated.View>
      </KeyboardAvoidingView>
    </View>
  </Modal>
);
