import { useCallback, useEffect, useRef } from 'react';
import { Animated as RNAnimated, Dimensions, Easing as RNEasing, Platform } from 'react-native';
import { modalConfig } from '~/constants/recommendation/modalConfig';

const { sheetOpenMs, sheetCloseMs } = modalConfig.timing;

type Params = {
  visible: boolean;
  windowHeight: number;
  onClose: () => void;
};

export function useOverlaySheetPresentation({ visible, windowHeight, onClose }: Params) {
  const sheetTranslateY = useRef(
    new RNAnimated.Value(Math.max(Dimensions.get('window').height, 1)),
  ).current;

  useEffect(() => {
    if (!visible) return;
    const h = Math.max(windowHeight, Dimensions.get('window').height, 1);
    sheetTranslateY.setValue(h);
    RNAnimated.timing(sheetTranslateY, {
      toValue: 0,
      duration: sheetOpenMs,
      easing: RNEasing.out(RNEasing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [visible, windowHeight, sheetTranslateY]);

  const handleClose = useCallback(() => {
    const h = Math.max(windowHeight, Dimensions.get('window').height, 1);
    RNAnimated.timing(sheetTranslateY, {
      toValue: h,
      duration: sheetCloseMs,
      easing: RNEasing.in(RNEasing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    }).start(({ finished }) => {
      if (finished) onClose();
    });
  }, [windowHeight, sheetTranslateY, onClose]);

  return { sheetTranslateY, handleClose };
}
