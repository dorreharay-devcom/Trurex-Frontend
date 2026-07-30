import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, X } from 'lucide-react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CircleApiRow } from '~/api/circlesApi';
import { addCircleMember, createCircle } from '~/api/circlesApi';
import { CircleGlyphIcon } from '~/components/circles/common/CircleGlyphIcon';
import {
  Theme,
  textFieldCaretStyle,
  textFieldMultilineStyle,
  textFieldSingleLineDefaultHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';
import { isWeb } from '~/utils';
import { toastError, toastSuccess } from '~/utils/appToast';
import { didAccountFrozenMutationToast } from '~/utils/mutationRestrictionError';
import { unknownErrorMessage } from '~/utils';
import {
  circleTabIconKind,
  defaultCircleSubtitle,
  hexToSoftIconBackground,
  parseCircleAccentHex,
  isUserCreatedCircle,
  sortCirclesForRingStack,
} from '~/utils/recommendation/recCircles';
import { ModalToastLayer } from '~/components/toast/ModalToastLayer';
import { CIRCLE_COLOR_PRESETS, type CirclePresetColor } from '~/utils/circleTabUtils';
import { cn } from '~/utils/general';

const PRESET_DEFAULT: CirclePresetColor = CIRCLE_COLOR_PRESETS[0];
const collectionFieldBg = { backgroundColor: Theme.colors.searchFieldBackground };

type Props = {
  open: boolean;
  onClose: () => void;
  memberId: string;
  memberName: string;
  circles: CircleApiRow[];
  circlesLoading: boolean;
};

export function CircleAssignmentSheet({
  open,
  onClose,
  memberId,
  memberName,
  circles,
  circlesLoading,
}: Props) {
  const { width, height } = useWindowDimensions();
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(600)).current;

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedColor, setSelectedColor] = useState<CirclePresetColor>(PRESET_DEFAULT);
  const [creating, setCreating] = useState(false);
  const [scrollViewportH, setScrollViewportH] = useState(0);
  const [scrollContentH, setScrollContentH] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [createFormY, setCreateFormY] = useState(0);
  const [createFormMeasured, setCreateFormMeasured] = useState(false);
  const [createFocusRequest, setCreateFocusRequest] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const newNameInputRef = useRef<TextInput>(null);

  const showScrollBottomFade =
    scrollContentH > scrollViewportH + 12 && scrollY < scrollContentH - scrollViewportH - 8;

  useEffect(() => {
    if (open) {
      setVisible(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(sheetTranslateY, {
          toValue: 0,
          damping: 20,
          stiffness: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(sheetTranslateY, { toValue: 600, duration: 220, useNativeDriver: true }),
      ]).start(() => setVisible(false));
    }
  }, [open, backdropOpacity, sheetTranslateY]);

  useEffect(() => {
    if (!open) {
      setShowCreate(false);
      setNewName('');
      setNewDesc('');
      setSelectedColor(PRESET_DEFAULT);
      setScrollViewportH(0);
      setScrollContentH(0);
      setScrollY(0);
      setCreateFormY(0);
      setCreateFormMeasured(false);
      setCreateFocusRequest(0);
    }
  }, [open]);

  useEffect(() => {
    if (!isWeb || !open || !showCreate || !createFormMeasured || createFocusRequest === 0) return;

    const scrollTimer = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: Math.max(0, createFormY - 8), animated: true });
    }, 50);
    const focusTimer = setTimeout(() => {
      newNameInputRef.current?.focus();
    }, 180);

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(focusTimer);
    };
  }, [createFocusRequest, createFormMeasured, createFormY, open, showCreate]);

  const openCreateForm = () => {
    if (isWeb) {
      setCreateFormMeasured(false);
      setCreateFocusRequest((request) => request + 1);
    }
    setShowCreate(true);
  };

  const onCreateFormLayout = (e: LayoutChangeEvent) => {
    setCreateFormY(e.nativeEvent.layout.y);
    setCreateFormMeasured(true);
  };

  const resetCreateForm = () => {
    setShowCreate(false);
    setNewName('');
    setNewDesc('');
    setSelectedColor(PRESET_DEFAULT);
    setCreateFormY(0);
    setCreateFormMeasured(false);
  };

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
    const sorted = sortCirclesForRingStack(circles);
    return sorted.filter((c) => c.system_kind === 'inner_circle' || isUserCreatedCircle(c));
  }, [circles]);

  const assignMutation = useMutation({
    mutationFn: ({ circleId }: { circleId: string }) => addCircleMember(circleId, memberId),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['circleMembers', vars.circleId] });
      queryClient.invalidateQueries({ queryKey: ['myCircles'] });
      toastSuccess('Added to circle');
      onClose();
    },
    onError: (e: unknown) => {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Could not add to circle', unknownErrorMessage(e, 'Try again.'));
    },
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
        input_description: newDesc.trim() || null,
        input_icon_url: null,
        input_color: selectedColor,
      });
      queryClient.invalidateQueries({ queryKey: ['myCircles'] });
      await assignMutation.mutateAsync({ circleId: created.id });
      setNewName('');
      setNewDesc('');
      setSelectedColor(PRESET_DEFAULT);
      setShowCreate(false);
    } catch (e) {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Could not create circle', unknownErrorMessage(e, 'Unknown error'));
    } finally {
      setCreating(false);
    }
  };

  const sheetRadius = isWeb ? 'rounded-2xl' : 'rounded-t-2xl';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      presentationStyle={Platform.OS === 'ios' ? 'overFullScreen' : undefined}
      statusBarTranslucent={Platform.OS === 'android'}
      onRequestClose={onClose}
    >
      <Animated.View
        style={[StyleSheet.absoluteFillObject, styles.backdrop, { opacity: backdropOpacity }]}
        pointerEvents="box-none"
      >
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>

      <View style={styles.overlay} pointerEvents="box-none">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          pointerEvents="box-none"
          style={{ width: '100%', maxWidth: isWeb ? 448 : width }}
        >
          <Animated.View style={{ transform: [{ translateY: sheetTranslateY }], width: '100%' }}>
            <View
              style={{ maxHeight: height * 0.85 }}
              className={`border border-border bg-card p-4 shadow-lg ${sheetRadius}`}
            >
              <View className="mb-4 flex-row items-start justify-between gap-3">
                <Text className="flex-1 text-center font-display text-lg font-semibold text-foreground">
                  Add {memberName} to a Circle?
                </Text>
                <Pressable onPress={onClose} hitSlop={10} className="p-1 active:opacity-70">
                  <X size={22} color={Theme.colors.secondaryText} />
                </Pressable>
              </View>

              {circlesLoading ? (
                <View className="items-center py-8">
                  <ActivityIndicator color={Theme.colors.primary} />
                </View>
              ) : (
                <View className="relative overflow-hidden">
                  <ScrollView
                    ref={scrollRef}
                    style={{ maxHeight: Platform.OS === 'web' ? 360 : 320 }}
                    contentContainerStyle={{ paddingBottom: 12 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
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
                            <CircleGlyphIcon
                              iconKind={iconKind}
                              color={accent}
                              bg={iconBg}
                              size={18}
                            />
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
                        <View
                          className="gap-3 rounded-xl border border-border bg-background p-4"
                          onLayout={onCreateFormLayout}
                        >
                          <View className="flex-row items-center justify-between">
                            <Text
                              className="text-sm font-semibold"
                              style={{ color: Theme.colors.foreground }}
                            >
                              New Circle
                            </Text>
                            <Pressable onPress={resetCreateForm} hitSlop={8}>
                              <X size={16} color={Theme.colors.muted} />
                            </Pressable>
                          </View>
                          <TextInput
                            ref={newNameInputRef}
                            placeholder="Circle name..."
                            placeholderTextColor={Theme.colors.muted}
                            value={newName}
                            onChangeText={setNewName}
                            maxLength={40}
                            style={[
                              collectionFieldBg,
                              textFieldCaretStyle,
                              textFieldSingleLineStyle,
                              textFieldSingleLineDefaultHeightStyle,
                            ]}
                            className="rounded-xl border border-border px-3 py-3 text-sm text-foreground"
                          />
                          <TextInput
                            placeholder="Description (optional)"
                            placeholderTextColor={Theme.colors.muted}
                            value={newDesc}
                            onChangeText={setNewDesc}
                            maxLength={100}
                            multiline
                            style={[
                              collectionFieldBg,
                              textFieldCaretStyle,
                              textFieldMultilineStyle,
                            ]}
                            className="min-h-[44px] rounded-xl border border-border px-3 py-3 text-sm text-foreground"
                          />
                          <Text className="text-xs text-muted-foreground">Color</Text>
                          <View className="flex-row flex-wrap gap-2">
                            {CIRCLE_COLOR_PRESETS.map((c) => (
                              <Pressable
                                key={c}
                                onPress={() => setSelectedColor(c)}
                                className="h-7 w-7 rounded-full"
                                style={{
                                  backgroundColor: c,
                                  borderWidth: selectedColor === c ? 3 : 0,
                                  borderColor: Theme.colors.foreground,
                                }}
                              />
                            ))}
                          </View>
                          <Pressable
                            onPress={() => void handleCreateAndAssign()}
                            disabled={!newName.trim() || assignInFlight}
                            className={cn(
                              'items-center rounded-xl py-3',
                              newName.trim() && !assignInFlight
                                ? 'cursor-pointer bg-primary active:opacity-90'
                                : 'cursor-not-allowed bg-primary/40 opacity-50',
                            )}
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
                          onPress={openCreateForm}
                          disabled={assignInFlight}
                          className="flex-row items-center gap-3 rounded-xl border border-dashed border-border bg-background p-4 active:opacity-90"
                        >
                          <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
                            <Plus size={18} color={Theme.colors.primaryForeground} />
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
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
      <ModalToastLayer />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlay: {
    flex: 1,
    justifyContent: isWeb ? 'center' : 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: isWeb ? 0 : undefined,
  },
});
