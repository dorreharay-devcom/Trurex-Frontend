import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import { useCircleForm } from '~/features/circles/hooks/useCircleForm';
import { useCreateCircle } from '~/features/circles/hooks/useCreateCircle';
import CircleFormFields from '~/features/circles/ui/form/CircleFormFields';
import CircleSubmitButton from '~/features/circles/ui/form/CircleSubmitButton';
import { Theme } from '~/shared/theme/Theme';

type Props = { onClose: () => void };

const CreateCircleCard = ({ onClose }: Props) => {
  const form = useCircleForm();
  const create = useCreateCircle({
    onCreated: () => {
      form.reset();
      onClose();
    },
  });

  const submit = () => {
    if (!form.canSubmit || create.isPending) return;
    create.mutate({ name: form.name, description: form.description, color: form.color });
  };

  return (
    <View className="mb-6 rounded-xl border border-border bg-card p-4">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-foreground">Create a new circle</Text>
        <Pressable onPress={onClose} hitSlop={8} className="p-1 active:opacity-70">
          <X size={16} color={Theme.colors.muted} />
        </Pressable>
      </View>

      <CircleFormFields form={form} />

      <CircleSubmitButton
        label="Create Circle"
        disabled={!form.canSubmit || create.isPending}
        pending={create.isPending}
        onPress={submit}
        className="mt-4"
      />
    </View>
  );
};

export default CreateCircleCard;
