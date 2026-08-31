import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { ChevronRight } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/shared/lib/ui/platform';
import { cn } from '~/shared/lib/ui/styles';

const DYNO_IMAGE_SOURCE = require('@assets/dyno.svg');

type Props = {
  isLastStep: boolean;
  isEditMode: boolean;
  disabled: boolean;
  submitting: boolean;
  onPress: () => void;
};

const CreateRexRequestFooter = ({
  isLastStep,
  isEditMode,
  disabled,
  submitting,
  onPress,
}: Props) => {
  return (
    <View className="sticky bottom-0 items-center border-t border-border bg-card/95 px-4 py-4 backdrop-blur sm:px-6">
      <View className="w-full" style={{ maxWidth: 512 }}>
        <Pressable
          onPress={() => {
            if (disabled) return;
            onPress();
          }}
          disabled={disabled && !isWeb}
          accessibilityRole="button"
          accessibilityLabel={
            isLastStep ? (isEditMode ? 'Save changes' : 'Confirm and post') : 'Continue'
          }
          accessibilityState={{ disabled }}
          className={cn(
            'flex h-12 w-full flex-row items-center justify-center gap-2 rounded-xl px-4 py-2',
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
                className={cn(
                  'text-base font-semibold text-primary-foreground',
                  disabled && !isWeb && 'text-accent-foreground',
                )}
              >
                {isLastStep ? (isEditMode ? 'Save Changes' : 'Confirm & Post') : 'Continue'}
              </Text>
              {isLastStep ? (
                <Image
                  source={DYNO_IMAGE_SOURCE}
                  style={{ width: 20, height: 20 }}
                  contentFit="contain"
                  accessibilityLabel="TruRex dinosaur"
                />
              ) : (
                <ChevronRight
                  size={16}
                  color={
                    disabled && !isWeb
                      ? Theme.colors.accentForeground
                      : Theme.colors.primaryForeground
                  }
                />
              )}
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default CreateRexRequestFooter;
