import React, { useCallback } from 'react';
import { View, Text, Pressable, Alert, useWindowDimensions } from 'react-native';
import * as Location from 'expo-location';
import { ChevronRight } from 'lucide-react-native';
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

  const { sheetTranslateY, entering, exiting, handleClose } =
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
        <View className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
          <View className="flex-row h-12 items-center bg-transparent px-4">
            <Pressable
              onPress={flow.stepIndex === 0 ? handleClose : flow.goBack}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={flow.stepIndex === 0 ? 'Cancel' : 'Back'}
              className="rounded-lg px-1 py-0.5 -ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              <View className="flex-row items-center">
                <Text className="text-sm text-foreground" style={{ color: Theme.colors.black }}>
                  ←{' '}
                </Text>
                <Text
                  className="text-sm font-normal text-foreground"
                  style={{ color: Theme.colors.black }}
                >
                  {flow.stepIndex === 0 ? 'Cancel' : 'Back'}
                </Text>
              </View>
            </Pressable>
          </View>

          <CreateWizardStepper currentIndex={flow.stepIndex} />
        </View>

        <CreateModalBody
          flow={flow}
          entering={entering}
          exiting={exiting}
          onTagLocation={handleTagLocation}
        />

        <View className="items-center border-t border-border bg-card/95 backdrop-blur-md">
          <View
            className="w-full px-4 py-4 sm:px-6"
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
              className="inline-flex w-full h-12 flex-row items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-4 py-2 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:bg-primary/90 hover:bg-primary/90 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
            >
              <Text className="text-base font-normal text-primary-foreground">
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
