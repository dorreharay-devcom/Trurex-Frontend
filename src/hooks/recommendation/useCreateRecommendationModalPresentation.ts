import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { Animated as RNAnimated, Dimensions, Easing as RNEasing, Platform } from 'react-native';
import { modalConfig } from '~/constants/recommendation/modalConfig';

const { timing } = modalConfig;

type Params = {
  visible: boolean;
  windowHeight: number;
  stepIndex: number;
  onClose: () => void;
  reset: () => void;
};

export function useCreateRecommendationModalPresentation({
  visible,
  windowHeight,
  stepIndex,
  onClose,
  reset,
}: Params) {
  const prevStepIndex = useRef(-1);
  const sheetTranslateY = useRef(
    new RNAnimated.Value(Math.max(Dimensions.get('window').height, 1)),
  ).current;
  const stepOpacity = useRef(new RNAnimated.Value(1)).current;

  useLayoutEffect(() => {
    if (visible) {
      prevStepIndex.current = -1;
      reset();
    }
  }, [visible, reset]);

  useEffect(() => {
    if (!visible) return;
    const h = Math.max(windowHeight, Dimensions.get('window').height, 1);
    sheetTranslateY.setValue(h);
    RNAnimated.timing(sheetTranslateY, {
      toValue: 0,
      duration: timing.sheetOpenMs,
      easing: RNEasing.out(RNEasing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [visible, windowHeight, sheetTranslateY]);

  useLayoutEffect(() => {
    if (stepIndex !== prevStepIndex.current && prevStepIndex.current !== -1) {
      stepOpacity.setValue(0);
      RNAnimated.timing(stepOpacity, {
        toValue: 1,
        duration: timing.stepEnterMs,
        useNativeDriver: true,
      }).start();
    }
    prevStepIndex.current = stepIndex;
  }, [stepIndex]);

  const handleClose = useCallback(() => {
    const h = Math.max(windowHeight, Dimensions.get('window').height, 1);
    RNAnimated.timing(sheetTranslateY, {
      toValue: h,
      duration: timing.sheetCloseMs,
      easing: RNEasing.in(RNEasing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    }).start(({ finished }) => {
      if (finished) {
        onClose();
      }
    });
  }, [windowHeight, sheetTranslateY, onClose]);

  return {
    sheetTranslateY,
    stepOpacity,
    handleClose,
  };
}
