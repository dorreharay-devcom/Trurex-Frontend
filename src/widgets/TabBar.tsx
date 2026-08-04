import React from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Sparkles, Gem, Orbit, MapPinned, UserCircle2 } from 'lucide-react-native';
import { MAIN_CHROME_COMPACT_MAX_WIDTH } from '~/shared/config/chrome';
import { TAB, type Tab } from '~/shared/config/mainTabs';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/shared/lib/ui/platform';
import { cn } from '~/shared/lib/ui/styles';

const NAV_ITEMS: {
  id: Tab;
  label: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
}[] = [
  { id: TAB.discover, label: 'Discover', Icon: Sparkles },
  { id: TAB.faves, label: 'Gems', Icon: Gem },
  { id: TAB.circles, label: 'Circles', Icon: Orbit },
  { id: TAB.map, label: 'Map', Icon: MapPinned },
  { id: TAB.profile, label: 'Profile', Icon: UserCircle2 },
];

type Props = {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
};

const iconColor = (active: boolean, desktop: boolean) => {
  if (!active) return Theme.colors.muted;
  if (desktop) return Theme.colors.foreground;
  return Theme.colors.accentForeground;
};

const itemClassName = (active: boolean, desktop: boolean) => {
  if (!desktop) return 'flex-1 items-center justify-center gap-1 py-2';
  return cn(
    'flex-row items-center gap-2 border-b-2 px-5 py-3',
    active ? 'border-primary' : 'border-transparent',
  );
};

const labelClassName = (active: boolean, desktop: boolean) => {
  if (desktop) {
    return cn('text-sm', active ? 'font-medium text-foreground' : 'text-muted');
  }
  return cn(
    'text-[10px] font-semibold',
    active ? 'text-accent-foreground' : 'text-muted-foreground',
  );
};

const TabBar = ({ currentTab, onTabChange }: Props) => {
  const { width } = useWindowDimensions();
  const desktop = isWeb && width >= MAIN_CHROME_COMPACT_MAX_WIDTH;

  return (
    <View className="border-b border-border bg-card">
      <View className={cn('flex-row', desktop && 'w-full px-4 sm:px-6 lg:px-8')}>
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = currentTab === id;
          return (
            <TouchableOpacity
              key={id}
              onPress={() => onTabChange(id)}
              activeOpacity={0.7}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              className={itemClassName(active, desktop)}
            >
              <Icon size={desktop ? 16 : 20} color={iconColor(active, desktop)} />
              <Text className={labelClassName(active, desktop)}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default TabBar;
