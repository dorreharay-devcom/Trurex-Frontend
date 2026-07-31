import React, { type ReactNode } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { X } from 'lucide-react-native';
import { ModalToastLayer } from '~/shared/ui/toast/ModalToastLayer';
import { useModalSpringAnimation } from '~/features/collections/hooks/common/useModalSpringAnimation';
import { Theme } from '~/shared/theme/Theme';
import { isWeb, webContainerStyle } from '~/utils';
import { cn } from '~/utils/general';
import { KEYBOARD_BEHAVIOR_NATIVE_PADDING } from '~/shared/config/keyboard';
import { OVERLAY_MODAL_PLATFORM_PROPS } from '~/shared/config/modalProps';

const WEB_MAX_WIDTH = 512;

type Props = {
  open: boolean;
  title: string;
  cardStyle: StyleProp<ViewStyle>;
  footer: ReactNode;
  onClose: () => void;
  children: ReactNode;
};

function CollectionModalShell({ open, title, cardStyle, footer, onClose, children }: Props) {
  const { width } = useWindowDimensions();
  const { visible, backdropOpacity, sheetTranslateY } = useModalSpringAnimation(open);

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

      <View style={styles.overlay} pointerEvents="box-none">
        <KeyboardAvoidingView
          behavior={KEYBOARD_BEHAVIOR_NATIVE_PADDING}
          pointerEvents="box-none"
          style={{ width: '100%', maxWidth: isWeb ? WEB_MAX_WIDTH : width }}
        >
          <Animated.View style={{ transform: [{ translateY: sheetTranslateY }] }}>
            <View
              style={cardStyle}
              className={cn(
                'bg-card border border-border shadow-elevated overflow-hidden',
                isWeb ? 'rounded-2xl' : 'rounded-t-2xl',
              )}
            >
              <View className="flex-row items-center justify-between p-4 border-b border-border bg-card">
                <Text className="font-display font-bold text-foreground text-lg">{title}</Text>
                <TouchableOpacity onPress={onClose} className="p-1">
                  <X size={20} color={Theme.colors.muted} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[{ padding: 16, gap: 20 }, webContainerStyle]}
              >
                {children}
              </ScrollView>

              <View className="border-t border-border bg-card">
                <View style={[{ padding: 16 }, webContainerStyle]}>{footer}</View>
              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
      <ModalToastLayer />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0,0,0,0.5)' },
  overlay: {
    flex: 1,
    justifyContent: isWeb ? 'center' : 'flex-end',
    alignItems: 'center',
  },
  scroll: { flex: 1 },
});

export default CollectionModalShell;
