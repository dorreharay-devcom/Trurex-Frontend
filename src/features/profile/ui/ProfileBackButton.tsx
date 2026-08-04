import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { cn } from '~/shared/lib/ui/styles';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  onPress: () => void;
  className?: string;
};

const ProfileBackButton = ({ onPress, className }: Props) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    accessibilityRole="button"
    accessibilityLabel="Back"
    className={cn('flex-row items-center gap-1 self-start', className)}
  >
    <ChevronLeft size={20} color={Theme.colors.foreground} />
    <Text className="text-sm font-medium text-foreground">Back</Text>
  </TouchableOpacity>
);

export default ProfileBackButton;
