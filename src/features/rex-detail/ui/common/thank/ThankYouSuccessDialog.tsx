import React from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSheetSpringAnimation } from '~/shared/hooks/useSheetSpringAnimation';
import { isWeb } from '~/shared/lib/ui/platform';
import { cn } from '~/shared/lib/ui/styles';
import { OVERLAY_MODAL_PLATFORM_PROPS } from '~/shared/config/overlaySheet';
import { ModalToastLayer } from '~/shared/ui/toast/ModalToastLayer';

const WEB_MAX_WIDTH = 480;

type Props = {
  open: boolean;
  message: string | null;
  onDone: () => void;
};

function ThankYouSuccessDialog({ open, message, onDone }: Props) {
  const { visible, backdropOpacity, sheetTranslateY } = useSheetSpringAnimation(open);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      {...OVERLAY_MODAL_PLATFORM_PROPS}
      onRequestClose={onDone}
    >
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: backdropOpacity }]}
        pointerEvents="box-none"
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onDone} />
      </Animated.View>

      <View style={styles.overlay} pointerEvents="box-none">
        <Animated.View
          style={{
            width: '100%',
            maxWidth: isWeb ? WEB_MAX_WIDTH : undefined,
            transform: [{ translateY: sheetTranslateY }],
          }}
        >
          <View
            className={cn(
              'w-full border border-border bg-card shadow-elevated',
              isWeb ? 'rounded-2xl' : 'rounded-t-2xl',
            )}
          >
            <View className="items-center px-5 pb-2 pt-7">
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Text style={{ fontSize: 32 }}>🎁</Text>
              </View>
              <Text className="mb-2 text-center font-display text-xl font-bold text-foreground">
                Thank you sent! 🎉
              </Text>
              <Text className="mb-1 text-center text-sm leading-relaxed text-muted-foreground">
                Your message is on its way. A little gratitude goes a long way.
              </Text>
              {message ? (
                <Text className="text-center text-sm italic text-muted-foreground">
                  &quot;{message}&quot;
                </Text>
              ) : null}
            </View>
            <View className="border-t border-border p-4">
              <TouchableOpacity
                onPress={onDone}
                activeOpacity={0.85}
                className="w-full items-center rounded-xl bg-primary py-3"
              >
                <Text className="text-sm font-semibold text-primary-foreground">Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
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
    paddingHorizontal: isWeb ? 16 : 0,
  },
});

export default ThankYouSuccessDialog;
