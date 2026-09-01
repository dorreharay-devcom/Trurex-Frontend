import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { User } from '@supabase/supabase-js';
import { useAuth } from '~/features/auth/providers';
import { isWeb } from '~/shared/lib/ui/platform';
import { cn } from '~/shared/lib/ui/styles';
import type { RecommendationOpenOptions } from '~/shared/types/recommendation';
import HeaderActions from '~/widgets/header/HeaderActions';
import HeaderLogo from '~/widgets/header/HeaderLogo';
import { useHeaderAvatar } from '~/widgets/hooks/useHeaderAvatar';

type Props = {
  onProfilePress: () => void;
  onAddPress?: () => void;
  onUserPress?: (userId: string) => void;
  onRexPress?: (rexId: string, options?: RecommendationOpenOptions) => void;
  onRexRequestPress?: (requestId: string) => void;
  isProfileActive?: boolean;
};

const profileDisplayName = (user: User | null | undefined) => {
  if (typeof user?.user_metadata?.display_name === 'string') {
    return user.user_metadata.display_name;
  }
  return user?.email || 'You';
};

const headerTopPadding = (safeTop: number) => (isWeb ? 12 : safeTop + 6);
const COMPACT_MAX_WIDTH = 640;

const Header = ({
  onProfilePress,
  onAddPress,
  onUserPress,
  onRexPress,
  onRexRequestPress,
  isProfileActive,
}: Props) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const compact = !isWeb || width < COMPACT_MAX_WIDTH;
  const avatarPath = useHeaderAvatar(user?.id);

  return (
    <View
      className="w-full border-b border-border bg-card"
      style={{ paddingTop: headerTopPadding(insets.top) }}
    >
      <View
        className={cn(
          'w-full flex-row items-center justify-between pb-2',
          compact ? 'gap-1 pl-1 pr-2' : 'px-4 sm:px-6 lg:px-8',
        )}
      >
        {compact ? (
          <View className="w-20 items-center justify-center">
            <HeaderLogo />
          </View>
        ) : (
          <HeaderLogo />
        )}

        <HeaderActions
          compact={compact}
          profileActive={isProfileActive}
          profileName={profileDisplayName(user)}
          avatarPath={avatarPath}
          onAddPress={onAddPress}
          onProfilePress={onProfilePress}
          onUserPress={onUserPress}
          onRexPress={onRexPress}
          onRexRequestPress={onRexRequestPress}
        />
      </View>
    </View>
  );
};

export default Header;
