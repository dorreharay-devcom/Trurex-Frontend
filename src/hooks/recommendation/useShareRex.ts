import { useCallback } from 'react';
import { Platform, Share } from 'react-native';
import * as Linking from 'expo-linking';
import type { Recommendation } from '~/types/recommendation/recommendation';

const APP_NAME = 'TruRex';

export type RexShareInput = Pick<Recommendation, 'id' | 'title'>;

export function getRexShareUrl(rexId: string): string {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      const u = new URL(window.location.href);
      u.searchParams.set('rex', rexId);
      return u.toString();
    } catch {
      return '';
    }
  }
  return Linking.createURL('/', { queryParams: { rex: rexId } });
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
    try {
      await Share.share({ message, title });
    } catch {}
  }, []);

  return { shareRecommendation };
}
