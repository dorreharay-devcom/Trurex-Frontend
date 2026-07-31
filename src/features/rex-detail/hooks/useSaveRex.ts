import { useCallback, useEffect, useMemo, useState } from 'react';
import type { RecSummary } from '~/components/faves/AddToCollectionSheet';
import { useAuth } from '~/features/auth/providers';
import type { Recommendation } from '~/shared/types/recommendation';
import { toastInfo } from '~/utils/appToast';

export function useSaveRex(recommendation: Recommendation | null) {
  const { user: authUser } = useAuth();
  const [saveOpen, setSaveOpen] = useState(false);
  const [savedOverride, setSavedOverride] = useState<boolean | null>(null);
  const recommendationId = recommendation?.id;

  useEffect(() => {
    setSavedOverride(null);
    setSaveOpen(false);
  }, [recommendationId]);

  const isSaved = savedOverride ?? recommendation?.isSaved ?? false;

  const recSummary = useMemo((): RecSummary | null => {
    if (!recommendation) return null;
    return {
      id: recommendation.id,
      place_name: recommendation.title,
      category_code: recommendation.categoryId,
      location: recommendation.location,
      isSaved,
    };
  }, [recommendation, isSaved]);

  const openSave = useCallback(() => {
    if (!recommendation) return;
    if (!authUser) {
      toastInfo('Sign in', 'Sign in to save this recommendation.');
      return;
    }
    setSaveOpen(true);
  }, [recommendation, authUser]);

  const closeSave = useCallback(() => setSaveOpen(false), []);
  const markSaved = useCallback(() => setSavedOverride(true), []);
  const markUnsaved = useCallback(() => setSavedOverride(false), []);

  return { saveOpen, openSave, closeSave, isSaved, recSummary, markSaved, markUnsaved };
}

export type SaveRexState = ReturnType<typeof useSaveRex>;
