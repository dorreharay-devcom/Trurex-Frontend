import React from 'react';
import { Text, View } from 'react-native';
import { UserX } from 'lucide-react-native';
import ProfileBackButton from '~/features/profile/ui/ProfileBackButton';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  onBack?: () => void;
};

const ProfileNotFound = ({ onBack }: Props) => (
  <View className="flex-1 items-center justify-center gap-3 px-8">
    {onBack ? <ProfileBackButton onPress={onBack} className="absolute left-4 top-4" /> : null}
    <UserX size={48} color={Theme.colors.secondaryText} />
    <Text className="text-lg font-semibold text-foreground">User not found</Text>
    <Text className="text-center text-sm text-muted-foreground">
      This profile doesn't exist or may have been removed.
    </Text>
  </View>
);

export default ProfileNotFound;
