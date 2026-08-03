import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { cn } from '~/shared/lib/ui/styles';

type Props = {
  canSave: boolean;
  saving: boolean;
  onPress: () => void;
};

function SaveChangesButton({ canSave, saving, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!canSave}
      className={cn('w-full py-3 rounded-xl bg-primary items-center', !canSave && 'opacity-50')}
    >
      <Text className="text-primary-foreground font-semibold text-sm">
        {saving ? 'Saving…' : 'Save Changes'}
      </Text>
    </TouchableOpacity>
  );
}

export default SaveChangesButton;
