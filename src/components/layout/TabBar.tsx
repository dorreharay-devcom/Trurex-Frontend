import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { Sparkles, Gem, Orbit, MapPinned, UserCircle2 } from 'lucide-react-native';
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
  const isDesktop = isWeb && width >= 640;

  const renderItem = ({ id, label, icon: Icon }: (typeof NAV_ITEMS)[0]) => {
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
  };

  return (
    <View className="bg-card border-b border-border">
      {isDesktop ? (
        <View className="max-w-[1280px] w-full self-center flex-row px-4">
          {NAV_ITEMS.map(renderItem)}
        </View>
      ) : (
        <View className="flex-row justify-center">
          {NAV_ITEMS.map(renderItem)}
        </View>
      )}
    </View>
  );
};
