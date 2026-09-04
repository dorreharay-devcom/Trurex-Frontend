import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '~/features/auth/providers';
import { useActiveCategories } from '~/shared/hooks/useActiveCategories';
import { useCirclesRingSelection } from '~/features/circles/hooks/useCirclesRingSelection';
import {
  createRexRequest,
  editRexRequest,
  getRexRequestDetail,
} from '~/features/rex-requests/api/rexRequestsApi';
import type { NeedBy } from '~/features/rex-requests/config/needBy';
import type { CreateRecSearchPlace } from '~/features/rex-create/types/create';
import type { ManualPlaceGeotagResult } from '~/features/rex-create/hooks/useManualPlaceGeotag';
import { toastError } from '~/shared/lib/appToast';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { assertOnlineForMutation } from '~/shared/lib/network/assertOnline';
import { track, AnalyticsEvent } from '~/shared/lib/analytics/track';

export const REX_REQUEST_STEP_ORDER = [
  'details',
  'category',
  'needBy',
  'circles',
  'confirm',
] as const;
export type RexRequestStepId = (typeof REX_REQUEST_STEP_ORDER)[number];

function locationTextFromPlace(place: CreateRecSearchPlace): string {
  return [place.title, place.subtitle].filter((part) => part.trim().length > 0).join(', ');
}

export function useCreateRexRequestWizard(editRequestId?: string | null) {
  const isEditMode = editRequestId != null;
  const { user } = useAuth();
  const [stepIndex, setStepIndex] = useState(0);
  const stepId = REX_REQUEST_STEP_ORDER[stepIndex];

  const [lookingForText, setLookingForText] = useState('');
  const [locationQuery, setLocationQueryRaw] = useState('');
  const [locationLat, setLocationLat] = useState<number | null>(null);
  const [locationLng, setLocationLng] = useState<number | null>(null);

  const { data: categoryRows } = useActiveCategories(true);
  const [selectedCategoryCodes, setSelectedCategoryCodes] = useState<string[]>([]);
  const toggleCategoryCode = (code: string) => {
    setSelectedCategoryCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };
  const selectedCategoryRows = useMemo(
    () => categoryRows?.filter((row) => selectedCategoryCodes.includes(row.code)) ?? [],
    [categoryRows, selectedCategoryCodes],
  );

  const [needBy, setNeedBy] = useState<NeedBy | null>(null);
  const [note, setNote] = useState('');
  const [existingAudienceLabel, setExistingAudienceLabel] = useState<string | null>(null);

  const ringSelection = useCirclesRingSelection();
  const isPublic =
    ringSelection.outerCircleId != null &&
    ringSelection.selectedCircleIds.has(ringSelection.outerCircleId);

  const [submitting, setSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [initialLoadError, setInitialLoadError] = useState(false);

  useEffect(() => {
    if (!editRequestId) return;
    let cancelled = false;
    setInitialLoading(true);
    setInitialLoadError(false);
    getRexRequestDetail(editRequestId)
      .then((row) => {
        if (cancelled) return;
        if (!row) {
          setInitialLoadError(true);
          return;
        }
        setLookingForText(row.looking_for_text);
        setLocationQueryRaw(row.location_text ?? '');
        setLocationLat(row.location_lat);
        setLocationLng(row.location_lng);
        setSelectedCategoryCodes(row.categories.map((c) => c.code));
        setNeedBy(row.need_by);
        setNote(row.note ?? '');
        const audience = [...(row.is_public ? ['Public'] : []), ...row.circle_names];
        setExistingAudienceLabel(audience.length ? audience.join(', ') : 'No one yet');
      })
      .catch(() => {
        if (!cancelled) setInitialLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setInitialLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [editRequestId]);

  const canProceed = useMemo(() => {
    switch (stepId) {
      case 'details':
        return lookingForText.trim().length > 0;
      case 'category':
        return selectedCategoryRows.length > 0;
      case 'needBy':
        return needBy != null;
      case 'circles':
        return ringSelection.selectedCircleIds.size > 0;
      case 'confirm':
        return true;
    }
  }, [stepId, lookingForText, selectedCategoryRows, needBy, ringSelection.selectedCircleIds]);

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === REX_REQUEST_STEP_ORDER.length - 1;

  const goNext = () => {
    if (!canProceed) return;
    setStepIndex((i) => Math.min(i + 1, REX_REQUEST_STEP_ORDER.length - 1));
  };
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const setLocationQuery = (text: string) => {
    setLocationQueryRaw(text);
    setLocationLat(null);
    setLocationLng(null);
  };
  const selectPlace = (place: CreateRecSearchPlace) => {
    setLocationQueryRaw(locationTextFromPlace(place));
    setLocationLat(place.latitude ?? null);
    setLocationLng(place.longitude ?? null);
  };
  const applyGeotag = (result: ManualPlaceGeotagResult) => {
    setLocationQueryRaw(result.addressLabel);
    setLocationLat(result.lat);
    setLocationLng(result.lng);
  };
  const clearLocation = () => {
    setLocationQueryRaw('');
    setLocationLat(null);
    setLocationLng(null);
  };

  const submit = async (): Promise<boolean> => {
    if (!user) {
      toastError('Sign in required', 'Please sign in to post a Rex Request.');
      return false;
    }
    if (selectedCategoryRows.length === 0 || !needBy) return false;
    if (!assertOnlineForMutation(isEditMode ? 'Saving your Rex Request' : 'Posting a Rex Request'))
      return false;

    setSubmitting(true);
    try {
      const circleIds = isPublic ? [] : Array.from(ringSelection.selectedCircleIds);
      const categoryIds = selectedCategoryRows.map((row) => row.id);
      if (isEditMode && editRequestId) {
        await editRexRequest({
          requestId: editRequestId,
          categoryIds,
          lookingForText: lookingForText.trim(),
          needBy,
          circleIds,
          locationText: locationQuery.trim() || null,
          locationLat,
          locationLng,
          note: note.trim() || null,
          isPublic,
        });
      } else {
        await createRexRequest({
          categoryIds,
          lookingForText: lookingForText.trim(),
          needBy,
          circleIds,
          locationText: locationQuery.trim() || null,
          locationLat,
          locationLng,
          note: note.trim() || null,
          isPublic,
        });
        track(AnalyticsEvent.RexRequestCreated);
      }
      return true;
    } catch (e) {
      if (didAccountFrozenMutationToast(e)) return false;
      const detail = unknownErrorMessage(e, '').trim();
      toastError(detail || `Couldn't ${isEditMode ? 'save' : 'post'} your request`, 'Try again.');
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
    initialLoading,
    initialLoadError,
    details: {
      lookingForText,
      setLookingForText,
      locationQuery,
      setLocationQuery,
      hasLocation: locationLat != null && locationLng != null,
      selectPlace,
      applyGeotag,
      clearLocation,
    },
    category: {
      rows: categoryRows,
      selectedCodes: selectedCategoryCodes,
      toggleCode: toggleCategoryCode,
      selectedRows: selectedCategoryRows,
    },
    needByNote: { needBy, setNeedBy, note, setNote },
    circles: {
      isPublic,
      selectedCircleIds: ringSelection.selectedCircleIds,
      toggleCircleId: ringSelection.toggleCircleId,
      ensureDefaultCircleSelectionFromApiOrder:
        ringSelection.ensureDefaultCircleSelectionFromApiOrder,
      existingAudienceLabel,
    },
  };
}

export type CreateRexRequestFlow = ReturnType<typeof useCreateRexRequestWizard>;
