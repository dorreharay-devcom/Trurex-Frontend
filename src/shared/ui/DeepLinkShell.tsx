import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '~/shared/ui/shell/Header';
import { TabBar, TAB, type Tab } from '~/shared/ui/shell/TabBar';
import { toUserRoute } from '~/shared/config/routes';
import type { RecommendationOpenOptions } from '~/shared/types/recommendation';

type Props = {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  onRexPress: (rexId: string, options?: RecommendationOpenOptions) => void;
  children: React.ReactNode;
};

function DeepLinkShell({ currentTab, onTabChange, onRexPress, children }: Props) {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <Header
        searchQuery=""
        onSearchChange={() => {}}
        onProfilePress={() => onTabChange(TAB.profile)}
        onAddPress={() => {}}
        onUserPress={(userId) => router.replace(toUserRoute(userId))}
        onRexPress={onRexPress}
        showSearch={false}
      />
      <TabBar currentTab={currentTab} onTabChange={onTabChange} />
      {children}
    </View>
  );
}

export default DeepLinkShell;
