import type { Href } from 'expo-router';
import { MAIN_TAB_HREF, type Tab } from '~/shared/config/mainTabs';

export function openMainTab(router: { replace: (href: Href) => void }, tab: Tab): void {
  router.replace(MAIN_TAB_HREF[tab]);
}
