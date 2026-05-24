import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PlusCircle, UserCircle2 } from 'lucide-react-native';
import { useAuth } from '~/services/AuthContext';
import { ProfileApi } from '~/api/ProfileApi';
import {
  Theme,
  textFieldCaretStyle,
  textFieldHeaderSearchStyle,
  textFieldSingleLineCompactHeightStyle,
  textFieldSingleLineStyle,
} from '~/theme/Theme';
import { isWeb } from '~/utils';
import { NotificationBell } from '~/components/layout/NotificationBell';
import { useSignedStorageUrl } from '~/hooks/useSignedStorageUrl';
import { USER_AVATARS_BUCKET } from '~/constants/storageBuckets';
import { INPUT_FOCUS_RING_CLASS } from '~/constants/inputFocus';
import { ClearableSearchInput } from '~/components/common/ClearableSearchInput';

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
  const searchInputRef = useRef<TextInput>(null);

  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const { uri: avatarUri } = useSignedStorageUrl(
    USER_AVATARS_BUCKET,
    avatarPath ?? '',
    3600,
    avatarRefreshKey,
  );

  useEffect(() => {
    if (!user?.id) return;
    ProfileApi.getProfile({ userId: user.id })
      .then((p) => setAvatarPath(p.avatarUrl ?? null))
      .catch(() => {});
  }, [user?.id, avatarRefreshKey]);

  return (
    <View className="w-full border-b border-border bg-card" style={{ paddingTop: topPad }}>
      {isMobile ? (
        <View className="w-full flex-row items-center pb-2">
          <View className="items-center justify-center" style={{ width: '20%' }}>
            <Image
              source={require('../../../assets/truRexLogo.png')}
              style={{ width: 80, height: 28, resizeMode: 'contain' }}
              accessibilityIgnoresInvertColors
            />
          </View>

          <View className="min-w-0 px-1" style={{ width: '40%' }}>
            <ClearableSearchInput
              ref={searchInputRef}
              value={searchQuery}
              onChangeText={onSearchChange}
              placeholder="Search rex..."
              placeholderTextColor={Theme.colors.secondaryText}
              containerClassName="min-w-0 justify-center"
              iconColor={Theme.colors.secondaryText}
              clearIconColor={Theme.colors.secondaryText}
              inputClassName={`header-search-input w-full min-w-0 shrink rounded-lg border border-border py-1.5 pl-9 pr-9 text-sm text-foreground ${INPUT_FOCUS_RING_CLASS}`}
              inputStyle={[
                textFieldCaretStyle,
                { backgroundColor: Theme.colors.searchFieldBackground },
                textFieldSingleLineStyle,
                textFieldSingleLineCompactHeightStyle,
                textFieldHeaderSearchStyle,
              ]}
              selectionColor={Theme.colors.foreground}
              underlineColorAndroid="transparent"
              multiline={false}
              numberOfLines={1}
              scrollEnabled={false}
            />
          </View>

          <View className="flex-row items-center justify-end gap-1" style={{ width: '26%' }}>
            <TouchableOpacity
              onPress={onAddPress}
              className="flex-row items-center gap-1 rounded-lg p-2 active:opacity-80"
              accessibilityRole="button"
              accessibilityLabel="Add Rex"
            >
              <PlusCircle size={22} color={Theme.colors.accentForeground} />
            </TouchableOpacity>
            <NotificationBell onUserPress={onUserPress} />
          </View>

          <View className="items-center justify-center" style={{ width: '14%' }}>
            <TouchableOpacity
              onPress={onProfilePress}
              className={`h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 ${
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
      ) : (
        <View className="w-full flex-row items-center justify-between px-4 pb-2 sm:px-6 lg:px-8">
          <Image
            source={require('../../../assets/truRexLogo.png')}
            style={{ width: 80, height: 28, resizeMode: 'contain' }}
            accessibilityIgnoresInvertColors
          />

          <View className="mx-4 min-w-0 max-w-md flex-1 sm:mx-8">
            <ClearableSearchInput
              ref={searchInputRef}
              value={searchQuery}
              onChangeText={onSearchChange}
              placeholder="Search rex..."
              placeholderTextColor={Theme.colors.secondaryText}
              containerClassName="min-w-0 justify-center"
              iconColor={Theme.colors.secondaryText}
              clearIconColor={Theme.colors.secondaryText}
              inputClassName={`header-search-input w-full min-w-0 shrink rounded-lg border border-border py-1.5 pl-9 pr-9 text-sm text-foreground ${INPUT_FOCUS_RING_CLASS}`}
              inputStyle={[
                textFieldCaretStyle,
                { backgroundColor: Theme.colors.searchFieldBackground },
                textFieldSingleLineStyle,
                textFieldSingleLineCompactHeightStyle,
                textFieldHeaderSearchStyle,
              ]}
              selectionColor={Theme.colors.foreground}
              underlineColorAndroid="transparent"
              multiline={false}
              numberOfLines={1}
              scrollEnabled={false}
            />
          </View>

          <View className="shrink-0 flex-row items-center gap-1 sm:gap-2">
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

            <NotificationBell onUserPress={onUserPress} />

            <TouchableOpacity
              onPress={onProfilePress}
              className={`h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 ${
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
      )}
    </View>
  );
};
