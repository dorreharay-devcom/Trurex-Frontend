import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { ChevronRight, Plus, Search, Users, X } from 'lucide-react-native';
import { CircleAssignmentSheet } from '~/components/circles/CircleAssignmentSheet';
import { CircleDetailScreen } from '~/components/circles/CircleDetailScreen';
import { PeopleYouMayKnowSection } from '~/components/circles/PeopleYouMayKnowSection';
import { ShareProfileCard } from '~/components/circles/ShareProfileCard';
import {
  CircleGlyphIcon,
  ConnectionLoadMoreButton,
  NetworkConnectionRow,
  TrustedEmptyState,
} from '~/components/circles/common';
import { type CirclesViewModel, useCirclesViewModel } from '~/hooks/circles/useCirclesViewModel';
import {
  connectionCountLabel,
  connectionFallbackFetchingNextPage,
  connectionFallbackFetchNextPage,
  connectionFallbackHasNextPage,
  connectionFallbackInitialLoading,
  connectionFallbackRows,
  connectionRowsForDisplay,
  scopedConnectionListPhase,
  useScopedConnectionUserSearch,
  type ConnectionScopeTab,
} from '~/hooks/circles/useScopedConnectionUserSearch';
import { Theme, textFieldCaretStyle, textFieldSingleLineStyle } from '~/theme/Theme';
import { connectionScopeTabStyle } from '~/utils/circleTabUtils';
import { cn } from '~/utils/general';
import { webContainerStyle } from '~/utils';

type Props = { isActive: boolean; onUserPress?: (userId: string) => void };

const CirclesView = ({ isActive, onUserPress }: Props) => {
  const vm = useCirclesViewModel(isActive);

  if (vm.selectedCircleId && vm.selectedCircle && vm.selectedTab) {
    return <CircleDetailScreen vm={vm} onUserPress={onUserPress} />;
  }

  return <CirclesListContent vm={vm} isActive={isActive} onUserPress={onUserPress} />;
};

function CirclesListContent({
  vm,
  isActive,
  onUserPress,
}: {
  vm: CirclesViewModel;
  isActive: boolean;
  onUserPress?: (userId: string) => void;
}) {
  const [connTab, setConnTab] = useState<ConnectionScopeTab>('trusted');
  const [circleSheet, setCircleSheet] = useState<{ id: string; name: string } | null>(null);

  const connSearch = useScopedConnectionUserSearch(
    connTab,
    vm.user?.id,
    Boolean(vm.user && isActive),
  );

  const connFallbackRows = connectionFallbackRows(connTab, vm);
  const connFallbackLoading = connectionFallbackInitialLoading(connTab, vm);

  const connPhase = scopedConnectionListPhase({
    tab: connTab,
    searchActive: connSearch.searchActive,
    searchRows: connSearch.searchRows,
    searchFetching: connSearch.searchFetching,
    fallbackRows: connFallbackRows,
    fallbackLoading: connFallbackLoading,
  });

  const connDisplayRows = connectionRowsForDisplay({
    searchActive: connSearch.searchActive,
    searchRows: connSearch.searchRows,
    fallbackRows: connFallbackRows,
  });
  const connHasNextPage = connSearch.searchActive
    ? connSearch.searchHasNextPage
    : connectionFallbackHasNextPage(connTab, vm);
  const connFetchingNextPage = connSearch.searchActive
    ? connSearch.searchFetchingNextPage
    : connectionFallbackFetchingNextPage(connTab, vm);
  const fetchNextConnPage = connSearch.searchActive
    ? connSearch.fetchNextSearchPage
    : connectionFallbackFetchNextPage(connTab, vm);

  return (
    <>
      <ScrollView
        className="flex-1 w-full"
        contentContainerStyle={webContainerStyle}
        contentContainerClassName="w-full p-4 pb-24"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ShareProfileCard isActive={isActive} />
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
              style={textFieldCaretStyle}
            />
            <TextInput
              placeholder="Description (optional)"
              placeholderTextColor={Theme.colors.muted}
              value={vm.newDesc}
              onChangeText={vm.setNewDesc}
              maxLength={100}
              multiline
              className="mb-3 min-h-[44px] rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground"
              style={textFieldCaretStyle}
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
              className={cn(
                'items-center rounded-xl py-3',
                vm.newName.trim() && !vm.createMutation.isPending
                  ? 'cursor-pointer bg-primary active:opacity-90'
                  : 'cursor-not-allowed bg-primary/40 opacity-50',
              )}
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
          <View className="gap-3">
            {[1, 2, 3].map((i) => (
              <View key={i} className="h-16 rounded-xl bg-border/40" />
            ))}
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
              Create a circle and add people from Followers or Trusted.
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
          <View className="mt-10">
            <Text className="mb-3 text-base font-semibold text-foreground">Connections</Text>

            <View className="mb-4 flex-row flex-wrap gap-2">
              {(
                [
                  [
                    'trusted',
                    `Trusted · ${connectionCountLabel(
                      vm.trustedRows.length,
                      vm.trustedHasNextPage,
                    )}`,
                  ],
                  [
                    'followers',
                    `Followers · ${connectionCountLabel(
                      vm.followerRows.length,
                      vm.followersHasNextPage,
                    )}`,
                  ],
                  [
                    'following',
                    `Following · ${connectionCountLabel(
                      vm.followingRows.length,
                      vm.followingHasNextPage,
                    )}`,
                  ],
                ] as const
              ).map(([id, label]) => {
                const active = connTab === id;
                const tab = connectionScopeTabStyle(active);
                return (
                  <Pressable
                    key={id}
                    onPress={() => setConnTab(id)}
                    style={tab.pressableStyle}
                    className={tab.pressableClassName}
                  >
                    <Text className={tab.textClassName}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View className="relative mb-4 w-full max-w-md self-start">
              <View
                pointerEvents="none"
                className="absolute left-3 top-0 bottom-0 z-10 justify-center"
              >
                <Search size={16} color={Theme.colors.muted} />
              </View>
              <TextInput
                value={connSearch.query}
                onChangeText={connSearch.setQuery}
                placeholder={connSearch.placeholder}
                placeholderTextColor={Theme.colors.muted}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground"
                style={[textFieldCaretStyle, textFieldSingleLineStyle]}
                multiline={false}
                numberOfLines={1}
                scrollEnabled={false}
              />
            </View>

            {connPhase === 'loading' ? (
              <View className="gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <View key={i} className="h-16 rounded-xl bg-border/40" />
                ))}
              </View>
            ) : connPhase === 'rows' ? (
              <View className="gap-2">
                {connDisplayRows.map((row) => (
                  <NetworkConnectionRow
                    key={row.user_id}
                    row={row}
                    allowAddToCircle={connTab !== 'following'}
                    onAddToCircle={
                      connTab === 'following'
                        ? undefined
                        : () =>
                            setCircleSheet({
                              id: row.user_id,
                              name: row.display_name || 'Member',
                            })
                    }
                    onUserPress={onUserPress}
                  />
                ))}
                <ConnectionLoadMoreButton
                  visible={connHasNextPage}
                  loading={connFetchingNextPage}
                  onPress={fetchNextConnPage}
                />
              </View>
            ) : connPhase === 'no_match' ? (
              <View className="items-center py-10">
                <Text className="text-center text-sm text-muted-foreground">
                  No one matches your search.
                </Text>
              </View>
            ) : connPhase === 'trusted_empty' ? (
              <TrustedEmptyState containerClassName="" />
            ) : connPhase === 'followers_empty' ? (
              <View className="items-center py-10">
                <Text className="text-center text-sm text-muted-foreground">No followers yet.</Text>
              </View>
            ) : (
              <View className="items-center py-10">
                <Text className="text-center text-sm text-muted-foreground">
                  Not following anyone yet.
                </Text>
              </View>
            )}

            <PeopleYouMayKnowSection isActive={isActive} onUserPress={onUserPress} />
          </View>
        ) : null}
      </ScrollView>

      <CircleAssignmentSheet
        open={!!circleSheet}
        onClose={() => setCircleSheet(null)}
        memberId={circleSheet?.id ?? ''}
        memberName={circleSheet?.name ?? ''}
        circles={vm.circles}
        circlesLoading={vm.isLoading}
      />
    </>
  );
}

export default CirclesView;
