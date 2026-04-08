import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { Animated as RNAnimated, Dimensions, Easing as RNEasing, Platform } from 'react-native';
import { FadeInLeft, FadeInRight, FadeOutLeft, FadeOutRight } from 'react-native-reanimated';
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
    prevStepIndex.current = stepIndex;
  }, [stepIndex]);

  const stepForward = stepIndex > prevStepIndex.current;
  const entering = stepForward
    ? FadeInRight.duration(timing.stepEnterMs)
    : FadeInLeft.duration(timing.stepEnterMs);
  const exiting = stepForward
    ? FadeOutLeft.duration(timing.stepExitMs)
    : FadeOutRight.duration(timing.stepExitMs);

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
    entering,
    exiting,
    handleClose,
  };
}
