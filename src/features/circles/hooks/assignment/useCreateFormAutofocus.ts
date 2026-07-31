import { useCallback, useEffect, useRef, useState } from 'react';
import type { LayoutChangeEvent, ScrollView, TextInput } from 'react-native';
import { isWeb } from '~/utils';

const SCROLL_TO_FORM_DELAY_MS = 50;
const FOCUS_DELAY_MS = 180;
const FORM_SCROLL_MARGIN_PX = 8;

export function useCreateFormAutofocus(active: boolean) {
  const scrollRef = useRef<ScrollView>(null);
  const nameInputRef = useRef<TextInput>(null);
  const [formY, setFormY] = useState(0);
  const [measured, setMeasured] = useState(false);
  const [focusRequest, setFocusRequest] = useState(0);

  useEffect(() => {
    if (!isWeb || !active || !measured || focusRequest === 0) return;

    const scrollTimer = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: Math.max(0, formY - FORM_SCROLL_MARGIN_PX), animated: true });
    }, SCROLL_TO_FORM_DELAY_MS);
    const focusTimer = setTimeout(() => {
      nameInputRef.current?.focus();
    }, FOCUS_DELAY_MS);

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(focusTimer);
    };
  }, [active, measured, focusRequest, formY]);

  const requestFocus = () => {
    if (!isWeb) return;
    setMeasured(false);
    setFocusRequest((count) => count + 1);
  };

  const onFormLayout = (e: LayoutChangeEvent) => {
    setFormY(e.nativeEvent.layout.y);
    setMeasured(true);
  };

  const reset = useCallback(() => {
    setFormY(0);
    setMeasured(false);
    setFocusRequest(0);
  }, []);

  return { scrollRef, nameInputRef, requestFocus, onFormLayout, reset };
}
