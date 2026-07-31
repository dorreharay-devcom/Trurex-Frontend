import React, { type ReactNode } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { ModalToastLayer } from '~/shared/ui/toast/ModalToastLayer';
import { useSheetSlideAnimation } from '~/features/collections/hooks/common/useSheetSlideAnimation';
import { isWeb } from '~/utils';
import { KEYBOARD_BEHAVIOR_NATIVE_PADDING } from '~/shared/config/keyboard';
import { OVERLAY_MODAL_PLATFORM_PROPS } from '~/shared/config/modalProps';

type Props = {
  open: boolean;
  onClose: () => void;
  sheetStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
};

function BottomSheet({ open, onClose, sheetStyle, children }: Props) {
  const { visible, backdropOpacity, sheetTranslateY } = useSheetSlideAnimation(open);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      {...OVERLAY_MODAL_PLATFORM_PROPS}
      onRequestClose={onClose}
    >
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: backdropOpacity }]}
        pointerEvents="box-none"
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <View style={styles.outer} pointerEvents="box-none">
        <KeyboardAvoidingView
          behavior={KEYBOARD_BEHAVIOR_NATIVE_PADDING}
          pointerEvents="box-none"
          style={styles.full}
        >
          <Animated.View style={[styles.full, { transform: [{ translateY: sheetTranslateY }] }]}>
            <View
              style={sheetStyle}
              className="w-full bg-card rounded-t-2xl border-t border-border"
            >
              <View className="w-full items-center py-3">
                <View className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </View>
              {children}
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
      <ModalToastLayer />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0,0,0,0.4)' },
  outer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  full: { width: '100%' },
});

export default BottomSheet;
