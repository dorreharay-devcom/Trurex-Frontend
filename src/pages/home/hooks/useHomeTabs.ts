import { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { isTab, TAB, type Tab } from '~/shared/ui/shell/TabBar';
import { useAuth } from '~/features/auth/providers';
import { getStoredWebTab, storeWebTab } from '~/pages/home/lib/webTabStorage';

type ProfileBackTarget = {
  tab: Tab;
  userId?: string;
};

export function useHomeTabs() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const { user: authUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<Tab>(() =>
    isTab(tab) ? tab : (getStoredWebTab() ?? TAB.discover),
  );
  const [viewingUserId, setViewingUserId] = useState<string | undefined>(undefined);
  const [profileBackStack, setProfileBackStack] = useState<ProfileBackTarget[]>([]);

  useEffect(() => {
    storeWebTab(currentTab);
  }, [currentTab]);

  const changeTab = useCallback((nextTab: Tab) => {
    setProfileBackStack([]);
    if (nextTab === TAB.profile) setViewingUserId(undefined);
    setCurrentTab(nextTab);
  }, []);

  const openUserProfile = useCallback(
    (userId: string) => {
      const currentProfileUserId =
        currentTab === TAB.profile ? (viewingUserId ?? authUser?.id) : null;
      if (currentProfileUserId === userId) {
        setCurrentTab(TAB.profile);
        return;
      }
      setProfileBackStack((stack) => [
        ...stack,
        {
          tab: currentTab,
          userId: currentTab === TAB.profile ? viewingUserId : undefined,
        },
      ]);
      setViewingUserId(userId);
      setCurrentTab(TAB.profile);
    },
    [authUser?.id, currentTab, viewingUserId],
  );

  const goBackFromProfile = useCallback(() => {
    const target = profileBackStack[profileBackStack.length - 1];
    setProfileBackStack((stack) => stack.slice(0, -1));

    if (!target) {
      setViewingUserId(undefined);
      setCurrentTab(TAB.discover);
      return;
    }

    setViewingUserId(target.tab === TAB.profile ? target.userId : undefined);
    setCurrentTab(target.tab);
  }, [profileBackStack]);

  return { currentTab, viewingUserId, changeTab, openUserProfile, goBackFromProfile };
}

export type HomeTabsState = ReturnType<typeof useHomeTabs>;
