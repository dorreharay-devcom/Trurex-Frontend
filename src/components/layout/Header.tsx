import React from 'react';
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
import { Theme, textFieldCaretStyle } from '~/theme/Theme';
import { isWeb } from '~/utils';
import { NotificationBell } from '~/components/layout/NotificationBell';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onProfilePress: () => void;
  onAddPress: () => void;
  isProfileActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onProfilePress,
  onAddPress,
  isProfileActive,
}) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = !isWeb || width < 640;

  const topPad = Platform.OS === 'web' ? 12 : insets.top;

  return (
    <View
      className="border-b border-border bg-card/95 backdrop-blur-md"
      style={{ paddingTop: topPad }}
    >
      <View
        className={`flex-row items-center gap-3 pl-0 pr-4 pb-3 sm:pr-6 ${isWeb ? 'max-w-[1280px] w-full self-center' : ''}`}
      >
        <Image
          source={require('../../../assets/truRexLogo.png')}
          style={{ width: 80, height: 28, resizeMode: 'contain' }}
          accessibilityIgnoresInvertColors
        />

        <View className="min-w-0 flex-1 flex-row items-center">
          <View className="relative w-full justify-center">
            <View className="pointer-events-none absolute left-3.5 top-0 bottom-0 z-10 justify-center">
              <Search size={18} color={Theme.colors.secondaryText} />
            </View>
            <TextInput
              value={searchQuery}
              onChangeText={onSearchChange}
              placeholder="Search recommendations..."
              placeholderTextColor={Theme.colors.muted}
              className="w-full rounded-xl border border-border bg-muted/50 py-2.5 pl-10 pr-3.5 text-sm text-foreground focus:outline-none focus:border-primary"
              style={textFieldCaretStyle}
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
          <NotificationBell />
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
            className={`h-9 w-9 items-center justify-center rounded-full border-2 ${
              isProfileActive ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'
            }`}
            accessibilityRole="button"
            accessibilityLabel="Profile"
          >
            <UserCircle2 size={20} color={Theme.colors.secondaryText} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
