import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TextInput } from 'react-native';
import { MAP_SEARCH_SUGGEST_MIN_QUERY_LENGTH } from '~/features/map/lib/mapSearchSuggestions';
import type { Recommendation } from '~/shared/types/recommendation';

const BLUR_DELAY_MS = 200;

type Params = {
  value: string;
  suggestions: Recommendation[];
  onChangeText: (value: string) => void;
  onSelectSuggestion?: (rec: Recommendation) => void;
};

export function useMapSearchFocus({
  value,
  suggestions,
  onChangeText,
  onSelectSuggestion,
}: Params) {
  const [focused, setFocused] = useState(false);
  const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);

  const clearBlurTimer = useCallback(() => {
    if (!blurTimerRef.current) return;
    clearTimeout(blurTimerRef.current);
    blurTimerRef.current = null;
  }, []);

  useEffect(() => clearBlurTimer, [clearBlurTimer]);

  const handleFocus = useCallback(() => {
    clearBlurTimer();
    setFocused(true);
  }, [clearBlurTimer]);

  const handleBlur = useCallback(() => {
    clearBlurTimer();
    blurTimerRef.current = setTimeout(() => setFocused(false), BLUR_DELAY_MS);
  }, [clearBlurTimer]);

  const showSuggestions = useMemo(
    () =>
      focused &&
      value.trim().length >= MAP_SEARCH_SUGGEST_MIN_QUERY_LENGTH &&
      suggestions.length > 0,
    [focused, value, suggestions.length],
  );

  const pickSuggestion = useCallback(
    (rec: Recommendation) => {
      clearBlurTimer();
      setFocused(false);
      inputRef.current?.blur();
      onChangeText(rec.title);
      onSelectSuggestion?.(rec);
    },
    [clearBlurTimer, onChangeText, onSelectSuggestion],
  );

  return { inputRef, handleFocus, handleBlur, showSuggestions, pickSuggestion };
}
