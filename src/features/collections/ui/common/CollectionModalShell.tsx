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
import { useSheetSpringAnimation } from '~/shared/hooks/useSheetSpringAnimation';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/shared/lib/ui/platform';
import { KEYBOARD_BEHAVIOR_NATIVE_PADDING } from '~/shared/config/keyboard';
import { OVERLAY_MODAL_PLATFORM_PROPS } from '~/shared/config/overlaySheet';
import { withWebContainer, cn } from '~/shared/lib/ui/styles';

const WEB_MAX_WIDTH = 512;

type Props = {
  open: boolean;
  title: string;
  cardStyle: StyleProp<ViewStyle>;
  footer: ReactNode;
  onClose: () => void;
  children: ReactNode;
};

const CollectionModalShell = ({ open, title, cardStyle, footer, onClose, children }: Props) => {
  const { width } = useWindowDimensions();
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
                'overflow-hidden border border-border bg-card shadow-elevated',
                isWeb ? 'rounded-2xl' : 'rounded-t-2xl',
              )}
            >
              <View className="flex-row items-center justify-between border-b border-border bg-card p-4">
                <Text className="font-display text-lg font-bold text-foreground">{title}</Text>
                <TouchableOpacity onPress={onClose} className="p-1">
                  <X size={20} color={Theme.colors.muted} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={withWebContainer({ padding: 16, gap: 20 })}
              >
                {children}
              </ScrollView>

              <View className="border-t border-border bg-card">
                <View style={withWebContainer({ padding: 16 })}>{footer}</View>
              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
      <ModalToastLayer />
    </Modal>
  );
};

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
