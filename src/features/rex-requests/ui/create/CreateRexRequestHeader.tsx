import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ArrowLeft, X } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import CreateRexRequestStepper from '~/features/rex-requests/ui/create/CreateRexRequestStepper';

type Props = {
  isFirstStep: boolean;
  isEditMode: boolean;
  currentIndex: number;
  onBack: () => void;
  onCancel: () => void;
};

const CreateRexRequestHeader = ({
  isFirstStep,
  isEditMode,
  currentIndex,
  onBack,
  onCancel,
}: Props) => {
  return (
    <View className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur px-4 py-4 sm:px-6">
      <View className="flex-row items-center">
        <View className="w-[72px] items-start justify-center">
          <Pressable
            onPress={isFirstStep ? onCancel : onBack}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={isFirstStep ? 'Cancel' : 'Back'}
            className="flex-row items-center gap-1.5 rounded-lg py-0.5 active:opacity-80"
          >
            <ArrowLeft size={20} color={Theme.colors.secondaryText} />
            <Text className="text-sm font-medium text-foreground">
              {isFirstStep ? 'Cancel' : 'Back'}
            </Text>
          </Pressable>
        </View>
        <Text className="min-w-0 flex-1 text-center text-lg font-display font-semibold text-foreground">
          {isEditMode ? 'Edit Rex Request' : 'New Rex Request'}
        </Text>
        <View className="w-[72px] items-end justify-center">
          {!isFirstStep ? (
            <Pressable
              onPress={onCancel}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              className="rounded-lg p-0.5 active:opacity-80"
            >
              <X size={22} color={Theme.colors.secondaryText} strokeWidth={2.25} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <CreateRexRequestStepper currentIndex={currentIndex} />
    </View>
  );
};

export default CreateRexRequestHeader;
