import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { Button } from '~/shared/ui/primitives/Button';

type Props = {
  onClose: () => void;
  onSave?: () => void;
  saving?: boolean;
  canSave?: boolean;
};

function EditBusinessHeader({ onClose, onSave, saving = false, canSave = false }: Props) {
  return (
    <View className="flex-row items-center justify-between border-b border-border px-4 py-4">
      <View className="flex-row items-center gap-3">
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.7}
          className="rounded-lg p-1.5"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft size={20} color={Theme.colors.foreground} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-foreground">Business Profile</Text>
      </View>
      {onSave ? (
        <Button
          title="Save"
          onPress={onSave}
          loading={saving}
          disabled={!canSave}
          className="px-4 py-2"
        />
      ) : null}
    </View>
  );
}

export default EditBusinessHeader;
