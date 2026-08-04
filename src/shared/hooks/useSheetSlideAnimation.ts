import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, useWindowDimensions } from 'react-native';
import { modalConfig } from '~/shared/config/overlaySheet';
import { isWeb } from '~/shared/lib/ui/platform';

export function useSheetSlideAnimation(open: boolean) {
  const { height } = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(height)).current;
  const useNativeDriver = !isWeb;

  useEffect(() => {
    if (open) {
      setVisible(true);
      sheetTranslateY.setValue(height);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: modalConfig.timing.sheetOpenMs,
          useNativeDriver,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: modalConfig.timing.sheetOpenMs,
          easing: Easing.out(Easing.cubic),
          useNativeDriver,
        }),
      ]).start();
      return;
    }
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: modalConfig.timing.sheetCloseMs,
        useNativeDriver,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: height,
        duration: modalConfig.timing.sheetCloseMs,
        easing: Easing.in(Easing.cubic),
        useNativeDriver,
      }),
    ]).start(() => setVisible(false));
  }, [open, height, backdropOpacity, sheetTranslateY, useNativeDriver]);

  return { visible, backdropOpacity, sheetTranslateY };
}
