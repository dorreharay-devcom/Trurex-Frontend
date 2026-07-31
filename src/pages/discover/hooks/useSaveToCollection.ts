import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { RecSummary } from '~/features/collections/types/recSummary';
import { modalConfig } from '~/hooks/useOverlaySheetPresentation';
import { FEED_QUERY_KEY } from '~/pages/discover/hooks/useFeed';
import type { Recommendation } from '~/shared/types/recommendation';
import { toastSuccess } from '~/utils/appToast';

const SAVE_SHEET_TOAST_DELAY_MS = modalConfig.timing.sheetCloseMs + 180;

export function useSaveToCollection() {
  const queryClient = useQueryClient();
  const [saveTarget, setSaveTarget] = useState<RecSummary | null>(null);

  const openForRec = useCallback((rec: Recommendation) => {
    setSaveTarget({
      id: rec.id,
      place_name: rec.title,
      category_code: rec.categoryId,
      location: rec.location,
      isSaved: rec.isSaved,
    });
  }, []);

  const close = useCallback(() => {
    setSaveTarget(null);
    queryClient.invalidateQueries({ queryKey: [FEED_QUERY_KEY] });
  }, [queryClient]);

  const notifyCollectionCreated = useCallback((collectionName: string) => {
    setTimeout(() => {
      toastSuccess('New collection added', `Added to ${collectionName}`);
    }, SAVE_SHEET_TOAST_DELAY_MS);
  }, []);

  return { saveTarget, openForRec, close, notifyCollectionCreated };
}
