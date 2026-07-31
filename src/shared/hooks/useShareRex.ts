import { useCallback } from 'react';
import * as Clipboard from 'expo-clipboard';
import type { Recommendation } from '~/shared/types/recommendation';
import { isWeb } from '~/utils';
import { toastSuccess } from '~/utils/appToast';
import { buildCurrentWebPath, buildPublicWebPath } from '~/utils/shareUrls';
import { shareMobileLink } from '~/utils/mobileShare';

const APP_NAME = 'TruRex';

const hasWebWindow = isWeb && typeof window !== 'undefined';

export type RexShareInput = Pick<Recommendation, 'id' | 'title'>;

export function getRexShareUrl(rexId: string): string {
  if (hasWebWindow) {
    try {
      return buildCurrentWebPath(`/rex/${encodeURIComponent(rexId)}`);
    } catch {
      return '';
    }
  }
  return buildPublicWebPath(`/rex/${encodeURIComponent(rexId)}`);
}

export function buildRexShareContent(rec: RexShareInput): {
  title: string;
  message: string;
  mobileMessage: string;
  url: string;
} {
  const url = getRexShareUrl(rec.id);
  const title = rec.title;
  const head = `Check out "${title}" on ${APP_NAME}`;
  const message = url ? `${head}\n${url}` : head;
  return { title, message, mobileMessage: head, url };
}

export function useShareRex() {
  const shareRecommendation = useCallback(async (rec: RexShareInput) => {
    const { title, message, mobileMessage } = buildRexShareContent(rec);
    const url = getRexShareUrl(rec.id);
    try {
      if (isWeb) {
        const toCopy = url || message;
        if (toCopy) {
          await Clipboard.setStringAsync(toCopy);
          toastSuccess('Link copied!');
        }
        return;
      }
      await shareMobileLink({ title, message: mobileMessage, url });
    } catch {}
  }, []);

  return { shareRecommendation };
}
