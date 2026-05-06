import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable, TextInput } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { Check, Pencil, Plus, X } from 'lucide-react-native';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import {
  type CreateRecCircle,
  canRenameCreateRecCircle,
  findRenameableCircleById,
} from '~/constants/recommendation/createCircles';
import { Theme, textFieldCaretStyle } from '~/theme/Theme';
import { CreateStepTitle } from '../../CreateStepTitle';
import { cn } from '~/utils/general';
import { CirclesRingPicker } from './common/CirclesRingPicker';
import { createCircle, updateCircle } from '~/api/circlesApi';
import { toastError, toastSuccess } from '~/utils/appToast';
import { webNoOutline } from '../search/common/webInputOutline';
import { unknownErrorMessage } from '~/utils';
import { isNonEmptyString } from '~/utils/guards';
import {
  circleFooterSubtitle,
  effectiveCirclesAfterLoadError,
  partitionPublicAndPrivateRings,
} from '~/utils/recommendation/createCirclesRing';

const NEW_CIRCLE_HEX_COLORS = ['#9333ea', '#ca8a04', '#dc2626', '#0d9488', '#ea580c'] as const;

type Props = {
  circles: CreateRecCircle[];
  showFetchSpinner: boolean;
  loadError: boolean;
  onRetry: () => void;
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  showSensitiveNudge?: boolean;
};

export const Circles: React.FC<Props> = ({
  circles,
  showFetchSpinner,
  loadError,
  onRetry,
  selectedIds,
  onToggle,
  showSensitiveNudge = false,
}) => {
  const queryClient = useQueryClient();
  const visible = useMemo(
    () => effectiveCirclesAfterLoadError(loadError, circles),
    [loadError, circles],
  );

  const { publicCircle, ringsInnerToBroader } = useMemo(
    () => partitionPublicAndPrivateRings(visible),
    [visible],
  );

  const outerId = visible[visible.length - 1]?.id ?? '';
  const [highlightId, setHighlightId] = useState(outerId);

  useEffect(() => {
    const nextOuter = visible[visible.length - 1]?.id ?? '';
    setHighlightId((h) => (visible.some((c) => c.id === h) ? h : nextOuter));
  }, [visible]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [busy, setBusy] = useState(false);

  const invalidateCircles = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['myCircles'] });
  }, [queryClient]);

  const displayCircle = useMemo(() => {
    const match = visible.find((c) => c.id === highlightId);
    return match ?? publicCircle;
  }, [visible, highlightId, publicCircle]);

  const renameTarget = useMemo(
    () => findRenameableCircleById(visible, editingId),
    [visible, editingId],
  );

  const handleSaveEdit = useCallback(async () => {
    const id = editingId;
    const name = editName.trim();
    if (id == null || !isNonEmptyString(name)) return;

    setBusy(true);
    try {
      await updateCircle({ input_circle_id: id, input_name: name });
      toastSuccess('Saved', 'Circle name updated.');
      setEditingId(null);
      setEditName('');
      invalidateCircles();
    } catch (e) {
      toastError('Rename failed', unknownErrorMessage(e, 'Try again.'));
    } finally {
      setBusy(false);
    }
  }, [editingId, editName, invalidateCircles]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditName('');
  }, []);

  const handleAddCircle = useCallback(async () => {
    const color = NEW_CIRCLE_HEX_COLORS[ringsInnerToBroader.length % NEW_CIRCLE_HEX_COLORS.length];
    setBusy(true);
    try {
      const created = await createCircle({
        input_name: 'New Circle',
        input_color: color,
      });
      toastSuccess('Circle added', 'Rename it below if you like.');
      invalidateCircles();
      setEditingId(created.id);
      setEditName(created.name ?? 'New Circle');
      setHighlightId(created.id);
    } catch (e) {
      toastError('Could not create circle', unknownErrorMessage(e, 'Try again.'));
    } finally {
      setBusy(false);
    }
  }, [ringsInnerToBroader.length, invalidateCircles]);

  const showRenameControl =
    displayCircle != null && canRenameCreateRecCircle(displayCircle) && editingId == null;

  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center pb-36"
    >
      <View className={cn(CREATE_REC_STEP_INNER, 'gap-6')}>
        <View className="items-center gap-2">
          <CreateStepTitle>Choose your circles</CreateStepTitle>
          <Text className="text-center text-sm text-muted-foreground">
            Tap a ring to share with that circle. Smallest = most private.
          </Text>
        </View>

        {showSensitiveNudge ? (
          <View className="flex-row items-start gap-3 rounded-xl border border-accent-foreground/20 bg-accent/60 p-4">
            <Text className="shrink-0 text-lg">👀</Text>
            <Text className="flex-1 text-sm text-foreground">
              <Text className="font-semibold">Heads up</Text>
              {' — you might want to think about who sees this one'}
            </Text>
          </View>
        ) : null}

        {loadError ? (
          <View className="items-center gap-3 py-4">
            <Text className="text-center text-sm text-destructive">
              Couldn&apos;t load your circles. Check your connection and try again.
            </Text>
            <Pressable
              onPress={onRetry}
              accessibilityRole="button"
              className="rounded-xl border border-border bg-card px-4 py-2 active:opacity-90"
            >
              <Text className="text-sm font-medium text-foreground">Retry</Text>
            </Pressable>
          </View>
        ) : null}

        {showFetchSpinner ? (
          <View className="items-center py-8">
            <ActivityIndicator color={Theme.colors.primary} />
            <Text className="mt-3 text-sm text-muted-foreground">Loading circles…</Text>
          </View>
        ) : null}

        {!showFetchSpinner && publicCircle != null ? (
          <>
            <CirclesRingPicker
              publicCircle={publicCircle}
              ringsInnerToBroader={ringsInnerToBroader}
              selectedIds={selectedIds}
              onToggle={onToggle}
              highlightId={highlightId}
              onHighlightId={setHighlightId}
              editingId={editingId}
            />

            <Text className="text-center text-sm font-medium text-foreground">
              {selectedIds.size} circle{selectedIds.size === 1 ? '' : 's'} selected
            </Text>

            {displayCircle != null ? (
              <View className="items-center gap-0.5">
                <Text className="text-base font-semibold" style={{ color: displayCircle.accent }}>
                  {displayCircle.title}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  {circleFooterSubtitle(displayCircle)}
                </Text>
              </View>
            ) : null}

            {renameTarget != null ? (
              <View className="mx-auto w-full max-w-sm flex-row items-center gap-2">
                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Circle name"
                  placeholderTextColor={Theme.colors.secondaryText}
                  className="min-w-0 flex-1 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground"
                  style={[webNoOutline, textFieldCaretStyle]}
                  maxLength={32}
                  editable={!busy}
                  onSubmitEditing={() => void handleSaveEdit()}
                />
                <Pressable
                  onPress={() => void handleSaveEdit()}
                  accessibilityRole="button"
                  accessibilityLabel="Save name"
                  disabled={busy}
                  className="rounded-lg bg-primary p-2 active:opacity-90 disabled:opacity-50"
                >
                  <Check size={18} color={Theme.colors.primaryForeground} />
                </Pressable>
                <Pressable
                  onPress={cancelEdit}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel editing"
                  disabled={busy}
                  className="rounded-lg bg-muted p-2 active:opacity-90 disabled:opacity-50"
                >
                  <X size={18} color={Theme.colors.destructive} />
                </Pressable>
              </View>
            ) : null}

            <View className="flex-row flex-wrap items-center justify-center gap-2">
              <Pressable
                onPress={() => void handleAddCircle()}
                disabled={busy || loadError}
                accessibilityRole="button"
                className="flex-row items-center gap-1.5 rounded-full border border-border px-3 py-1.5 active:bg-muted/40 disabled:opacity-50"
              >
                <Plus size={14} color={Theme.colors.foreground} />
                <Text className="text-xs font-medium text-foreground">Add circle</Text>
              </Pressable>
              {showRenameControl && displayCircle != null ? (
                <Pressable
                  onPress={() => {
                    setEditingId(displayCircle.id);
                    setEditName(displayCircle.title);
                  }}
                  accessibilityRole="button"
                  className="flex-row items-center gap-1.5 rounded-full border border-border px-3 py-1.5 active:bg-muted/40"
                >
                  <Pencil size={14} color={Theme.colors.secondaryText} />
                  <Text className="text-xs font-medium text-muted-foreground">Rename</Text>
                </Pressable>
              ) : null}
            </View>
          </>
        ) : null}
      </View>
    </ScrollView>
  );
};
