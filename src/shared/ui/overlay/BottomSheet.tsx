import React, { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { KEYBOARD_BEHAVIOR_NATIVE_PADDING } from '~/shared/config/keyboard';
import { modalConfig, OVERLAY_MODAL_PLATFORM_PROPS } from '~/shared/config/overlaySheet';
import { isWeb } from '~/shared/lib/ui/platform';
import { cn } from '~/shared/lib/ui/styles';
import SheetHandle from '~/shared/ui/overlay/SheetHandle';
import { ModalToastLayer } from '~/shared/ui/toast/ModalToastLayer';

const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 900;
const WEB_MAX_WIDTH = 480;
const { sheetOpenMs, sheetCloseMs } = modalConfig.timing;
const easeOut = Easing.out(Easing.cubic);
const easeIn = Easing.in(Easing.cubic);

type Props = {
  open: boolean;
  onClose: () => void;
  sheetStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
};

const BottomSheet = ({ open, onClose, sheetStyle, children }: Props) => {
  const { height } = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const wasOpen = useRef(false);
  const translateY = useSharedValue(height);
  const dragY = useSharedValue(0);
  const backdrop = useSharedValue(0);

  const hideModal = useCallback(() => {
    setVisible(false);
    dragY.value = 0;
  }, [dragY]);

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      setVisible(true);
      dragY.value = 0;
      translateY.value = height;
      backdrop.value = 0;
      translateY.value = withTiming(0, { duration: sheetOpenMs, easing: easeOut });
      backdrop.value = withTiming(1, { duration: sheetOpenMs });
      return;
    }

    if (!wasOpen.current) return;
    wasOpen.current = false;
    const offset = translateY.value + dragY.value;
    translateY.value = offset;
    dragY.value = 0;
    translateY.value = withTiming(height, { duration: sheetCloseMs, easing: easeIn });
    backdrop.value = withTiming(0, { duration: sheetCloseMs }, (finished) => {
      if (finished) runOnJS(hideModal)();
    });
  }, [open, height, translateY, dragY, backdrop, hideModal]);

  const requestClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const pan = Gesture.Pan()
    .activeOffsetY(10)
    .failOffsetX([-20, 20])
    .onUpdate((e) => {
      dragY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      const shouldDismiss = e.translationY > DISMISS_DISTANCE || e.velocityY > DISMISS_VELOCITY;
      if (shouldDismiss) {
        runOnJS(requestClose)();
        return;
      }
      dragY.value = withTiming(0, { duration: 200, easing: easeOut });
    });

  const sheetAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value + dragY.value }],
  }));

  const backdropAnimStyle = useAnimatedStyle(() => {
    const offset = translateY.value + dragY.value;
    const dragFactor = height > 0 ? 1 - Math.min(offset, height) / height : 1;
    return { opacity: backdrop.value * dragFactor };
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      {...OVERLAY_MODAL_PLATFORM_PROPS}
      onRequestClose={requestClose}
    >
      <GestureHandlerRootView style={styles.fullFlex}>
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.backdrop, backdropAnimStyle]}
          pointerEvents="box-none"
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={requestClose} />
        </Animated.View>

        <View style={styles.outer} pointerEvents="box-none">
          <KeyboardAvoidingView
            behavior={KEYBOARD_BEHAVIOR_NATIVE_PADDING}
            pointerEvents="box-none"
            style={styles.full}
          >
            <Animated.View style={[styles.full, sheetAnimStyle]}>
              <View
                style={sheetStyle}
                className={cn(
                  'w-full bg-card',
                  isWeb
                    ? 'rounded-2xl border border-border shadow-elevated'
                    : 'rounded-t-2xl border-t border-border',
                )}
              >
                {isWeb ? null : (
                  <GestureDetector gesture={pan}>
                    <Animated.View>
                      <SheetHandle className="w-full py-3" />
                    </Animated.View>
                  </GestureDetector>
                )}
                {children}
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
        <ModalToastLayer />
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullFlex: { flex: 1 },
  backdrop: { backgroundColor: 'rgba(0,0,0,0.4)' },
  outer: {
    flex: 1,
    justifyContent: isWeb ? 'center' : 'flex-end',
    alignItems: 'center',
    paddingHorizontal: isWeb ? 16 : 0,
    paddingVertical: isWeb ? 24 : 0,
  },
  full: { width: '100%', maxWidth: WEB_MAX_WIDTH, alignSelf: 'center' },
});

export default BottomSheet;
