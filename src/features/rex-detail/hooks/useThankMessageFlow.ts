import { useCallback, useEffect, useState } from 'react';
import { useThankCopyOptions } from '~/features/rex-detail/hooks/useThankCopyOptions';
import { MAX_THANK_MESSAGE_LENGTH } from '~/features/rex-detail/config/thank';

type Params = {
  open: boolean;
};

export function useThankMessageFlow({ open }: Params) {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [customMessage, setCustomMessage] = useState('');

  const optionsQuery = useThankCopyOptions(open);
  const options = optionsQuery.data ?? [];

  const reset = useCallback(() => {
    setSelectedOptionId(null);
    setCustomMessage('');
  }, []);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(reset, 0);
      return () => clearTimeout(t);
    }
    reset();
  }, [open, reset]);

  const selectOption = useCallback((id: number) => {
    setSelectedOptionId(id);
    setCustomMessage('');
  }, []);

  const setMessage = useCallback((text: string) => {
    const next = text.slice(0, MAX_THANK_MESSAGE_LENGTH);
    setCustomMessage(next);
    if (next.length > 0) setSelectedOptionId(null);
  }, []);

  const selectedOption = options.find((option) => option.id === selectedOptionId) ?? null;
  const trimmedCustom = customMessage.trim();
  const finalMessage = trimmedCustom.length > 0 ? trimmedCustom : (selectedOption?.message ?? null);
  const canSubmit = finalMessage != null && finalMessage.length > 0;

  return {
    options,
    optionsLoading: optionsQuery.isPending || optionsQuery.isFetching,
    optionsError: optionsQuery.isError,
    refetchOptions: optionsQuery.refetch,
    selectedOptionId,
    selectOption,
    customMessage,
    setMessage,
    finalMessage,
    canSubmit,
    reset,
  };
}

export type ThankMessageFlow = ReturnType<typeof useThankMessageFlow>;
