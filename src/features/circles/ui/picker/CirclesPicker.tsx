import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { CREATE_REC_STEP_INNER } from '~/features/rex-create/config/layout';
import type { CircleDisplayRow } from '~/shared/types/circles';
import {
  canRenameCircleDisplayRow,
  effectiveCirclesAfterLoadError,
  findRenameableCircleById,
  partitionPublicAndPrivateRings,
} from '~/features/circles/lib/circlesPicker';
import { useCircleEditor } from '~/features/circles/hooks/useCircleEditor';
import { Theme } from '~/shared/theme/Theme';
import CreateStepTitle from '~/features/rex-create/ui/CreateStepTitle';
import { cn } from '~/shared/lib/ui/styles';
import CircleActionChips from './CircleActionChips';
import CircleRenameRow from './CircleRenameRow';
import CirclesRingPicker from './CirclesRingPicker';
import CirclesSelectionSummary from './CirclesSelectionSummary';
import CreateCircleModal from './CreateCircleModal';
import PrivateRexToggle from './PrivateRexToggle';

type Props = {
  circles: CircleDisplayRow[];
  showFetchSpinner: boolean;
  loadError: boolean;
  onRetry: () => void;
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  showPrivateOption?: boolean;
  privateSelected?: boolean;
  onPrivateSelectedChange?: (selected: boolean) => void;
  subtitle?: string;
};

const CirclesPicker: React.FC<Props> = ({
  circles,
  showFetchSpinner,
  loadError,
  onRetry,
  selectedIds,
  onToggle,
  showPrivateOption = true,
  privateSelected = false,
  onPrivateSelectedChange,
  subtitle = 'Tap a ring to share with that circle. Smallest = most private.',
}) => {
  const visible = useMemo(
    () => effectiveCirclesAfterLoadError(loadError, circles),
    [loadError, circles],
  );
  const { publicCircle, ringsInnerToBroader } = useMemo(
    () => partitionPublicAndPrivateRings(visible),
    [visible],
  );

  const [highlightId, setHighlightId] = useState(visible[visible.length - 1]?.id ?? '');
  useEffect(() => {
    const nextOuter = visible[visible.length - 1]?.id ?? '';
    setHighlightId((h) => (visible.some((c) => c.id === h) ? h : nextOuter));
  }, [visible]);

  const editor = useCircleEditor({ onCreated: setHighlightId });

  const displayCircle = visible.find((c) => c.id === highlightId) ?? publicCircle;
  const renameTarget = findRenameableCircleById(visible, editor.editingId);
  const showRenameChip =
    displayCircle != null &&
    canRenameCircleDisplayRow(displayCircle) &&
    editor.editingId == null &&
    !privateSelected;

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
            <Text className="text-center text-sm text-muted-foreground">{subtitle}</Text>
          </View>

          {showPrivateOption ? (
            <PrivateRexToggle
              selected={privateSelected}
              onChange={onPrivateSelectedChange ?? (() => {})}
            />
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
                selectedIds={privateSelected ? new Set() : selectedIds}
                onToggle={onToggle}
                highlightId={highlightId}
                onHighlightId={setHighlightId}
                editingId={editor.editingId}
                disabled={privateSelected}
              />

              <CirclesSelectionSummary
                privateSelected={privateSelected}
                selectedCount={selectedIds.size}
                displayCircle={displayCircle}
              />

              {renameTarget != null ? (
                <CircleRenameRow
                  name={editor.name}
                  onChangeName={editor.setName}
                  onSave={() => void editor.submitRename()}
                  onCancel={editor.cancelRename}
                  busy={editor.busy}
                />
              ) : null}

              <CircleActionChips
                showAdd={editor.editingId == null && !editor.showCreateModal}
                addDisabled={editor.busy || loadError || privateSelected}
                onAdd={editor.openCreateModal}
                showRename={showRenameChip}
                onRename={() => displayCircle && editor.startRename(displayCircle)}
              />
            </>
          ) : null}
        </View>
      </ScrollView>

      <CreateCircleModal
        visible={editor.showCreateModal}
        onClose={editor.closeCreateModal}
        name={editor.name}
        onChangeName={editor.setName}
        description={editor.description}
        onChangeDescription={editor.setDescription}
        selectedColor={editor.color}
        onSelectColor={editor.setColor}
        onCreate={() => void editor.submitCreate()}
        creating={editor.busy}
      />
    </>
  );
};

export default CirclesPicker;
