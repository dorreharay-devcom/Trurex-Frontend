import { useLayoutEffect, useRef } from 'react';
import { Animated as RNAnimated } from 'react-native';
import { modalConfig } from '~/shared/config/overlaySheet';
import { useOverlaySheetPresentation } from '~/shared/hooks/useOverlaySheetPresentation';

const { timing } = modalConfig;

type Params = {
  visible: boolean;
  windowHeight: number;
  stepIndex: number;
  onClose: () => void;
};

export function useModalPresentation({ visible, windowHeight, stepIndex, onClose }: Params) {
  const prevStepIndex = useRef(-1);
  const { sheetTranslateY, handleClose } = useOverlaySheetPresentation({
    visible,
    windowHeight,
    onClose,
  });
  const stepOpacity = useRef(new RNAnimated.Value(1)).current;

  useLayoutEffect(() => {
    if (visible) prevStepIndex.current = -1;
  }, [visible]);

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
  }, [stepIndex, stepOpacity]);

  return {
    sheetTranslateY,
    stepOpacity,
    handleClose,
  };
}
