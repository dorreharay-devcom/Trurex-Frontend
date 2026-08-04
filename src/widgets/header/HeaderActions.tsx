import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { PlusCircle } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import NotificationBell from '~/widgets/NotificationBell';
import { SignedUserAvatar } from '~/shared/ui/SignedUserAvatar';
import { cn } from '~/shared/lib/ui/styles';
import type { RecommendationOpenOptions } from '~/shared/types/recommendation';

const REX_ICON = require('@assets/truRexIcon.png');

type Props = {
  compact: boolean;
  profileActive?: boolean;
  profileName: string;
  avatarPath: string | null;
  avatarRefreshKey: number;
  onAddPress?: () => void;
  onProfilePress: () => void;
  onUserPress?: (userId: string) => void;
  onRexPress?: (rexId: string, options?: RecommendationOpenOptions) => void;
};

const HeaderActions = ({
  compact,
  profileActive,
  profileName,
  avatarPath,
  avatarRefreshKey,
  onAddPress,
  onProfilePress,
  onUserPress,
  onRexPress,
}: Props) => (
  <View
    className={cn(
      'shrink-0 flex-row items-center',
      compact ? 'justify-end gap-1' : 'gap-1 sm:gap-2',
    )}
  >
    {onAddPress ? (
      <TouchableOpacity
        onPress={onAddPress}
        accessibilityRole="button"
        accessibilityLabel="Add Rex"
        className={
          compact
            ? 'rounded-lg p-2 active:opacity-80'
            : 'flex-row items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 active:opacity-90'
        }
      >
        <PlusCircle
          size={compact ? 22 : 16}
          color={compact ? Theme.colors.accentForeground : Theme.colors.primaryForeground}
        />
        {compact ? null : (
          <Image
            source={REX_ICON}
            style={{ width: 18, height: 18, borderRadius: 4 }}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        )}
      </TouchableOpacity>
    ) : null}

    <NotificationBell onUserPress={onUserPress} onRexPress={onRexPress} />

    <TouchableOpacity
      onPress={onProfilePress}
      accessibilityRole="button"
      accessibilityLabel="Profile"
      className="items-center justify-center"
    >
      <SignedUserAvatar
        name={profileName}
        avatar={avatarPath}
        cacheVersion={avatarRefreshKey}
        className={profileActive ? 'border-primary' : undefined}
      />
    </TouchableOpacity>
  </View>
);

export default HeaderActions;
