import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  disabled: boolean;
  onPress: () => void;
};

const CreateCircleTrigger = ({ disabled, onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="flex-row items-center gap-3 rounded-xl border border-dashed border-border bg-background p-4 active:opacity-90"
    >
      <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
        <Plus size={18} color={Theme.colors.primaryForeground} />
      </View>
      <Text className="text-sm font-medium text-foreground">Create new circle</Text>
    </Pressable>
  );
};

export default CreateCircleTrigger;
