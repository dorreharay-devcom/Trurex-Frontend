import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '~/widgets/Header';
import TabBar from '~/widgets/TabBar';
import { TAB, type Tab } from '~/shared/config/mainTabs';
import { toUserRoute } from '~/shared/config/routes';
import type { RecommendationOpenOptions } from '~/shared/types/recommendation';

type Props = {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  onRexPress: (rexId: string, options?: RecommendationOpenOptions) => void;
  children: React.ReactNode;
};

const DeepLinkShell = ({ currentTab, onTabChange, onRexPress, children }: Props) => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <Header
        onProfilePress={() => onTabChange(TAB.profile)}
        onUserPress={(userId) => router.replace(toUserRoute(userId))}
        onRexPress={onRexPress}
      />
      <TabBar currentTab={currentTab} onTabChange={onTabChange} />
      {children}
    </View>
  );
};

export default DeepLinkShell;
