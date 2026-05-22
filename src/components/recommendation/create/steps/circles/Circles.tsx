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
import { Theme, textFieldCaretStyle, textFieldSingleLineStyle } from '~/theme/Theme';
import { CreateStepTitle } from '../../CreateStepTitle';
import { cn } from '~/utils/general';
import { CirclesRingPicker } from './common/CirclesRingPicker';
import { CreateCircleModal } from './common/CreateCircleModal';
import { createCircle, updateCircle } from '~/api/circlesApi';
import { toastError, toastSuccess } from '~/utils/appToast';
import { webNoOutline } from '../search/common/webInputOutline';
import { unknownErrorMessage } from '~/utils';
import { didAccountFrozenMutationToast } from '~/utils/mutationRestrictionError';
import { isNonEmptyString } from '~/utils/guards';
import {
  circleFooterSubtitle,
  effectiveCirclesAfterLoadError,
  partitionPublicAndPrivateRings,
} from '~/utils/recommendation/createCirclesRing';
import { type CirclePresetColor, CIRCLE_COLOR_PRESETS } from '~/utils/circleTabUtils';

const PRESET_DEFAULT: CirclePresetColor = CIRCLE_COLOR_PRESETS[0];
const collectionFieldBg = { backgroundColor: Theme.colors.searchFieldBackground };

type Props = {
  circles: CreateRecCircle[];
  showFetchSpinner: boolean;
  loadError: boolean;
  onRetry: () => void;
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  privateSelected: boolean;
  onPrivateSelectedChange: (selected: boolean) => void;
  showSensitiveNudge?: boolean;
};

export const Circles: React.FC<Props> = ({
  circles,
  showFetchSpinner,
  loadError,
  onRetry,
  selectedIds,
  onToggle,
  privateSelected,
  onPrivateSelectedChange,
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

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedColor, setSelectedColor] = useState<CirclePresetColor>(PRESET_DEFAULT);
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

  const resetCreateForm = useCallback(() => {
    setEditName('');
    setNewDesc('');
    setSelectedColor(PRESET_DEFAULT);
  }, []);

  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false);
    resetCreateForm();
  }, [resetCreateForm]);

  const handleCreateCircle = useCallback(async () => {
    const name = editName.trim();
    if (!isNonEmptyString(name)) return;

    setBusy(true);
    try {
      const created = await createCircle({
        input_name: name,
        input_description: newDesc.trim() || null,
        input_icon_url: null,
        input_color: selectedColor,
      });
      toastSuccess('Circle added');
      closeCreateModal();
      invalidateCircles();
      setHighlightId(created.id);
    } catch (e) {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Could not create circle', unknownErrorMessage(e, 'Try again.'));
    } finally {
      setBusy(false);
    }
  }, [editName, newDesc, selectedColor, closeCreateModal, invalidateCircles]);

  const handleSaveRename = useCallback(async () => {
    const name = editName.trim();
    const id = editingId;
    if (!isNonEmptyString(name) || id == null) return;

    setBusy(true);
    try {
      await updateCircle({ input_circle_id: id, input_name: name });
      toastSuccess('Saved', 'Circle name updated.');
      setEditingId(null);
      setEditName('');
      invalidateCircles();
    } catch (e) {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Rename failed', unknownErrorMessage(e, 'Try again.'));
    } finally {
      setBusy(false);
    }
  }, [editingId, editName, invalidateCircles]);

  const cancelRename = useCallback(() => {
    setEditingId(null);
    setEditName('');
  }, []);

  const handleAddCircle = useCallback(() => {
    resetCreateForm();
    setShowCreateModal(true);
  }, [resetCreateForm]);

  const showRenameRow = renameTarget != null;

  const showRenameControl =
    displayCircle != null && canRenameCreateRecCircle(displayCircle) && editingId == null;

  return (
    <>
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

          <Pressable
            onPress={() => onPrivateSelectedChange(!privateSelected)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: privateSelected }}
            className="mx-auto flex-row items-center gap-2 active:opacity-90"
          >
            <View
              className={cn(
                'h-5 w-5 items-center justify-center rounded-md border',
                privateSelected ? 'border-primary bg-primary' : 'border-primary bg-card',
              )}
            >
              {privateSelected ? <Check size={13} color={Theme.colors.primaryForeground} /> : null}
            </View>
            <Text
              className={cn(
                'text-sm font-semibold',
                privateSelected ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              Make this rex private
            </Text>
          </Pressable>

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
                selectedIds={privateSelected ? new Set() : selectedIds}
                onToggle={onToggle}
                highlightId={highlightId}
                onHighlightId={setHighlightId}
                editingId={editingId}
                disabled={privateSelected}
              />

              <Text className="text-center text-sm font-medium text-foreground">
                {privateSelected
                  ? 'Private Rex selected'
                  : `${selectedIds.size} circle${selectedIds.size === 1 ? '' : 's'} selected`}
              </Text>

              {privateSelected ? (
                <View className="items-center gap-0.5">
                  <Text className="text-base font-semibold text-foreground">Private</Text>
                  <Text className="text-xs text-muted-foreground">Only you can see this Rex</Text>
                </View>
              ) : displayCircle != null ? (
                <View className="items-center gap-0.5">
                  <Text className="text-base font-semibold" style={{ color: displayCircle.accent }}>
                    {displayCircle.title}
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    {circleFooterSubtitle(displayCircle)}
                  </Text>
                </View>
              ) : null}

              {showRenameRow ? (
                <View className="mx-auto w-full max-w-sm flex-row items-center gap-2">
                  <TextInput
                    value={editName}
                    onChangeText={setEditName}
                    placeholder="Circle name"
                    placeholderTextColor={Theme.colors.secondaryText}
                    className="min-w-0 flex-1 rounded-lg border border-border px-3 py-2 text-sm text-foreground"
                    style={[
                      collectionFieldBg,
                      webNoOutline,
                      textFieldCaretStyle,
                      textFieldSingleLineStyle,
                    ]}
                    maxLength={32}
                    editable={!busy}
                    onSubmitEditing={() => void handleSaveRename()}
                  />
                  <Pressable
                    onPress={() => void handleSaveRename()}
                    accessibilityRole="button"
                    accessibilityLabel="Save name"
                    disabled={busy}
                    className="rounded-lg bg-primary p-2 active:opacity-90 disabled:opacity-50"
                  >
                    <Check size={18} color={Theme.colors.primaryForeground} />
                  </Pressable>
                  <Pressable
                    onPress={cancelRename}
                    accessibilityRole="button"
                    accessibilityLabel="Cancel editing"
                    disabled={busy}
                    className="rounded-lg border border-border p-2 active:opacity-90 disabled:opacity-50"
                    style={collectionFieldBg}
                  >
                    <X size={18} color={Theme.colors.destructive} />
                  </Pressable>
                </View>
              ) : null}

              <View className="flex-row flex-wrap items-center justify-center gap-2">
                {editingId == null && !showCreateModal ? (
                  <Pressable
                    onPress={handleAddCircle}
                    disabled={busy || loadError || privateSelected}
                    accessibilityRole="button"
                    className="flex-row items-center gap-1.5 rounded-full border border-border px-3 py-1.5 active:bg-muted/40 disabled:opacity-50"
                  >
                    <Plus size={14} color={Theme.colors.foreground} />
                    <Text className="text-xs font-medium text-foreground">Add circle</Text>
                  </Pressable>
                ) : null}
                {showRenameControl && displayCircle != null && !privateSelected ? (
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

      <CreateCircleModal
        visible={showCreateModal}
        onClose={closeCreateModal}
        name={editName}
        onChangeName={setEditName}
        description={newDesc}
        onChangeDescription={setNewDesc}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
        onCreate={() => void handleCreateCircle()}
        creating={busy}
      />
    </>
  );
};
