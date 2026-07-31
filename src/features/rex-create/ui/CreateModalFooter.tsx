import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { ChevronRight } from 'lucide-react-native';
import { CREATE_REC_MODAL_MAX_W } from '~/constants/recommendation/createLayout';
import { modalConfig } from '~/constants/recommendation/modalConfig';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/utils';
import { cn } from '~/utils/general';

const DYNO_IMAGE_SOURCE = require('@assets/dyno.svg');

type Props = {
  isLastStep: boolean;
  isEditMode: boolean;
  disabled: boolean;
  submitting: boolean;
  onPress: () => void;
};

function primaryLabel(isLastStep: boolean, isEditMode: boolean): string {
  if (!isLastStep) return 'Continue';
  return isEditMode ? 'Save Changes' : 'Confirm & Post';
}

function accessibilityLabel(isLastStep: boolean, isEditMode: boolean): string {
  if (!isLastStep) return 'Continue';
  return isEditMode ? 'Save Rex changes' : 'Confirm and post';
}

const CreateModalFooter = ({ isLastStep, isEditMode, disabled, submitting, onPress }: Props) => {
  return (
    <View className="sticky bottom-0 items-center border-t border-border bg-card/95 px-4 py-4 backdrop-blur sm:px-6">
      <View
        className="w-full"
        style={{
          maxWidth: CREATE_REC_MODAL_MAX_W,
          paddingBottom: modalConfig.layout.minSafeBottom,
        }}
      >
        <View className={cn('w-full', disabled && isWeb && 'cursor-not-allowed')}>
          <Pressable
            onPress={() => {
              if (disabled) return;
              onPress();
            }}
            disabled={disabled && !isWeb}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel(isLastStep, isEditMode)}
            accessibilityState={{ disabled }}
            className={cn(
              'flex h-12 w-full flex-row items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-xl px-4 py-2',
              isWeb &&
                'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
              disabled && isWeb && 'cursor-not-allowed bg-primary/40 opacity-50',
              disabled && !isWeb && 'bg-accent',
              !disabled && 'bg-primary',
              !disabled && isWeb && 'cursor-pointer active:bg-primary/90',
            )}
          >
            {submitting ? (
              <ActivityIndicator color={Theme.colors.primaryForeground} />
            ) : (
              <>
                <Text
                  pointerEvents="none"
                  className={cn(
                    'text-base font-semibold text-primary-foreground',
                    disabled && !isWeb && 'text-accent-foreground',
                  )}
                >
                  {primaryLabel(isLastStep, isEditMode)}
                </Text>
                {isLastStep ? (
                  <Image
                    source={DYNO_IMAGE_SOURCE}
                    style={{ width: 20, height: 20 }}
                    contentFit="contain"
                    accessibilityLabel="TruRex dinosaur"
                  />
                ) : null}
                {!isLastStep && (
                  <View pointerEvents="none">
                    <ChevronRight
                      size={16}
                      color={
                        disabled && !isWeb
                          ? Theme.colors.accentForeground
                          : Theme.colors.primaryForeground
                      }
                    />
                  </View>
                )}
              </>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default CreateModalFooter;
