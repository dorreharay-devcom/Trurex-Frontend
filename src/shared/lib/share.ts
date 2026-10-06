import Constants from 'expo-constants';
import { Share, type ShareContent } from 'react-native';
import { TRUREX_DEV_WEB_ORIGIN, TRUREX_WEB_ORIGIN } from '~/shared/config/app';
import { isIos, isWeb } from '~/shared/lib/ui/platform';

const isProductionApp = Constants.expoConfig?.extra?.appEnv === 'production';

function resolveShareOrigin(): string {
  if (isWeb) return window.location.origin;
  return isProductionApp ? TRUREX_WEB_ORIGIN : TRUREX_DEV_WEB_ORIGIN;
}

export function buildShareUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${resolveShareOrigin()}${normalized}`;
}

type MobileShareLinkParams = {
  title: string;
  message: string;
  url?: string;
};

function buildMobileShareContent({ title, message, url }: MobileShareLinkParams): ShareContent {
  if (isIos && url) {
    return { title, message, url };
  }

  return {
    title,
    message: url ? `${message}\n${url}` : message,
  };
}

export async function shareMobileLink(params: MobileShareLinkParams): Promise<void> {
  await Share.share(
    buildMobileShareContent(params),
    isIos ? { subject: params.title } : { dialogTitle: params.title },
  );
}
