import React from 'react';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import type { EditCircleState } from '~/features/circles/hooks/detail/useEditCircle';
import CircleFormFields from '~/features/circles/ui/form/CircleFormFields';
import { Theme } from '~/shared/theme/Theme';
import { ModalToastLayer } from '~/shared/ui/toast/ModalToastLayer';
import { cn } from '~/utils/general';

type Props = { edit: EditCircleState };

const EditCircleModal = ({ edit }: Props) => {
  const saveDisabled = !edit.form.canSubmit || edit.saving;

  return (
    <Modal visible={edit.open} transparent animationType="fade" onRequestClose={edit.close}>
      <View className="flex-1 justify-center bg-black/50 px-4">
        <View className="w-full max-w-md self-center rounded-xl border border-border bg-card p-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-base font-semibold text-foreground">Edit circle</Text>
            <Pressable onPress={edit.close} hitSlop={8} className="p-1 active:opacity-70">
              <X size={20} color={Theme.colors.muted} />
            </Pressable>
          </View>

          <CircleFormFields form={edit.form} />

          <View className="mt-4 flex-row gap-2">
            <Pressable
              onPress={edit.close}
              className="flex-1 items-center rounded-xl border border-border py-3 active:opacity-90"
            >
              <Text className="text-sm font-medium text-foreground">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={edit.save}
              disabled={saveDisabled}
              className={cn(
                'flex-1 items-center rounded-xl py-3',
                saveDisabled ? 'bg-primary/40' : 'bg-primary',
              )}
            >
              {edit.saving ? (
                <ActivityIndicator color={Theme.colors.primaryForeground} />
              ) : (
                <Text className="text-sm font-semibold text-primary-foreground">Save</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
      <ModalToastLayer />
    </Modal>
  );
};

export default EditCircleModal;
