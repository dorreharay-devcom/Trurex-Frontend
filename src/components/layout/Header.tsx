import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Platform,
  type TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, PlusCircle, UserCircle2 } from 'lucide-react-native';
import { useAuth } from '~/services/AuthContext';
import { ProfileApi } from '~/api/ProfileApi';
import { Theme, textFieldCaretStyle } from '~/theme/Theme';
import { isWeb } from '~/utils';
import { NotificationBell } from '~/components/layout/NotificationBell';
import { useSignedStorageUrl } from '~/hooks/useSignedStorageUrl';
import { USER_AVATARS_BUCKET } from '~/constants/storageBuckets';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onProfilePress: () => void;
  onAddPress: () => void;
  onUserPress?: (userId: string) => void;
  isProfileActive?: boolean;
  avatarRefreshKey?: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onProfilePress,
  onAddPress,
  onUserPress,
  isProfileActive,
  avatarRefreshKey = 0,
}) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const isMobile = !isWeb || width < 640;
  const topPad = Platform.OS === 'web' ? 12 : insets.top;

  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const { uri: avatarUri } = useSignedStorageUrl(USER_AVATARS_BUCKET, avatarPath ?? '');

  useEffect(() => {
    if (!user?.id) return;
    ProfileApi.getProfile({ userId: user.id })
      .then((p) => setAvatarPath(p.avatarUrl ?? null))
      .catch(() => {});
  }, [user?.id, avatarRefreshKey]);

  return (
    <View className="w-full border-b border-border bg-card" style={{ paddingTop: topPad }}>
      <View className="w-full flex-row items-center justify-between px-4 pb-2 sm:px-6 lg:px-8">
        <Image
          source={require('../../../assets/truRexLogo.png')}
          style={{ width: 80, height: 28, resizeMode: 'contain' }}
          accessibilityIgnoresInvertColors
        />

        <View className="mx-4 min-w-0 max-w-md flex-1 sm:mx-8">
          <View className="relative w-full min-w-0 justify-center">
            <View className="pointer-events-none absolute left-3 top-0 bottom-0 z-10 justify-center">
              <Search size={16} color={Theme.colors.secondaryText} />
            </View>
            <TextInput
              value={searchQuery}
              onChangeText={onSearchChange}
              placeholder="Search recommendations..."
              placeholderTextColor={Theme.colors.secondaryText}
              className="header-search-input w-full min-w-0 shrink rounded-lg border border-border py-1.5 pl-9 pr-4 text-sm text-foreground focus:outline-none focus:ring-2"
              style={[
                textFieldCaretStyle,
                { backgroundColor: Theme.colors.searchFieldBackground },
                Platform.OS === 'web'
                  ? ({
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    } as TextStyle)
                  : null,
              ]}
              selectionColor={Theme.colors.foreground}
              returnKeyType="search"
              underlineColorAndroid="transparent"
              multiline={false}
              numberOfLines={1}
            />
          </View>
        </View>

        <View className="shrink-0 flex-row items-center gap-1 sm:gap-2">
          {isMobile ? (
            <TouchableOpacity
              onPress={onAddPress}
              className="flex-row items-center gap-1 rounded-lg p-2 active:opacity-80"
              accessibilityRole="button"
              accessibilityLabel="Add Rex"
            >
              <PlusCircle size={22} color={Theme.colors.primary} />
              <Image
                source={require('../../../assets/truRexIcon.png')}
                style={{ width: 20, height: 20, borderRadius: 4 }}
                resizeMode="contain"
                accessibilityIgnoresInvertColors
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={onAddPress}
              className="flex-row items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 active:opacity-90"
              accessibilityRole="button"
              accessibilityLabel="Add Rex"
            >
              <PlusCircle size={16} color={Theme.colors.primaryForeground} />
              <Image
                source={require('../../../assets/truRexIcon.png')}
                style={{ width: 18, height: 18, borderRadius: 4 }}
                resizeMode="contain"
                accessibilityIgnoresInvertColors
              />
            </TouchableOpacity>
          )}

          <NotificationBell onUserPress={onUserPress} />

          <TouchableOpacity
            onPress={onProfilePress}
            className={`h-9 w-9 items-center justify-center rounded-full border-2 overflow-hidden ${
              isProfileActive ? 'border-primary' : 'border-border'
            }`}
            accessibilityRole="button"
            accessibilityLabel="Profile"
          >
            {avatarUri ? (
              <Image
                source={{ uri: avatarUri }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <UserCircle2 size={20} color={Theme.colors.secondaryText} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
