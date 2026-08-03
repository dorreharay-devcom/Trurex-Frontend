import { Share, type ShareContent } from 'react-native';
import { TRUREX_WEB_ORIGIN } from '~/shared/config/app';
import { isIos, isWeb } from '~/shared/lib/ui/platform';

export function buildShareUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const origin = isWeb ? window.location.origin : TRUREX_WEB_ORIGIN;
  return `${origin}${normalized}`;
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
