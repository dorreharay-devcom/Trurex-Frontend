import React, { useEffect, useMemo, useState } from 'react';
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, X } from 'lucide-react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CircleApiRow } from '~/api/circlesApi';
import { addCircleMember, createCircle } from '~/api/circlesApi';
import { CircleGlyphIcon } from '~/components/circles/common/CircleGlyphIcon';
import { Theme } from '~/theme/Theme';
import { toastError, toastSuccess } from '~/utils/appToast';
import {
  circleTabIconKind,
  defaultCircleSubtitle,
  hexToSoftIconBackground,
  parseCircleAccentHex,
  isUserCreatedCircle,
  sortCirclesForTabList,
} from '~/utils/recommendation/recCircles';

type Props = {
  open: boolean;
  onClose: () => void;
  memberId: string;
  memberName: string;
  circles: CircleApiRow[];
  circlesLoading: boolean;
  memberCircleIds?: ReadonlySet<string>;
  membershipsLoading?: boolean;
};

export function CircleAssignmentSheet({
  open,
  onClose,
  memberId,
  memberName,
  circles,
  circlesLoading,
  memberCircleIds,
  membershipsLoading = false,
}: Props) {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [scrollViewportH, setScrollViewportH] = useState(0);
  const [scrollContentH, setScrollContentH] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const showScrollBottomFade =
    scrollContentH > scrollViewportH + 12 && scrollY < scrollContentH - scrollViewportH - 8;

  useEffect(() => {
    if (!open) {
      setShowCreate(false);
      setNewName('');
      setScrollViewportH(0);
      setScrollContentH(0);
      setScrollY(0);
    }
  }, [open]);

  const onScrollList = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollY(e.nativeEvent.contentOffset.y);
  };

  const onScrollViewportLayout = (e: LayoutChangeEvent) => {
    setScrollViewportH(e.nativeEvent.layout.height);
  };

  const onScrollContentSizeChange = (_w: number, h: number) => {
    setScrollContentH(h);
  };

  const assignableCircles = useMemo(() => {
    const sorted = sortCirclesForTabList(circles);
    const already = memberCircleIds ?? new Set<string>();
    return sorted.filter(
      (c) => (c.system_kind === 'inner_circle' || isUserCreatedCircle(c)) && !already.has(c.id),
    );
  }, [circles, memberCircleIds]);

  const assignMutation = useMutation({
    mutationFn: ({ circleId }: { circleId: string }) => addCircleMember(circleId, memberId),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['circleMemberAssignments'] });
      queryClient.invalidateQueries({ queryKey: ['circleMembers', vars.circleId] });
      queryClient.invalidateQueries({ queryKey: ['myCircles'] });
      toastSuccess('Added to circle');
      onClose();
    },
    onError: (e: Error) => toastError('Could not add to circle', e.message),
  });

  const pendingCircleId =
    assignMutation.isPending && assignMutation.variables
      ? assignMutation.variables.circleId
      : undefined;

  const assignInFlight = assignMutation.isPending || creating;

  const handleAssign = (circleId: string) => {
    assignMutation.mutate({ circleId });
  };

  const handleCreateAndAssign = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setCreating(true);
    try {
      const created = await createCircle({
        input_name: trimmed,
        input_description: null,
        input_icon_url: null,
        input_color: Theme.colors.primary,
      });
      queryClient.invalidateQueries({ queryKey: ['myCircles'] });
      await assignMutation.mutateAsync({ circleId: created.id });
      setNewName('');
      setShowCreate(false);
    } catch (e) {
      toastError('Could not create circle', e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setCreating(false);
    }
  };

  if (!open) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View className="flex-1 justify-center bg-black/50 px-4">
        <Pressable className="absolute bottom-0 left-0 right-0 top-0" onPress={onClose} />
        <View className="max-h-[85%] w-full max-w-md self-center rounded-xl border border-border bg-card p-4 shadow-lg">
          <View className="mb-4 flex-row items-start justify-between gap-3">
            <Text className="flex-1 text-center font-display text-lg font-semibold text-foreground">
              Add {memberName} to a Circle?
            </Text>
            <Pressable onPress={onClose} hitSlop={10} className="p-1 active:opacity-70">
              <X size={22} color={Theme.colors.secondaryText} />
            </Pressable>
          </View>

          {circlesLoading || membershipsLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator color={Theme.colors.primary} />
            </View>
          ) : (
            <View className="relative overflow-hidden">
              <ScrollView
                style={{ maxHeight: Platform.OS === 'web' ? 360 : 320 }}
                contentContainerStyle={{ paddingBottom: 12 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator
                scrollEventThrottle={16}
                onLayout={onScrollViewportLayout}
                onScroll={onScrollList}
                onContentSizeChange={onScrollContentSizeChange}
              >
                <View className="gap-2">
                  {assignableCircles.length === 0 ? (
                    <Text className="rounded-xl border border-border bg-background px-4 py-3 text-center text-sm text-foreground">
                      This person is already in all of your circles.
                    </Text>
                  ) : null}
                  {assignableCircles.map((circle) => {
                    const accent = parseCircleAccentHex(circle) ?? Theme.colors.primary;
                    const iconBg = hexToSoftIconBackground(accent);
                    const iconKind = circleTabIconKind(circle);
                    const rowPending = pendingCircleId === circle.id;
                    return (
                      <Pressable
                        key={circle.id}
                        onPress={() => handleAssign(circle.id)}
                        disabled={assignInFlight}
                        className="flex-row items-center gap-3 rounded-xl border border-border bg-background p-4 active:opacity-90"
                      >
                        <CircleGlyphIcon iconKind={iconKind} color={accent} bg={iconBg} size={18} />
                        <View className="min-w-0 flex-1">
                          <Text
                            className="text-sm font-semibold"
                            style={{ color: Theme.colors.foreground }}
                            numberOfLines={1}
                          >
                            {circle.name}
                          </Text>
                          <Text
                            className="text-xs"
                            style={{ color: Theme.colors.secondaryText }}
                            numberOfLines={2}
                          >
                            {defaultCircleSubtitle(circle)}
                          </Text>
                        </View>
                        {rowPending ? (
                          <ActivityIndicator size="small" color={Theme.colors.primary} />
                        ) : null}
                      </Pressable>
                    );
                  })}

                  {showCreate ? (
                    <View className="gap-3 rounded-xl border border-border bg-background p-4">
                      <View className="flex-row items-center justify-between">
                        <Text
                          className="text-sm font-semibold"
                          style={{ color: Theme.colors.foreground }}
                        >
                          New Circle
                        </Text>
                        <Pressable onPress={() => setShowCreate(false)} hitSlop={8}>
                          <X size={16} color={Theme.colors.muted} />
                        </Pressable>
                      </View>
                      <TextInput
                        placeholder="Circle name..."
                        placeholderTextColor={Theme.colors.muted}
                        value={newName}
                        onChangeText={setNewName}
                        maxLength={40}
                        className="rounded-xl border border-border bg-card px-3 py-3 text-sm text-foreground"
                      />
                      <Pressable
                        onPress={() => void handleCreateAndAssign()}
                        disabled={!newName.trim() || assignInFlight}
                        className={`items-center rounded-xl py-3 ${
                          newName.trim() && !assignInFlight ? 'bg-primary' : 'bg-primary/40'
                        }`}
                      >
                        {creating || assignMutation.isPending ? (
                          <ActivityIndicator color={Theme.colors.primaryForeground} />
                        ) : (
                          <Text className="text-sm font-semibold text-primary-foreground">
                            Create & Assign
                          </Text>
                        )}
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => setShowCreate(true)}
                      disabled={assignInFlight}
                      className="flex-row items-center gap-3 rounded-xl border border-dashed border-border bg-background p-4 active:opacity-90"
                    >
                      <View className="h-11 w-11 items-center justify-center rounded-full bg-muted">
                        <Plus size={18} color={Theme.colors.secondaryText} />
                      </View>
                      <Text
                        className="text-sm font-medium"
                        style={{ color: Theme.colors.foreground }}
                      >
                        Create new circle
                      </Text>
                    </Pressable>
                  )}
                </View>
              </ScrollView>
              {showScrollBottomFade ? (
                <LinearGradient
                  pointerEvents="none"
                  colors={[Theme.colors.transparent, Theme.colors.card]}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 44,
                  }}
                />
              ) : null}
            </View>
          )}

          <Pressable
            onPress={onClose}
            className="mt-4 items-center rounded-xl border border-border py-3 active:bg-muted/40"
          >
            <Text className="text-sm font-medium" style={{ color: Theme.colors.foreground }}>
              Skip for now
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
