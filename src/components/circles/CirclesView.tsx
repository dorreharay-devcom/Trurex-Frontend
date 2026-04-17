import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import * as Clipboard from 'expo-clipboard';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Copy,
  Globe,
  Heart,
  Lock,
  Pencil,
  Plus,
  Share2,
  Trash2,
  Users,
  X,
} from 'lucide-react-native';
import {
  createCircle,
  deleteCircle,
  updateCircle,
  type CircleApiRow,
  type CircleMemberProfile,
} from '~/api/circlesApi';
import { useAuth } from '~/services/AuthContext';
import { Backend } from '~/services/AuthService';
import { Theme } from '~/theme/Theme';
import {
  mapApiCirclesToTabRows,
  parseCircleAccentHex,
  type CircleTabIconKind,
  type CircleTabRow,
} from '~/utils/recommendation/circlePresentation';
import { useMyCircles } from '~/hooks/useMyCircles';
import { toastError, toastSuccess } from '~/utils/appToast';
import { isWeb } from '~/utils';

const PRESET_SWATCHES = [
  '#9333ea',
  '#ec4899',
  '#38bdf8',
  '#14b8a6',
  '#ea580c',
  '#ef4444',
  '#2563eb',
  '#ca8a04',
];

function joinOrigin(): string {
  if (isWeb && typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'https://trurex.com';
}

/** User-created circles only (`system_kind` null); owner may edit/delete per RPC contract. */
function canEditOrDeleteUserCircle(circle: CircleApiRow, userId: string | undefined): boolean {
  return !!userId && circle.owner_id === userId && circle.system_kind === null;
}

function CircleGlyphIcon({
  iconKind,
  color,
  bg,
  size = 20,
  large,
}: {
  iconKind: CircleTabIconKind;
  color: string;
  bg: string;
  size?: number;
  /** Larger square (e.g. detail header). */
  large?: boolean;
}) {
  const Icon =
    iconKind === 'lock'
      ? Lock
      : iconKind === 'heart'
        ? Heart
        : iconKind === 'users'
          ? Users
          : Globe;
  return (
    <View
      className={`${large ? 'h-12 w-12' : 'h-11 w-11'} shrink-0 items-center justify-center rounded-xl`}
      style={{ backgroundColor: bg }}
    >
      <Icon size={size} color={color} />
    </View>
  );
}

type Props = {
  /** When false, circle queries stay disabled to avoid work off-tab. */
  isActive: boolean;
};

const CirclesView = ({ isActive }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_SWATCHES[0]);
  const [copied, setCopied] = useState(false);
  const [selectedCircleId, setSelectedCircleId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editColor, setEditColor] = useState(PRESET_SWATCHES[0]);

  const { data: circles = [], isLoading, isError } = useMyCircles(!!user && isActive);
  const tabRows = useMemo(() => mapApiCirclesToTabRows(circles), [circles]);

  const selectedCircle: CircleApiRow | undefined = useMemo(
    () => (selectedCircleId ? circles.find((c) => c.id === selectedCircleId) : undefined),
    [circles, selectedCircleId],
  );
  const selectedTab: CircleTabRow | undefined = useMemo(
    () => (selectedCircleId ? tabRows.find((r) => r.id === selectedCircleId) : undefined),
    [tabRows, selectedCircleId],
  );

  useEffect(() => {
    if (selectedCircleId && !isLoading && circles.length > 0 && !selectedCircle) {
      setSelectedCircleId(null);
    }
  }, [selectedCircleId, isLoading, circles, selectedCircle]);

  useEffect(() => {
    if (!selectedCircleId) setShowEditModal(false);
  }, [selectedCircleId]);

  /** No list-members API in contract yet — see `fetchCircleMembers` in circlesApi. */
  const members: CircleMemberProfile[] = [];

  const { data: handleRow } = useQuery({
    queryKey: ['userHandle', user?.id],
    queryFn: async () => {
      const { data, error } = await Backend.from('users')
        .select('handle')
        .eq('id', user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as { handle: string | null } | null;
    },
    enabled: !!user && isActive,
  });

  const rawHandle = handleRow?.handle?.trim() || '';
  const inviteUrl = rawHandle ? `${joinOrigin()}/join/${rawHandle}` : `${joinOrigin()}/signup`;

  const createMutation = useMutation({
    mutationFn: () =>
      createCircle({
        input_name: newName.trim(),
        input_description: newDesc.trim() || null,
        input_icon_url: null,
        input_color: selectedColor,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCircles'] });
      toastSuccess('Circle created');
      setShowCreate(false);
      setNewName('');
      setNewDesc('');
      setSelectedColor(PRESET_SWATCHES[0]);
    },
    onError: (e: Error) => toastError('Could not create circle', e.message),
  });

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!selectedCircle) throw new Error('No circle');
      return updateCircle({
        input_circle_id: selectedCircle.id,
        input_name: editName.trim(),
        input_description: editDesc.trim(),
        input_icon_url: editColor,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCircles'] });
      setShowEditModal(false);
      toastSuccess('Circle updated');
    },
    onError: (e: Error) => toastError('Could not update circle', e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!selectedCircle) throw new Error('No circle');
      return deleteCircle(selectedCircle.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCircles'] });
      setSelectedCircleId(null);
      toastSuccess('Circle deleted');
    },
    onError: (e: Error) => toastError('Could not delete circle', e.message),
  });

  const openEditSheet = () => {
    if (!selectedCircle) return;
    setEditName(selectedCircle.name);
    setEditDesc(selectedCircle.description ?? '');
    setEditColor(parseCircleAccentHex(selectedCircle) ?? PRESET_SWATCHES[0]);
    setShowEditModal(true);
  };

  const confirmDeleteCircle = () => {
    const message = 'This removes the circle and its memberships. This cannot be undone.';
    // react-native-web's Alert.alert often does not show a UI — use confirm on web.
    if (isWeb) {
      if (typeof window !== 'undefined' && window.confirm(`Delete circle?\n\n${message}`)) {
        deleteMutation.mutate();
      }
      return;
    }
    Alert.alert('Delete circle?', message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteMutation.mutate(),
      },
    ]);
  };

  const copyInviteLink = async () => {
    if (!rawHandle) return;
    try {
      await Clipboard.setStringAsync(inviteUrl);
      setCopied(true);
      toastSuccess('Profile link copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toastError('Copy failed', 'Try again.');
    }
  };

  if (selectedCircleId && selectedCircle && selectedTab) {
    const subtitle = selectedCircle.description?.trim() || selectedTab.subtitle;
    const memberLabel = members.length === 1 ? '1 member' : `${members.length} members`;
    const canManage = canEditOrDeleteUserCircle(selectedCircle, user?.id);

    return (
      <>
        <ScrollView
          className="flex-1"
          contentContainerClassName="p-4 pb-24"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-4 flex-row items-center justify-between gap-2">
            <Pressable
              onPress={() => setSelectedCircleId(null)}
              className="flex-row items-center gap-1.5 active:opacity-70"
            >
              <ArrowLeft size={16} color={Theme.colors.muted} />
              <Text className="text-sm text-muted-foreground">Back to circles</Text>
            </Pressable>
            {canManage ? (
              <View className="flex-row gap-2">
                <Pressable
                  onPress={openEditSheet}
                  className="flex-row items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 active:opacity-90"
                >
                  <Pencil size={14} color={Theme.colors.foreground} />
                  <Text className="text-xs font-medium text-foreground">Edit</Text>
                </Pressable>
                <Pressable
                  onPress={confirmDeleteCircle}
                  disabled={deleteMutation.isPending}
                  className="flex-row items-center gap-1 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 active:opacity-90"
                >
                  {deleteMutation.isPending ? (
                    <ActivityIndicator size="small" color={Theme.colors.destructive} />
                  ) : (
                    <>
                      <Trash2 size={14} color={Theme.colors.destructive} />
                      <Text
                        className="text-xs font-medium"
                        style={{ color: Theme.colors.destructive }}
                      >
                        Delete
                      </Text>
                    </>
                  )}
                </Pressable>
              </View>
            ) : null}
          </View>

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

          {members.length === 0 ? (
            <Text className="py-4 text-center text-sm text-muted-foreground">
              No members yet. Add people from your network below.
            </Text>
          ) : (
            <View className="mb-8 gap-2">
              {members.map((m) => (
                <View
                  key={m.user_id}
                  className="flex-row items-center gap-3 rounded-xl border border-border bg-card p-3"
                >
                  <View className="h-10 w-10 overflow-hidden rounded-lg bg-muted ring-2 ring-border">
                    {m.avatar_url ? (
                      <Image
                        source={{ uri: m.avatar_url }}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                      />
                    ) : (
                      <View className="h-full w-full items-center justify-center">
                        <Text className="text-sm font-bold text-muted-foreground">
                          {(m.display_name ?? '?')[0]?.toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="min-w-0 flex-1">
                    <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
                      {m.display_name ?? 'Unknown'}
                    </Text>
                    {m.handle ? (
                      <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                        @{m.handle}
                      </Text>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          )}

          <Text className="mb-4 text-base font-semibold text-foreground">
            Trusted <Text className="text-sm font-normal text-muted-foreground">(0)</Text>
          </Text>
          <View className="items-center py-8">
            <Text className="text-sm font-medium text-muted-foreground">No one is Trusted yet</Text>
            <Text className="mt-1 max-w-xs text-center text-xs text-muted-foreground">
              Follow people and when they follow you back, they will appear here.
            </Text>
          </View>
        </ScrollView>

        <Modal
          visible={showEditModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowEditModal(false)}
        >
          <View className="flex-1 justify-center bg-black/50 px-4">
            <View className="max-w-md self-center w-full rounded-xl border border-border bg-card p-4">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-base font-semibold text-foreground">Edit circle</Text>
                <Pressable
                  onPress={() => setShowEditModal(false)}
                  hitSlop={8}
                  className="p-1 active:opacity-70"
                >
                  <X size={20} color={Theme.colors.muted} />
                </Pressable>
              </View>
              <TextInput
                placeholder="Circle name..."
                placeholderTextColor={Theme.colors.muted}
                value={editName}
                onChangeText={setEditName}
                maxLength={40}
                className="mb-3 rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground"
              />
              <TextInput
                placeholder="Description (optional)"
                placeholderTextColor={Theme.colors.muted}
                value={editDesc}
                onChangeText={setEditDesc}
                maxLength={100}
                multiline
                className="mb-3 min-h-[44px] rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground"
              />
              <Text className="mb-2 text-xs text-muted-foreground">Color</Text>
              <View className="mb-4 flex-row flex-wrap gap-2">
                {PRESET_SWATCHES.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => setEditColor(c)}
                    className="h-7 w-7 rounded-full"
                    style={{
                      backgroundColor: c,
                      borderWidth: editColor === c ? 3 : 0,
                      borderColor: Theme.colors.foreground,
                    }}
                  />
                ))}
              </View>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => setShowEditModal(false)}
                  className="flex-1 items-center rounded-xl border border-border py-3 active:opacity-90"
                >
                  <Text className="text-sm font-medium text-foreground">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    if (!editName.trim() || updateMutation.isPending) return;
                    updateMutation.mutate();
                  }}
                  disabled={!editName.trim() || updateMutation.isPending}
                  className={`flex-1 items-center rounded-xl py-3 ${
                    editName.trim() && !updateMutation.isPending ? 'bg-primary' : 'bg-primary/40'
                  }`}
                >
                  {updateMutation.isPending ? (
                    <ActivityIndicator color={Theme.colors.primaryForeground} />
                  ) : (
                    <Text className="text-sm font-semibold text-primary-foreground">Save</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="p-4 pb-24"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Share profile */}
      <View className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-lg bg-accent">
            <Share2 size={20} color={Theme.colors.accentForeground} />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="text-sm font-semibold text-foreground">Share your profile</Text>
            <Text className="mt-0.5 text-xs text-muted-foreground" numberOfLines={1}>
              {rawHandle
                ? inviteUrl.replace(/^https?:\/\//, '')
                : 'Set a username to get your link'}
            </Text>
          </View>
          <Pressable
            onPress={copyInviteLink}
            disabled={!rawHandle}
            className={`flex-row items-center gap-1.5 rounded-lg border px-3 py-2 ${
              rawHandle
                ? 'border-border bg-background active:opacity-80'
                : 'border-border opacity-50'
            }`}
          >
            {copied ? (
              <Check size={14} color={Theme.colors.foreground} />
            ) : (
              <Copy size={14} color={Theme.colors.foreground} />
            )}
            <Text className="text-xs font-medium text-foreground">
              {copied ? 'Copied' : 'Copy Link'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* My Circles */}
      <Text className="mb-3 text-base font-semibold text-foreground">My Circles</Text>

      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-sm font-medium text-foreground">Trust Circles</Text>
        <Pressable
          onPress={() => setShowCreate((v) => !v)}
          className="flex-row items-center gap-1 rounded-lg bg-primary px-3 py-2 active:opacity-90"
        >
          <Plus size={14} color={Theme.colors.primaryForeground} />
          <Text className="text-xs font-semibold text-primary-foreground">New Circle</Text>
        </Pressable>
      </View>

      {showCreate && (
        <View className="mb-6 rounded-xl border border-border bg-card p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-foreground">Create a new circle</Text>
            <Pressable
              onPress={() => setShowCreate(false)}
              hitSlop={8}
              className="p-1 active:opacity-70"
            >
              <X size={16} color={Theme.colors.muted} />
            </Pressable>
          </View>
          <TextInput
            placeholder="Circle name..."
            placeholderTextColor={Theme.colors.muted}
            value={newName}
            onChangeText={setNewName}
            maxLength={40}
            className="mb-3 rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground"
          />
          <TextInput
            placeholder="Description (optional)"
            placeholderTextColor={Theme.colors.muted}
            value={newDesc}
            onChangeText={setNewDesc}
            maxLength={100}
            multiline
            className="mb-3 min-h-[44px] rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground"
          />
          <Text className="mb-2 text-xs text-muted-foreground">Color</Text>
          <View className="mb-4 flex-row flex-wrap gap-2">
            {PRESET_SWATCHES.map((c) => (
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
            onPress={() => {
              if (!newName.trim() || createMutation.isPending) return;
              createMutation.mutate();
            }}
            disabled={!newName.trim() || createMutation.isPending}
            className={`items-center rounded-xl py-3 ${
              newName.trim() && !createMutation.isPending ? 'bg-primary' : 'bg-primary/40'
            }`}
          >
            {createMutation.isPending ? (
              <ActivityIndicator color={Theme.colors.primaryForeground} />
            ) : (
              <Text className="text-sm font-semibold text-primary-foreground">Create Circle</Text>
            )}
          </Pressable>
        </View>
      )}

      {isLoading ? (
        <View className="items-center py-12">
          <ActivityIndicator color={Theme.colors.primary} />
        </View>
      ) : isError ? (
        <View className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <Text className="text-center text-sm text-foreground">
            Could not load circles. Check your connection and try again.
          </Text>
        </View>
      ) : tabRows.length === 0 ? (
        <View className="items-center py-12">
          <Users size={48} color={Theme.colors.muted} style={{ opacity: 0.45 }} />
          <Text className="mt-3 text-sm font-medium text-muted-foreground">No circles yet</Text>
          <Text className="mt-1 max-w-xs text-center text-xs text-muted-foreground">
            Create your first circle to organize your network.
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {tabRows.map((row) => (
            <Pressable
              key={row.id}
              onPress={() => setSelectedCircleId(row.id)}
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

      {/* Trusted — placeholder until mutual-follow API is wired */}
      <View className="mt-10">
        <Text className="mb-4 text-base font-semibold text-foreground">
          Trusted <Text className="text-sm font-normal text-muted-foreground">(0)</Text>
        </Text>
        <View className="items-center py-8">
          <Text className="text-sm text-muted-foreground">No one is Trusted yet</Text>
          <Text className="mt-1 max-w-xs text-center text-xs text-muted-foreground">
            Follow people and when they follow you back, they will appear here.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default CirclesView;
