import React from 'react';
import { Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  label: string;
  onPress?: () => void;
};

const ProfileChevronButton = ({ label, onPress }: Props) => {
  if (!onPress) return null;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View ${label}'s profile`}
      hitSlop={8}
      className="justify-center rounded-lg p-0.5 active:opacity-70"
    >
      <ChevronRight size={16} color={Theme.colors.secondaryText} />
    </Pressable>
  );
};

export default ProfileChevronButton;
