import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, PlusCircle, LogOut, UserCircle2 } from 'lucide-react-native';
import { Auth } from '~/services/AuthService';
import { useAuth } from '~/services/AuthContext';
import { ProfileApi } from '~/api/ProfileApi';
import { Theme, textFieldCaretStyle } from '~/theme/Theme';
import { isWeb } from '~/utils';
import { NotificationBell } from '~/components/layout/NotificationBell';
import { useSignedStorageUrl } from '~/hooks/useSignedStorageUrl';
import { USER_AVATARS_BUCKET } from '~/constants/storageBuckets';

const HEADER_SEARCH_FIELD_BG = 'hsl(0, 0%, 86%)';

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
    <View className="border-b border-border bg-card" style={{ paddingTop: topPad }}>
      <View
        className={`flex-row items-center justify-between pl-0 pr-4 pb-2 sm:pr-6 ${isWeb ? 'max-w-[1280px] w-full self-center' : ''}`}
      >
        <Image
          source={require('../../../assets/truRexLogo.png')}
          style={{ width: 80, height: 28, resizeMode: 'contain' }}
          accessibilityIgnoresInvertColors
        />

        <View className="flex-1 max-w-md mx-4 sm:mx-8">
          <View className="relative w-full justify-center">
            <View className="pointer-events-none absolute left-3 top-0 bottom-0 z-10 justify-center">
              <Search size={16} color={Theme.colors.secondaryText} />
            </View>
            <TextInput
              value={searchQuery}
              onChangeText={onSearchChange}
              placeholder="Search recommendations..."
              placeholderTextColor={Theme.colors.foreground}
              className="w-full rounded-lg border border-border py-1.5 pl-9 pr-4 text-sm text-foreground focus:outline-none focus:ring-2"
              style={[textFieldCaretStyle, { backgroundColor: HEADER_SEARCH_FIELD_BG }]}
              selectionColor={Theme.colors.foreground}
              returnKeyType="search"
              underlineColorAndroid="transparent"
            />
          </View>
        </View>

        <View className="shrink-0 flex-row items-center gap-1 sm:gap-2">
          {isMobile ? (
            <TouchableOpacity
              onPress={onAddPress}
              className="rounded-lg p-2 active:opacity-80"
              accessibilityRole="button"
              accessibilityLabel="Add Rex"
            >
              <PlusCircle size={22} color={Theme.colors.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={onAddPress}
              className="flex-row items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 active:opacity-90"
              accessibilityRole="button"
              accessibilityLabel="Add Rex"
            >
              <PlusCircle size={16} color={Theme.colors.primaryForeground} />
              <Text className="text-sm font-medium text-primary-foreground">Add Rex</Text>
            </TouchableOpacity>
          )}

          <NotificationBell onUserPress={onUserPress} />

          <TouchableOpacity
            onPress={() => Auth.signOut()}
            className="rounded-lg p-2 active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel="Sign out"
          >
            <LogOut size={20} color={Theme.colors.secondaryText} strokeWidth={2} />
          </TouchableOpacity>

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
