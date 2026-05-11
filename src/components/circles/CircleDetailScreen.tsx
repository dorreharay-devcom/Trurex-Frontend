import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ArrowLeft, Pencil, Search, Trash2, X } from 'lucide-react-native';
import {
  CircleConnectionRow,
  CircleGlyphIcon,
  CircleMemberRow,
  MembersEmptyState,
  SectionSpinner,
  TrustedEmptyState,
} from '~/components/circles/common';
import type { CirclesViewModel } from '~/hooks/circles/useCirclesViewModel';
import {
  connectionFallbackInitialLoading,
  connectionFallbackRows,
  connectionRowsForDisplay,
  scopedConnectionListPhase,
  useScopedConnectionUserSearch,
  type ConnectionScopeTab,
} from '~/hooks/circles/useScopedConnectionUserSearch';
import { Theme } from '~/theme/Theme';
import { DestructiveActionConfirmModal } from '~/components/common/DestructiveActionConfirmModal';
import {
  DELETE_CIRCLE_CONFIRM_MESSAGE,
  canEditOrDeleteUserCircle,
  getCircleUiPolicy,
} from '~/utils/circleTabUtils';
import { webContainerStyle } from '~/utils';

type Props = { vm: CirclesViewModel; onUserPress?: (userId: string) => void };

export function CircleDetailScreen({ vm, onUserPress }: Props) {
  const [addConnTab, setAddConnTab] = useState<ConnectionScopeTab>('trusted');

  const selectedCircle = vm.selectedCircle;
  const selectedTab = vm.selectedTab;
  const detailReady = Boolean(selectedCircle && selectedTab);
  const showAddPanel =
    detailReady &&
    Boolean(selectedCircle && getCircleUiPolicy(selectedCircle).showConnectionsAddPanel);

  const addSearch = useScopedConnectionUserSearch(
    addConnTab,
    vm.user?.id,
    Boolean(vm.user?.id && showAddPanel),
  );

  if (!detailReady || !selectedCircle || !selectedTab) return null;

  const subtitle = selectedCircle.description?.trim() || selectedTab.subtitle;
  const selfId = vm.user?.id;
  const membersListed = selfId ? vm.members.filter((m) => m.user_id !== selfId) : vm.members;
  const listedCount = membersListed.length;
  const memberLabel = listedCount === 1 ? '1 member' : `${listedCount} members`;
  const canManage = canEditOrDeleteUserCircle(selectedCircle, vm.user?.id);
  const circleUi = getCircleUiPolicy(selectedCircle);
  const showAddToCircleSection = circleUi.showConnectionsAddPanel;
  const allowRemoveMember = circleUi.allowOwnerRemoveMemberRpc;

  const addFallbackRows = connectionFallbackRows(addConnTab, vm);
  const addFallbackLoading = connectionFallbackInitialLoading(addConnTab, vm);

  const addPhase = scopedConnectionListPhase({
    tab: addConnTab,
    searchActive: addSearch.searchActive,
    searchRows: addSearch.searchRows,
    searchFetching: addSearch.searchFetching,
    fallbackRows: addFallbackRows,
    fallbackLoading: addFallbackLoading,
  });

  const addDisplayRows = connectionRowsForDisplay({
    searchActive: addSearch.searchActive,
    searchRows: addSearch.searchRows,
    fallbackRows: addFallbackRows,
  });

  return (
    <>
      <ScrollView
        className="flex-1 w-full"
        contentContainerStyle={webContainerStyle}
        contentContainerClassName="w-full p-4 pb-24"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <DetailToolbar
          canManage={canManage}
          deletePending={vm.deleteMutation.isPending}
          deleteModalOpen={vm.showDeleteCircleModal}
          onBack={() => vm.setSelectedCircleId(null)}
          onEdit={vm.openEditSheet}
          onDelete={vm.requestDeleteCircle}
        />

        <View className="mb-6 flex-row items-start gap-3">
          <CircleGlyphIcon
            iconKind={selectedTab.iconKind}
            color={selectedTab.accent}
            bg={selectedTab.iconBg}
            size={22}
            large
          />
          <View className="min-w-0 flex-1">
            <Text className="text-lg font-semibold text-foreground">{selectedCircle.name}</Text>
            {subtitle ? (
              <Text className="mt-0.5 text-xs text-muted-foreground">{subtitle}</Text>
            ) : null}
          </View>
          <View
            className="rounded-full px-2.5 py-1"
            style={{ backgroundColor: selectedTab.iconBg }}
          >
            <Text className="text-xs font-semibold" style={{ color: selectedTab.accent }}>
              {memberLabel}
            </Text>
          </View>
        </View>

        <Text className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Members
        </Text>

        {vm.membersLoading ? (
          <SectionSpinner className="mb-6 items-center py-6" />
        ) : listedCount === 0 ? (
          <MembersEmptyState />
        ) : (
          <View className="mb-6 gap-2">
            {membersListed.map((m) => (
              <CircleMemberRow
                key={m.user_id}
                member={m}
                onUserPress={onUserPress}
                onRemove={
                  canManage && allowRemoveMember
                    ? () => vm.removeFromSelectedCircle(m.user_id)
                    : undefined
                }
                removing={vm.removingMemberId === m.user_id}
              />
            ))}
          </View>
        )}

        {showAddToCircleSection ? (
          <>
            <Text className="mb-3 mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Add to this circle
            </Text>

            <View className="mb-4 flex-row flex-wrap gap-2">
              {(
                [
                  ['trusted', `Trusted · ${vm.trustedRows.length}`],
                  ['following', `Following · ${vm.followingRows.length}`],
                  ['followers', `Followers · ${vm.followerRows.length}`],
                ] as const
              ).map(([id, label]) => {
                const active = addConnTab === id;
                return (
                  <Pressable
                    key={id}
                    onPress={() => setAddConnTab(id)}
                    className={`flex-row items-center rounded-xl border px-3 py-2 ${
                      active ? 'border-primary/40 bg-primary/10' : 'border-border bg-card'
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${active ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View className="relative mb-4 w-full max-w-md self-start">
              <View className="pointer-events-none absolute left-3 top-0 bottom-0 z-10 justify-center">
                <Search size={16} color={Theme.colors.muted} />
              </View>
              <TextInput
                value={addSearch.query}
                onChangeText={addSearch.setQuery}
                placeholder={addSearch.placeholder}
                placeholderTextColor={Theme.colors.muted}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground"
              />
            </View>

            {addPhase === 'loading' ? (
              <SectionSpinner className="mb-8 items-center py-4" />
            ) : addPhase === 'rows' ? (
              <View className="mb-8 gap-2">
                {addDisplayRows.map((row) => (
                  <CircleConnectionRow
                    key={row.user_id}
                    row={row}
                    isMember={vm.memberIdSet.has(row.user_id)}
                    isAdding={vm.addingMemberId === row.user_id}
                    onAdd={() => vm.addToSelectedCircle(row.user_id)}
                    onUserPress={onUserPress}
                  />
                ))}
              </View>
            ) : (
              <View className="mb-8 items-center py-8">
                {addPhase === 'no_match' ? (
                  <Text className="text-center text-sm text-muted-foreground">
                    No one matches your search.
                  </Text>
                ) : addPhase === 'trusted_empty' ? (
                  <TrustedEmptyState />
                ) : addPhase === 'followers_empty' ? (
                  <Text className="text-center text-sm text-muted-foreground">
                    No followers yet.
                  </Text>
                ) : (
                  <Text className="text-center text-sm text-muted-foreground">
                    Not following anyone yet.
                  </Text>
                )}
              </View>
            )}
          </>
        ) : null}
      </ScrollView>

      <EditCircleModal
        visible={vm.showEditModal}
        onClose={() => vm.setShowEditModal(false)}
        name={vm.editName}
        onChangeName={vm.setEditName}
        description={vm.editDesc}
        onChangeDescription={vm.setEditDesc}
        selectedColor={vm.editColor}
        onSelectColor={vm.setEditColor}
        colorPresets={vm.colorPresets}
        onSave={() => {
          if (!vm.editName.trim() || vm.updateMutation.isPending) return;
          vm.updateMutation.mutate();
        }}
        saveDisabled={!vm.editName.trim() || vm.updateMutation.isPending}
        saving={vm.updateMutation.isPending}
      />

      <DestructiveActionConfirmModal
        visible={vm.showDeleteCircleModal}
        title="Delete circle?"
        message={DELETE_CIRCLE_CONFIRM_MESSAGE}
        confirmLabel="Delete"
        pending={vm.deleteMutation.isPending}
        onCancel={vm.dismissDeleteCircleModal}
        onConfirm={vm.commitDeleteCircle}
      />
    </>
  );
}

function DetailToolbar({
  canManage,
  deletePending,
  deleteModalOpen,
  onBack,
  onEdit,
  onDelete,
}: {
  canManage: boolean;
  deletePending: boolean;
  deleteModalOpen: boolean;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <View className="mb-4 flex-row items-center justify-between gap-2">
      <Pressable onPress={onBack} className="flex-row items-center gap-1.5 active:opacity-70">
        <ArrowLeft size={16} color={Theme.colors.muted} />
        <Text className="text-sm text-muted-foreground">Back to circles</Text>
      </Pressable>
      {canManage ? (
        <View className="flex-row gap-2">
          <Pressable
            onPress={onEdit}
            className="flex-row items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 active:opacity-90"
          >
            <Pencil size={14} color={Theme.colors.foreground} />
            <Text className="text-xs font-medium text-foreground">Edit</Text>
          </Pressable>
          <Pressable
            onPress={onDelete}
            disabled={deletePending || deleteModalOpen}
            className="flex-row items-center gap-1 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 active:opacity-90"
          >
            {deletePending ? (
              <ActivityIndicator size="small" color={Theme.colors.destructive} />
            ) : (
              <>
                <Trash2 size={14} color={Theme.colors.destructive} />
                <Text className="text-xs font-medium" style={{ color: Theme.colors.destructive }}>
                  Delete
                </Text>
              </>
            )}
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function EditCircleModal({
  visible,
  onClose,
  name,
  onChangeName,
  description,
  onChangeDescription,
  selectedColor,
  onSelectColor,
  colorPresets,
  onSave,
  saveDisabled,
  saving,
}: {
  visible: boolean;
  onClose: () => void;
  name: string;
  onChangeName: (t: string) => void;
  description: string;
  onChangeDescription: (t: string) => void;
  selectedColor: string;
  onSelectColor: (hex: string) => void;
  colorPresets: readonly string[];
  onSave: () => void;
  saveDisabled: boolean;
  saving: boolean;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-center bg-black/50 px-4">
        <View className="max-w-md self-center w-full rounded-xl border border-border bg-card p-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-base font-semibold text-foreground">Edit circle</Text>
            <Pressable onPress={onClose} hitSlop={8} className="p-1 active:opacity-70">
              <X size={20} color={Theme.colors.muted} />
            </Pressable>
          </View>
          <TextInput
            placeholder="Circle name..."
            placeholderTextColor={Theme.colors.muted}
            value={name}
            onChangeText={onChangeName}
            maxLength={40}
            className="mb-3 rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground"
          />
          <TextInput
            placeholder="Description (optional)"
            placeholderTextColor={Theme.colors.muted}
            value={description}
            onChangeText={onChangeDescription}
            maxLength={100}
            multiline
            className="mb-3 min-h-[44px] rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground"
          />
          <Text className="mb-2 text-xs text-muted-foreground">Color</Text>
          <View className="mb-4 flex-row flex-wrap gap-2">
            {colorPresets.map((c) => (
              <Pressable
                key={c}
                onPress={() => onSelectColor(c)}
                className="h-7 w-7 rounded-full"
                style={{
                  backgroundColor: c,
                  borderWidth: selectedColor === c ? 3 : 0,
                  borderColor: Theme.colors.foreground,
                }}
              />
            ))}
          </View>
          <View className="flex-row gap-2">
            <Pressable
              onPress={onClose}
              className="flex-1 items-center rounded-xl border border-border py-3 active:opacity-90"
            >
              <Text className="text-sm font-medium text-foreground">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={onSave}
              disabled={saveDisabled}
              className={`flex-1 items-center rounded-xl py-3 ${
                !saveDisabled ? 'bg-primary' : 'bg-primary/40'
              }`}
            >
              {saving ? (
                <ActivityIndicator color={Theme.colors.primaryForeground} />
              ) : (
                <Text className="text-sm font-semibold text-primary-foreground">Save</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
