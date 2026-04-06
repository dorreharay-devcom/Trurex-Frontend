import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { LayoutGrid, Sparkles, Bookmark, UsersRound, MapPinned, UserCircle2 } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';
import { isWeb } from '~/utils';

export type Tab = 'feed' | 'discover' | 'faves' | 'network' | 'map' | 'profile';

export const NAV_ITEMS: { id: Tab; label: string; icon: React.ComponentType<{ size: number; color: string }> }[] = [
  { id: 'feed', label: 'Feed', icon: LayoutGrid },
  { id: 'discover', label: 'Discover', icon: Sparkles },
  { id: 'faves', label: 'My Faves', icon: Bookmark },
  { id: 'network', label: 'Network', icon: UsersRound },
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

  const renderItem = ({ id, label, icon: Icon }: typeof NAV_ITEMS[0]) => {
    const active = currentTab === id;
    return (
      <TouchableOpacity
        key={id}
        onPress={() => onTabChange(id)}
        className={`flex-row items-center gap-2 pr-6 py-3 border-b-2 ${active ? 'border-primary' : 'border-transparent'}`}
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="pl-4">
          <View className="flex-row">
            {NAV_ITEMS.map(renderItem)}
          </View>
        </ScrollView>
      )}
    </View>
  );
};
