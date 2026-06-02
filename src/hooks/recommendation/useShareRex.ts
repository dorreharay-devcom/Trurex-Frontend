import { useCallback } from 'react';
import { Platform, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import type { Recommendation } from '~/types/recommendation/recommendation';
import { toastSuccess } from '~/utils/appToast';
import { buildCurrentWebPath, buildPublicWebPath } from '~/utils/shareUrls';

const APP_NAME = 'TruRex';

export type RexShareInput = Pick<Recommendation, 'id' | 'title'>;

export function getRexShareUrl(rexId: string): string {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      return buildCurrentWebPath(`/rex/${encodeURIComponent(rexId)}`);
    } catch {
      return '';
    }
  }
  return buildPublicWebPath(`/rex/${encodeURIComponent(rexId)}`);
}

export function buildRexShareContent(rec: RexShareInput): { title: string; message: string } {
  const url = getRexShareUrl(rec.id);
  const title = rec.title;
  const head = `Check out "${title}" on ${APP_NAME}`;
  const message = url ? `${head}\n${url}` : head;
  return { title, message };
}

export function useShareRex() {
  const shareRecommendation = useCallback(async (rec: RexShareInput) => {
    const { title, message } = buildRexShareContent(rec);
    const url = getRexShareUrl(rec.id);
    try {
      if (Platform.OS === 'web') {
        const toCopy = url || message;
        if (toCopy) {
          await Clipboard.setStringAsync(toCopy);
          toastSuccess('Link copied!');
        }
        return;
      }
      await Share.share({ message, title });
    } catch {}
  }, []);

  return { shareRecommendation };
}
