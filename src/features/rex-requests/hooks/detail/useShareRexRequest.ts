import { useCallback } from 'react';
import * as Clipboard from 'expo-clipboard';
import { isWeb } from '~/shared/lib/ui/platform';
import { toastSuccess } from '~/shared/lib/appToast';
import { buildShareUrl, shareMobileLink } from '~/shared/lib/share';

const APP_NAME = 'TruRex';

export type RexRequestShareInput = { id: string; lookingForText: string };

export function getRexRequestShareUrl(requestId: string): string {
  return buildShareUrl(`/rex-request/${encodeURIComponent(requestId)}`);
}

export function buildRexRequestShareContent(request: RexRequestShareInput): {
  title: string;
  message: string;
  mobileMessage: string;
  url: string;
} {
  const url = getRexRequestShareUrl(request.id);
  const title = request.lookingForText;
  const head = `A Rex Request on ${APP_NAME}: "${title}"`;
  const message = url ? `${head}\n${url}` : head;
  return { title, message, mobileMessage: head, url };
}

export function useShareRexRequest() {
  const shareRexRequest = useCallback(async (request: RexRequestShareInput) => {
    const { message, mobileMessage } = buildRexRequestShareContent(request);
    const url = getRexRequestShareUrl(request.id);
    try {
      if (isWeb) {
        const toCopy = url || message;
        if (toCopy) {
          await Clipboard.setStringAsync(toCopy);
          toastSuccess('Link copied!');
        }
        return;
      }
      await shareMobileLink({ title: 'Rex Request', message: mobileMessage, url });
    } catch {}
  }, []);

  return { shareRexRequest };
}
