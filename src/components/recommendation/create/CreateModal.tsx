import React, { useCallback } from 'react';
import { View, Text, Pressable, Alert, useWindowDimensions } from 'react-native';
import * as Location from 'expo-location';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { CREATE_REC_MODAL_MAX_W } from '~/constants/recommendation/createLayout';
import { OverlayModal } from '~/components/common/OverlayModal';
import { modalConfig } from '~/constants/recommendation/modalConfig';
import { Theme } from '~/theme/Theme';
import {
  useCreateRecWizard,
  useCreateRecommendationModalPresentation,
} from '~/hooks/recommendation';
import { CreateWizardStepper } from './CreateWizardStepper';
import { CreateModalBody } from './CreateModalBody';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const CreateModal: React.FC<Props> = ({ visible, onClose }) => {
  const { height: windowHeight } = useWindowDimensions();
  const flow = useCreateRecWizard();
  const { reset, setManualGeotag } = flow;

  const { sheetTranslateY, stepOpacity, handleClose } =
    useCreateRecommendationModalPresentation({
      visible,
      windowHeight,
      stepIndex: flow.stepIndex,
      onClose,
      reset,
    });

  const handlePrimaryFooter = () => {
    if (flow.isLastStep) {
      Alert.alert('Rex saved (demo)', 'Connect your API when ready.');
      handleClose();
      return;
    }
    flow.goNext();
  };

  const handleTagLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location', 'Permission is required to tag your current location.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = pos.coords;
      setManualGeotag({ lat: latitude, lng: longitude });
    } catch {
      Alert.alert(
        'Location',
        'Could not read your location. Try again or enter an address manually.',
      );
    }
  }, [setManualGeotag]);

  const { layout } = modalConfig;

  return (
    <OverlayModal
      visible={visible}
      onRequestClose={handleClose}
      contentTranslateY={sheetTranslateY}
      backdropBackground={layout.backdropBackground}
    >
      <View className="flex-1 min-h-0 flex-col">
        <View className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur px-4 py-4 sm:px-6">
          <View className="flex-row items-center">
            <View className="w-[72px] items-start justify-center">
              <Pressable
                onPress={flow.stepIndex === 0 ? handleClose : flow.goBack}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel={flow.stepIndex === 0 ? 'Cancel' : 'Back'}
                className="flex-row items-center gap-1.5 rounded-lg py-0.5 active:opacity-80"
              >
                <ArrowLeft size={20} color={Theme.colors.secondaryText} />
                <Text className="text-sm font-medium text-muted-foreground">
                  {flow.stepIndex === 0 ? 'Cancel' : 'Back'}
                </Text>
              </Pressable>
            </View>
            <Text className="min-w-0 flex-1 text-center text-lg font-display font-semibold text-foreground">
              New Rex
            </Text>
            <View className="w-[72px]" />
          </View>

          <CreateWizardStepper currentIndex={flow.stepIndex} />
        </View>

        <CreateModalBody
          flow={flow}
          stepOpacity={stepOpacity}
          onTagLocation={handleTagLocation}
        />

        <View className="sticky bottom-0 items-center border-t border-border bg-card/95 backdrop-blur px-4 py-4 sm:px-6">
          <View
            className="w-full"
            style={{
              maxWidth: CREATE_REC_MODAL_MAX_W,
              paddingBottom: layout.minSafeBottom,
            }}
          >
            <Pressable
              onPress={handlePrimaryFooter}
              disabled={!flow.canProceed}
              accessibilityRole="button"
              accessibilityLabel={flow.isLastStep ? 'Confirm and post' : 'Continue'}
              className="inline-flex w-full h-12 flex-row items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-4 py-2 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:bg-primary/90"
            >
              <Text className="text-base font-semibold text-primary-foreground">
                {flow.isLastStep ? 'Confirm & Post 🦖' : 'Continue'}
              </Text>
              {!flow.isLastStep && (
                <ChevronRight size={16} color={Theme.colors.primaryForeground} />
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </OverlayModal>
  );
};
