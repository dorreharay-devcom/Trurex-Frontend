import React from 'react';
import { TouchableOpacity } from 'react-native';
import { PlusCircle } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  visible: boolean;
  onPress: () => void;
};

function AddRexFab({ visible, onPress }: Props) {
  if (!visible) return null;

  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Add Rex"
      className="absolute bottom-6 w-14 h-14 rounded-full bg-primary items-center justify-center hover:opacity-90 active:opacity-75 cursor-pointer"
      style={{
        right: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }}
    >
      <PlusCircle size={28} color={Theme.colors.primaryForeground} />
    </TouchableOpacity>
  );
}

export default AddRexFab;
