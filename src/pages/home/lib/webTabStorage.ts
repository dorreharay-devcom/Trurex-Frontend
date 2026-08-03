import { isTab, type Tab } from '~/shared/config/mainTabs';
import { isWeb } from '~/shared/lib/ui/platform';

const WEB_TAB_STORAGE_KEY = 'trurex:last-main-tab';

const hasWebStorage = isWeb && typeof window !== 'undefined';

export function getStoredWebTab(): Tab | null {
  if (!hasWebStorage) return null;
  try {
    const stored = window.localStorage.getItem(WEB_TAB_STORAGE_KEY);
    return isTab(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function storeWebTab(tab: Tab): void {
  if (!hasWebStorage) return;
  try {
    window.localStorage.setItem(WEB_TAB_STORAGE_KEY, tab);
  } catch {}
}
