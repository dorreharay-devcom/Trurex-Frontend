import { useCallback, useState } from 'react';
import { recommendationStubFromId } from '~/features/rex-detail/lib/rexDetailToRecommendation';
import type { Recommendation, RecommendationOpenOptions } from '~/shared/types/recommendation';

export function useRexPreview() {
  const [visible, setVisible] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [options, setOptions] = useState<RecommendationOpenOptions>({});

  const open = useCallback((rec: Recommendation, openOptions?: RecommendationOpenOptions) => {
    setOptions(openOptions ?? {});
    setRecommendation(rec);
    setVisible(true);
  }, []);

  const openById = useCallback(
    (rexId: string, openOptions?: RecommendationOpenOptions) => {
      open(recommendationStubFromId(rexId), openOptions);
    },
    [open],
  );

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  const clear = useCallback(() => {
    setRecommendation(null);
    setOptions({});
  }, []);

  return { visible, recommendation, options, open, openById, close, clear };
}

export type RexPreviewState = ReturnType<typeof useRexPreview>;
