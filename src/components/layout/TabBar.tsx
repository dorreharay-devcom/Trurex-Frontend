import React from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Sparkles, Gem, Orbit, MapPinned, UserCircle2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '~/theme/Theme';
import { isWeb } from '~/utils';

export type Tab = 'discover' | 'faves' | 'circles' | 'map' | 'profile';

export const NAV_ITEMS: {
  id: Tab;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
}[] = [
  { id: 'discover', label: 'Discover', icon: Sparkles },
  { id: 'faves', label: 'Gems', icon: Gem },
  { id: 'circles', label: 'Circles', icon: Orbit },
  { id: 'map', label: 'Map', icon: MapPinned },
  { id: 'profile', label: 'Profile', icon: UserCircle2 },
];

interface TabBarProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ currentTab, onTabChange }) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isDesktop = isWeb && width >= 640;

  if (isDesktop) {
    return (
      <View className="bg-card border-b border-border">
        <View className="max-w-[1280px] w-full self-center flex-row px-4">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = currentTab === id;
            return (
              <TouchableOpacity
                key={id}
                onPress={() => onTabChange(id)}
                className={`flex-row items-center gap-2 px-5 py-3 border-b-2 ${active ? 'border-primary' : 'border-transparent'}`}
              >
                <Icon size={16} color={active ? Theme.colors.foreground : Theme.colors.muted} />
                <Text className={`text-sm ${active ? 'font-medium text-foreground' : 'text-muted'}`}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <View className="bg-card border-b border-border">
      <View className="flex-row" style={{ paddingTop: insets.top }}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = currentTab === id;
          return (
            <TouchableOpacity
              key={id}
              onPress={() => onTabChange(id)}
              activeOpacity={0.7}
              className="flex-1 items-center justify-center pt-2 pb-2 gap-1"
            >
              <Icon size={20} color={active ? Theme.colors.primary : Theme.colors.muted} />
              <Text className={`text-[10px] font-semibold ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
