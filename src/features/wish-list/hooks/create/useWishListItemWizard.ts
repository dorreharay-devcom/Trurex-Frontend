import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSelectionSet } from '~/features/collections/hooks/common/useSelectionSet';
import { WishListApi } from '~/features/wish-list/api/wishListApi';
import { WISH_LIST_QUERY_KEYS } from '~/features/wish-list/config/queryKeys';
import type { WishListWizardPrefill } from '~/features/wish-list/types/wizardPrefill';
import { toastError, toastSuccess } from '~/shared/lib/appToast';
import { unknownErrorMessage } from '~/shared/lib/data/guards';

export const WISH_LIST_STEP_ORDER = ['details', 'photo', 'confirm'] as const;
export type WishListStepId = (typeof WISH_LIST_STEP_ORDER)[number];

export function useWishListItemWizard(prefill: WishListWizardPrefill | null) {
  const isEditMode = prefill?.kind === 'edit';
  const queryClient = useQueryClient();

  const [stepIndex, setStepIndex] = useState(0);
  const stepId = WISH_LIST_STEP_ORDER[stepIndex];

  const [brandName, setBrandName] = useState(
    prefill?.kind === 'edit'
      ? prefill.item.brand_name
      : prefill?.kind === 'fromRex'
        ? prefill.brandName
        : '',
  );
  const [productName, setProductName] = useState(
    prefill?.kind === 'edit'
      ? (prefill.item.product_name ?? '')
      : prefill?.kind === 'fromRex'
        ? (prefill.productName ?? '')
        : '',
  );
  const [size, setSize] = useState(prefill?.kind === 'edit' ? (prefill.item.size ?? '') : '');
  const [colour, setColour] = useState(prefill?.kind === 'edit' ? (prefill.item.colour ?? '') : '');
  const [note, setNote] = useState(prefill?.kind === 'edit' ? (prefill.item.note ?? '') : '');
  const [photoPath, setPhotoPath] = useState<string | null>(
    prefill?.kind === 'edit' ? prefill.item.photo_path : null,
  );

  const tags = useSelectionSet();
  const { replace: replaceTags } = tags;
  useEffect(() => {
    replaceTags(prefill?.kind === 'edit' ? prefill.item.tags : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [submitting, setSubmitting] = useState(false);

  const canProceed = useMemo(() => {
    switch (stepId) {
      case 'details':
        return brandName.trim().length > 0;
      case 'photo':
      case 'confirm':
        return true;
    }
  }, [stepId, brandName]);

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === WISH_LIST_STEP_ORDER.length - 1;

  const goNext = () => {
    if (!canProceed) return;
    setStepIndex((i) => Math.min(i + 1, WISH_LIST_STEP_ORDER.length - 1));
  };
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const submit = async (): Promise<boolean> => {
    setSubmitting(true);
    try {
      if (prefill?.kind === 'edit') {
        await WishListApi.updateWishListItem({
          id: prefill.item.id,
          brandName: brandName.trim(),
          productName: productName.trim() || null,
          size: size.trim() || null,
          colour: colour.trim() || null,
          note: note.trim() || null,
          tags: [...tags.selected],
          photoPath,
        });
      } else {
        await WishListApi.addToWishList({
          brandName: brandName.trim(),
          productName: productName.trim() || null,
          size: size.trim() || null,
          colour: colour.trim() || null,
          note: note.trim() || null,
          tags: [...tags.selected],
          photoPath,
          sourceRexId: prefill?.kind === 'fromRex' ? prefill.sourceRexId : null,
        });
      }
      void queryClient.invalidateQueries({ queryKey: WISH_LIST_QUERY_KEYS.mine });
      toastSuccess(isEditMode ? 'Wish List item updated!' : 'Added to Wish List!');
      return true;
    } catch (e) {
      toastError(
        isEditMode ? "Couldn't save changes" : "Couldn't add to Wish List",
        unknownErrorMessage(e, 'Try again.'),
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    stepId,
    stepIndex,
    isFirstStep,
    isLastStep,
    canProceed,
    goNext,
    goBack,
    submitting,
    submit,
    isEditMode,
    brandName,
    setBrandName,
    productName,
    setProductName,
    size,
    setSize,
    colour,
    setColour,
    note,
    setNote,
    tags,
    photoPath,
    setPhotoPath,
  };
}

export type WishListWizardFlow = ReturnType<typeof useWishListItemWizard>;
