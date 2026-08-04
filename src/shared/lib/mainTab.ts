import type { Href } from 'expo-router';
import { isTab, type Tab } from '~/shared/config/mainTabs';
import { Routes } from '~/shared/config/routes';
import { isWeb } from '~/shared/lib/ui/platform';

const STORAGE_KEY = 'trurex:last-main-tab';

export function getStoredMainTab(): Tab | null {
  if (!isWeb) return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isTab(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function storeMainTab(tab: Tab): void {
  if (!isWeb) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, tab);
  } catch {}
}

export function openMainTab(router: { replace: (href: Href) => void }, tab: Tab): void {
  storeMainTab(tab);
  router.replace(Routes.Main);
}
