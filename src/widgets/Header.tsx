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
import HeaderSearch from '~/widgets/header/HeaderSearch';
import { useHeaderAvatar } from '~/widgets/hooks/useHeaderAvatar';

type Props = {
  onProfilePress: () => void;
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
  onAddPress?: () => void;
  onUserPress?: (userId: string) => void;
  onRexPress?: (rexId: string, options?: RecommendationOpenOptions) => void;
  isProfileActive?: boolean;
  avatarRefreshKey?: number;
  showSearch?: boolean;
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
  searchQuery = '',
  onSearchChange,
  onProfilePress,
  onAddPress,
  onUserPress,
  onRexPress,
  isProfileActive,
  avatarRefreshKey = 0,
  showSearch = true,
}: Props) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const compact = !isWeb || width < COMPACT_MAX_WIDTH;
  const avatarPath = useHeaderAvatar(user?.id, avatarRefreshKey);
  const searchVisible = showSearch && !!onSearchChange;

  return (
    <View
      className="w-full border-b border-border bg-card"
      style={{ paddingTop: headerTopPadding(insets.top) }}
    >
      <View
        className={cn(
          'w-full flex-row items-center pb-2',
          compact ? 'gap-1 pl-1 pr-2' : 'justify-between px-4 sm:px-6 lg:px-8',
        )}
      >
        {compact ? (
          <View className="w-20 items-center justify-center">
            <HeaderLogo />
          </View>
        ) : (
          <HeaderLogo />
        )}

        <View className={cn('min-w-0 flex-1', compact ? 'px-1' : 'mx-4 max-w-md sm:mx-8')}>
          {searchVisible ? (
            <HeaderSearch value={searchQuery} onChangeText={onSearchChange} />
          ) : null}
        </View>

        <HeaderActions
          compact={compact}
          profileActive={isProfileActive}
          profileName={profileDisplayName(user)}
          avatarPath={avatarPath}
          avatarRefreshKey={avatarRefreshKey}
          onAddPress={onAddPress}
          onProfilePress={onProfilePress}
          onUserPress={onUserPress}
          onRexPress={onRexPress}
        />
      </View>
    </View>
  );
};

export default Header;
