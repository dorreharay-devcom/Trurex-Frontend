import { Platform, Share, type ShareContent } from 'react-native';

type MobileShareLinkParams = {
  title: string;
  message: string;
  url?: string;
};

function buildMobileShareContent({ title, message, url }: MobileShareLinkParams): ShareContent {
  if (Platform.OS === 'ios' && url) {
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
    Platform.OS === 'ios' ? { subject: params.title } : { dialogTitle: params.title },
  );
}
