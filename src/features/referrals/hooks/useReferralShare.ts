import { useCallback } from 'react';
import * as Clipboard from 'expo-clipboard';
import { isWeb } from '~/shared/lib/ui/platform';
import { toastSuccess } from '~/shared/lib/appToast';
import { buildShareUrl, shareMobileLink } from '~/shared/lib/share';
import { toSignupRoute } from '~/shared/config/routes';

const APP_NAME = 'TruRex';

export function getReferralShareUrl(code: string): string {
  return buildShareUrl(toSignupRoute({ referralCode: code }));
}

export function buildReferralShareContent(code: string): {
  title: string;
  message: string;
  url: string;
} {
  const url = getReferralShareUrl(code);
  const title = `Join me on ${APP_NAME}`;
  const message = `Join me on ${APP_NAME} — use my code ${code} when you sign up!`;
  return { title, message, url };
}

export function useReferralShare() {
  const shareReferralCode = useCallback(async (code: string) => {
    const { title, message, url } = buildReferralShareContent(code);
    try {
      if (isWeb) {
        await Clipboard.setStringAsync(url || message);
        toastSuccess('Link copied!');
        return;
      }
      await shareMobileLink({ title, message, url });
    } catch {}
  }, []);

  return { shareReferralCode };
}
