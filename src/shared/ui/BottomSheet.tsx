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
import { KEYBOARD_BEHAVIOR_NATIVE_PADDING } from '~/shared/config/keyboard';
import { OVERLAY_MODAL_PLATFORM_PROPS } from '~/shared/config/overlaySheet';
import { useSheetSlideAnimation } from '~/shared/hooks/useSheetSlideAnimation';
import SheetHandle from '~/shared/ui/SheetHandle';
import { ModalToastLayer } from '~/shared/ui/toast/ModalToastLayer';

type Props = {
  open: boolean;
  onClose: () => void;
  sheetStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
};

const BottomSheet = ({ open, onClose, sheetStyle, children }: Props) => {
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
              className="w-full rounded-t-2xl border-t border-border bg-card"
            >
              <SheetHandle hideOnWeb={false} className="w-full py-3" />
              {children}
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
      <ModalToastLayer />
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0,0,0,0.4)' },
  outer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  full: { width: '100%' },
});

export default BottomSheet;
