import React from 'react';
import { View } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import ProfileBackButton from '~/features/profile/ui/ProfileBackButton';
import QueryErrorState from '~/shared/ui/query/QueryErrorState';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  onBack?: () => void;
  onRetry: () => void;
};

const ProfileLoadError = ({ onBack, onRetry }: Props) => (
  <View className="flex-1 items-center justify-center px-8">
    {onBack ? <ProfileBackButton onPress={onBack} className="absolute left-4 top-4" /> : null}
    <WifiOff size={40} color={Theme.colors.secondaryText} />
    <QueryErrorState title="Couldn't load profile" onRetry={onRetry} />
  </View>
);

export default ProfileLoadError;
