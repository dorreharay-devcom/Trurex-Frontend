import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ArrowLeft, Pencil, Trash2, X } from 'lucide-react-native';
import {
  CircleConnectionRow,
  CircleGlyphIcon,
  CircleMemberRow,
  FollowingEmptyState,
  MembersEmptyState,
  SectionSpinner,
  TrustedEmptyState,
} from '~/components/circles/common';
import type { CirclesViewModel } from '~/hooks/circles/useCirclesViewModel';
import { Theme } from '~/theme/Theme';
import { canEditOrDeleteUserCircle } from '~/utils/circleTabUtils';
import { webContainerStyle } from '~/utils';

type Props = { vm: CirclesViewModel };

export function CircleDetailScreen({ vm }: Props) {
  if (!vm.selectedCircle || !vm.selectedTab) return null;

  const subtitle = vm.selectedCircle.description?.trim() || vm.selectedTab.subtitle;
  const memberLabel = vm.members.length === 1 ? '1 member' : `${vm.members.length} members`;
  const canManage = canEditOrDeleteUserCircle(vm.selectedCircle, vm.user?.id);

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
          onBack={() => vm.setSelectedCircleId(null)}
          onEdit={vm.openEditSheet}
          onDelete={vm.requestDeleteCircle}
        />

        <View className="mb-6 flex-row items-start gap-3">
          <CircleGlyphIcon
            iconKind={vm.selectedTab.iconKind}
            color={vm.selectedTab.accent}
            bg={vm.selectedTab.iconBg}
            size={22}
            large
          />
          <View className="min-w-0 flex-1">
            <Text className="text-lg font-semibold text-foreground">{vm.selectedCircle.name}</Text>
            {subtitle ? (
              <Text className="mt-0.5 text-xs text-muted-foreground">{subtitle}</Text>
            ) : null}
          </View>
          <View
            className="rounded-full px-2.5 py-1"
            style={{ backgroundColor: vm.selectedTab.iconBg }}
          >
            <Text className="text-xs font-semibold" style={{ color: vm.selectedTab.accent }}>
              {memberLabel}
            </Text>
          </View>
        </View>

        <Text className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Members
        </Text>

        {vm.members.length === 0 ? (
          <MembersEmptyState />
        ) : (
          <View className="mb-4 gap-2">
            {vm.members.map((m) => (
              <CircleMemberRow
                key={m.user_id}
                member={m}
                onRemove={
                  canManage && m.user_id !== vm.user?.id
                    ? () => vm.removeFromSelectedCircle(m.user_id)
                    : undefined
                }
                removing={vm.removingMemberId === m.user_id}
              />
            ))}
          </View>
        )}

        <Text className="mb-3 mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Add to this circle
        </Text>

        <CountHeading label="Trusted" count={vm.trustedRows.length} />
        {vm.trustedLoading ? (
          <SectionSpinner />
        ) : vm.trustedRows.length === 0 ? (
          <TrustedEmptyState />
        ) : (
          <View className="mb-6 gap-2">
            {vm.trustedRows.map((row) => (
              <CircleConnectionRow
                key={row.user_id}
                row={row}
                isMember={vm.memberIdSet.has(row.user_id)}
                isAdding={vm.addingMemberId === row.user_id}
                onAdd={() => vm.addToSelectedCircle(row.user_id)}
              />
            ))}
          </View>
        )}

        <CountHeading label="Following" count={vm.followersNotFollowedBack.length} />
        {vm.loadingFollowBackLists ? (
          <SectionSpinner />
        ) : vm.followersNotFollowedBack.length === 0 ? (
          <FollowingEmptyState />
        ) : (
          <View className="mb-6 gap-2">
            {vm.followersNotFollowedBack.map((row) => (
              <CircleConnectionRow
                key={row.user_id}
                row={row}
                isMember={vm.memberIdSet.has(row.user_id)}
                isAdding={vm.addingMemberId === row.user_id}
                onAdd={() => vm.addToSelectedCircle(row.user_id)}
              />
            ))}
          </View>
        )}

        <CountHeading label="Followers" count={vm.followerRows.length} />
        {vm.followersLoading ? (
          <SectionSpinner className="mb-8 items-center py-4" />
        ) : vm.followerRows.length === 0 ? (
          <View className="mb-8 items-center py-8">
            <Text className="text-center text-sm text-muted-foreground">No followers yet.</Text>
          </View>
        ) : (
          <View className="mb-8 gap-2">
            {vm.followerRows.map((row) => (
              <CircleConnectionRow
                key={row.user_id}
                row={row}
                isMember={vm.memberIdSet.has(row.user_id)}
                isAdding={vm.addingMemberId === row.user_id}
                onAdd={() => vm.addToSelectedCircle(row.user_id)}
              />
            ))}
          </View>
        )}
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
    </>
  );
}

function DetailToolbar({
  canManage,
  deletePending,
  onBack,
  onEdit,
  onDelete,
}: {
  canManage: boolean;
  deletePending: boolean;
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
            disabled={deletePending}
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

function CountHeading({ label, count }: { label: string; count: number }) {
  return (
    <Text className="mb-2 text-sm font-semibold text-foreground">
      {label} <Text className="text-sm font-normal text-muted-foreground">({count})</Text>
    </Text>
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
