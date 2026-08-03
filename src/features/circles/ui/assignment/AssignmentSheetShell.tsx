import React, { type ReactNode } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSheetSpringAnimation } from '~/shared/hooks/useSheetSpringAnimation';
import { KEYBOARD_BEHAVIOR_IOS_PADDING } from '~/shared/config/keyboard';
import { OVERLAY_MODAL_PLATFORM_PROPS } from '~/shared/config/overlaySheet';
import { ModalToastLayer } from '~/shared/ui/toast/ModalToastLayer';
import { isWeb } from '~/shared/lib/ui/platform';
import { cn } from '~/shared/lib/ui/styles';

const SHEET_MAX_WIDTH_WEB = 448;
const SHEET_MAX_HEIGHT_RATIO = 0.85;

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

const AssignmentSheetShell = ({ open, onClose, children }: Props) => {
  const { width, height } = useWindowDimensions();
  const { visible, backdropOpacity, sheetTranslateY } = useSheetSpringAnimation(open);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      {...OVERLAY_MODAL_PLATFORM_PROPS}
      onRequestClose={onClose}
    >
      <Animated.View
        style={[StyleSheet.absoluteFillObject, styles.backdrop, { opacity: backdropOpacity }]}
        pointerEvents="box-none"
      >
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>

      <View style={styles.overlay} pointerEvents="box-none">
        <KeyboardAvoidingView
          behavior={KEYBOARD_BEHAVIOR_IOS_PADDING}
          pointerEvents="box-none"
          style={{ width: '100%', maxWidth: isWeb ? SHEET_MAX_WIDTH_WEB : width }}
        >
          <Animated.View style={{ transform: [{ translateY: sheetTranslateY }], width: '100%' }}>
            <View
              style={{ maxHeight: height * SHEET_MAX_HEIGHT_RATIO }}
              className={cn(
                'border border-border bg-card p-4 shadow-lg',
                isWeb ? 'rounded-2xl' : 'rounded-t-2xl',
              )}
            >
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
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlay: {
    flex: 1,
    justifyContent: isWeb ? 'center' : 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});

export default AssignmentSheetShell;
