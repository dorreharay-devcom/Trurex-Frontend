import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { ChevronRight, Plus, Users, X } from 'lucide-react-native';
import { CircleDetailScreen } from '~/components/circles/CircleDetailScreen';
import {
  CircleGlyphIcon,
  FollowingEmptyState,
  NetworkPreviewRow,
  TrustedEmptyState,
} from '~/components/circles/common';
import { type CirclesViewModel, useCirclesViewModel } from '~/hooks/circles/useCirclesViewModel';
import { Theme } from '~/theme/Theme';
import type { NetworkUserRow } from '~/types/network';

type Props = { isActive: boolean };

const CirclesView = ({ isActive }: Props) => {
  const vm = useCirclesViewModel(isActive);

  if (vm.selectedCircleId && vm.selectedCircle && vm.selectedTab) {
    return <CircleDetailScreen vm={vm} />;
  }

  return <CirclesListContent vm={vm} isActive={isActive} />;
};

function CirclesListContent({ vm, isActive }: { vm: CirclesViewModel; isActive: boolean }) {
  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="p-4 pb-24"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text className="mb-3 text-base font-semibold text-foreground">My Circles</Text>

      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-sm font-medium text-foreground">Trust Circles</Text>
        <Pressable
          onPress={() => vm.setShowCreate((v) => !v)}
          className="flex-row items-center gap-1 rounded-lg bg-primary px-3 py-2 active:opacity-90"
        >
          <Plus size={14} color={Theme.colors.primaryForeground} />
          <Text className="text-xs font-semibold text-primary-foreground">New Circle</Text>
        </Pressable>
      </View>

      {vm.showCreate && (
        <View className="mb-6 rounded-xl border border-border bg-card p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-foreground">Create a new circle</Text>
            <Pressable
              onPress={() => vm.setShowCreate(false)}
              hitSlop={8}
              className="p-1 active:opacity-70"
            >
              <X size={16} color={Theme.colors.muted} />
            </Pressable>
          </View>
          <TextInput
            placeholder="Circle name..."
            placeholderTextColor={Theme.colors.muted}
            value={vm.newName}
            onChangeText={vm.setNewName}
            maxLength={40}
            className="mb-3 rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground"
          />
          <TextInput
            placeholder="Description (optional)"
            placeholderTextColor={Theme.colors.muted}
            value={vm.newDesc}
            onChangeText={vm.setNewDesc}
            maxLength={100}
            multiline
            className="mb-3 min-h-[44px] rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground"
          />
          <Text className="mb-2 text-xs text-muted-foreground">Color</Text>
          <View className="mb-4 flex-row flex-wrap gap-2">
            {vm.colorPresets.map((c) => (
              <Pressable
                key={c}
                onPress={() => vm.setSelectedColor(c)}
                className="h-7 w-7 rounded-full"
                style={{
                  backgroundColor: c,
                  borderWidth: vm.selectedColor === c ? 3 : 0,
                  borderColor: Theme.colors.foreground,
                }}
              />
            ))}
          </View>
          <Pressable
            onPress={() => {
              if (!vm.newName.trim() || vm.createMutation.isPending) return;
              vm.createMutation.mutate();
            }}
            disabled={!vm.newName.trim() || vm.createMutation.isPending}
            className={`items-center rounded-xl py-3 ${
              vm.newName.trim() && !vm.createMutation.isPending ? 'bg-primary' : 'bg-primary/40'
            }`}
          >
            {vm.createMutation.isPending ? (
              <ActivityIndicator color={Theme.colors.primaryForeground} />
            ) : (
              <Text className="text-sm font-semibold text-primary-foreground">Create Circle</Text>
            )}
          </Pressable>
        </View>
      )}

      {vm.isLoading ? (
        <View className="items-center py-12">
          <ActivityIndicator color={Theme.colors.primary} />
        </View>
      ) : vm.isError ? (
        <View className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <Text className="text-center text-sm text-foreground">
            Could not load circles. Check your connection and try again.
          </Text>
        </View>
      ) : vm.tabRows.length === 0 ? (
        <View className="items-center py-12">
          <Users size={48} color={Theme.colors.muted} style={{ opacity: 0.45 }} />
          <Text className="mt-3 text-sm font-medium text-muted-foreground">No circles yet</Text>
          <Text className="mt-1 max-w-xs text-center text-xs text-muted-foreground">
            Create a circle and add people from Trusted, Following, or Followers.
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {vm.tabRows.map((row) => (
            <Pressable
              key={row.id}
              onPress={() => vm.setSelectedCircleId(row.id)}
              className="flex-row items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm active:opacity-95"
            >
              <CircleGlyphIcon
                iconKind={row.iconKind}
                color={row.accent}
                bg={row.iconBg}
                size={20}
              />
              <View className="min-w-0 flex-1">
                <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
                  {row.title}
                </Text>
                <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                  {row.subtitle}
                </Text>
              </View>
              <ChevronRight size={16} color={Theme.colors.muted} />
            </Pressable>
          ))}
        </View>
      )}

      {vm.user && isActive ? (
        <View className="mt-10 gap-8">
          <HomeConnectionsBlock
            title="Followers"
            count={vm.followerRows.length}
            loading={vm.followersLoading}
            empty={
              <View className="items-center py-8">
                <Text className="text-center text-sm text-muted-foreground">No followers yet.</Text>
              </View>
            }
            rows={vm.followerRows}
          />
          <HomeConnectionsBlock
            title="Following"
            count={vm.followersNotFollowedBack.length}
            loading={vm.loadingFollowBackLists}
            empty={<FollowingEmptyState containerClassName="" />}
            rows={vm.followersNotFollowedBack}
          />
          <HomeConnectionsBlock
            title="Trusted"
            count={vm.trustedRows.length}
            loading={vm.trustedLoading}
            empty={<TrustedEmptyState containerClassName="" />}
            rows={vm.trustedRows}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}

function HomeConnectionsBlock({
  title,
  count,
  loading,
  empty,
  rows,
}: {
  title: string;
  count: number;
  loading: boolean;
  empty: React.ReactNode;
  rows: NetworkUserRow[];
}) {
  return (
    <View>
      <Text className="mb-2 text-sm font-semibold text-foreground">
        {title} <Text className="text-sm font-normal text-muted-foreground">({count})</Text>
      </Text>
      {loading ? (
        <View className="items-center py-6">
          <ActivityIndicator color={Theme.colors.primary} />
        </View>
      ) : rows.length === 0 ? (
        empty
      ) : (
        <View className="gap-2">
          {rows.map((row) => (
            <NetworkPreviewRow key={row.user_id} row={row} />
          ))}
        </View>
      )}
    </View>
  );
}

export default CirclesView;
