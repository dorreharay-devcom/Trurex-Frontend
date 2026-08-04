import { useCallback, useState } from 'react';
import {
  CREATE_REC_MUST_KNOW_MAX,
  CREATE_REC_REVIEW_MAX,
} from '~/features/rex-create/config/scorecard';
import type { CategoryRatingDimension } from '~/features/rex-create/types/categoryCreateConfig';
import type { RexForEditRow } from '~/features/rex-detail/types/rexDetail';

function withoutKey(map: Record<string, string>, key: string): Record<string, string> {
  const { [key]: _omitted, ...rest } = map;
  return rest;
}

export function useScorecard() {
  const [categoryRatings, setCategoryRatings] = useState<Record<string, number | null>>({});
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [selectedTagSlugs, setSelectedTagSlugs] = useState<string[]>([]);
  const [scoreQuickTip, setScoreQuickTipState] = useState('');
  const [scoreValueForMoney, setScoreValueForMoney] = useState<number | null>(null);
  const [scoreReview, setScoreReviewState] = useState('');

  const setCategoryRating = useCallback((code: string, value: number) => {
    setCategoryRatings((prev) => ({ ...prev, [code]: value === 0 ? null : value }));
  }, []);

  const setQuestionAnswer = useCallback(
    (code: string, value: string, mode: 'select' | 'text' = 'select') => {
      setQuestionAnswers((prev) => {
        const cleared = mode === 'text' ? value.length === 0 : prev[code] === value;
        return cleared ? withoutKey(prev, code) : { ...prev, [code]: value };
      });
    },
    [],
  );

  const toggleTagSlug = useCallback((slug: string) => {
    setSelectedTagSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }, []);

  const setScoreQuickTip = useCallback((text: string) => {
    setScoreQuickTipState(text.slice(0, CREATE_REC_MUST_KNOW_MAX));
  }, []);

  const setScoreReview = useCallback((text: string) => {
    setScoreReviewState(text.slice(0, CREATE_REC_REVIEW_MAX));
  }, []);

  const syncToConfig = useCallback(
    (dimensions: CategoryRatingDimension[], edit: RexForEditRow | null) => {
      setCategoryRatings(
        Object.fromEntries(
          dimensions.map((d) => [d.code, edit?.category_ratings?.[d.code]?.score ?? null]),
        ),
      );
      setQuestionAnswers(edit?.question_answers ?? {});
      setSelectedTagSlugs(edit?.tag_slugs ?? []);
      setScoreValueForMoney(edit?.score_value_for_money ?? null);
    },
    [],
  );

  const clear = useCallback(() => {
    setCategoryRatings({});
    setQuestionAnswers({});
    setSelectedTagSlugs([]);
    setScoreQuickTipState('');
    setScoreValueForMoney(null);
    setScoreReviewState('');
  }, []);

  return {
    categoryRatings,
    setCategoryRating,
    questionAnswers,
    setQuestionAnswer,
    selectedTagSlugs,
    toggleTagSlug,
    scoreQuickTip,
    setScoreQuickTip,
    scoreValueForMoney,
    setScoreValueForMoney,
    scoreReview,
    setScoreReview,
    syncToConfig,
    clear,
  };
}
