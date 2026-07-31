import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

const OFFSCREEN_OFFSET = 600;

export function useModalSpringAnimation(open: boolean) {
  const [visible, setVisible] = useState(false);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(OFFSCREEN_OFFSET)).current;

  useEffect(() => {
    if (open) {
      setVisible(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(sheetTranslateY, {
          toValue: 0,
          damping: 20,
          stiffness: 200,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }
    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(sheetTranslateY, {
        toValue: OFFSCREEN_OFFSET,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  }, [open, backdropOpacity, sheetTranslateY]);

  return { visible, backdropOpacity, sheetTranslateY };
}
