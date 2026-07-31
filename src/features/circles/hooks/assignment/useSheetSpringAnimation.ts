import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

const SHEET_HIDDEN_OFFSET = 600;
const BACKDROP_IN_MS = 250;
const BACKDROP_OUT_MS = 200;
const SHEET_OUT_MS = 220;
const SPRING_DAMPING = 20;
const SPRING_STIFFNESS = 200;

export function useSheetSpringAnimation(open: boolean) {
  const [visible, setVisible] = useState(false);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SHEET_HIDDEN_OFFSET)).current;

  useEffect(() => {
    if (open) {
      setVisible(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: BACKDROP_IN_MS,
          useNativeDriver: true,
        }),
        Animated.spring(sheetTranslateY, {
          toValue: 0,
          damping: SPRING_DAMPING,
          stiffness: SPRING_STIFFNESS,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: BACKDROP_OUT_MS,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: SHEET_HIDDEN_OFFSET,
        duration: SHEET_OUT_MS,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  }, [open, backdropOpacity, sheetTranslateY]);

  return { visible, backdropOpacity, sheetTranslateY };
}
