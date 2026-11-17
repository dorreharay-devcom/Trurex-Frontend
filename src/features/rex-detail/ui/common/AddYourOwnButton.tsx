import React from 'react';
import { Plus } from 'lucide-react-native';
import PrimaryActionButton from '~/shared/ui/primitives/PrimaryActionButton';

function AddYourOwnButton({ onPress }: { onPress: () => void }) {
  return (
    <PrimaryActionButton icon={Plus} label="Add your own rec for this place" onPress={onPress} />
  );
}

export default AddYourOwnButton;
