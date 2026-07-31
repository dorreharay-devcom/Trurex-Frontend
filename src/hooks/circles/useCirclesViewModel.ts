import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  addCircleMember,
  createCircle,
  deleteCircle,
  fetchCircleMembers,
  removeCircleMember,
  updateCircle,
} from '~/api/circlesApi';
import { filterOneWayFollowing } from '~/api/usersApi';
import { useConnectionUsers } from '~/hooks/circles/useScopedConnectionUserSearch';
import { useAuth } from '~/features/auth/providers';
import {
  mapApiCirclesToTabRows,
  parseCircleAccentHex,
  sortCirclesForRingStack,
} from '~/shared/lib/recCircles';
import { CIRCLE_COLOR_PRESETS, type CirclePresetColor } from '~/utils/circleTabUtils';
import { toastError, toastSuccess } from '~/utils/appToast';
import { didAccountFrozenMutationToast } from '~/utils/mutationRestrictionError';
import { unknownErrorMessage } from '~/utils';
import { useMyCircles } from '~/hooks/useMyCircles';

const PRESET_DEFAULT: CirclePresetColor = CIRCLE_COLOR_PRESETS[0];

export function useCirclesViewModel(isActive: boolean) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedColor, setSelectedColor] = useState<CirclePresetColor>(PRESET_DEFAULT);
  const [selectedCircleId, setSelectedCircleId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editColor, setEditColor] = useState<string>(PRESET_DEFAULT);
  const [addingMemberId, setAddingMemberId] = useState<string | null>(null);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [showDeleteCircleModal, setShowDeleteCircleModal] = useState(false);

  const { data: circles = [], isLoading, isError } = useMyCircles(!!user && isActive);
  const sortedCircles = useMemo(() => sortCirclesForRingStack(circles), [circles]);
  const tabRows = useMemo(() => mapApiCirclesToTabRows(sortedCircles), [sortedCircles]);

  const selectedCircle = useMemo(
    () => (selectedCircleId ? circles.find((c) => c.id === selectedCircleId) : undefined),
    [circles, selectedCircleId],
  );
  const selectedTab = useMemo(
    () => (selectedCircleId ? tabRows.find((r) => r.id === selectedCircleId) : undefined),
    [tabRows, selectedCircleId],
  );

  useEffect(() => {
    if (selectedCircleId && !isLoading && circles.length > 0 && !selectedCircle) {
      setSelectedCircleId(null);
    }
  }, [selectedCircleId, isLoading, circles, selectedCircle]);

  useEffect(() => {
    if (!selectedCircleId) {
      setShowEditModal(false);
      setShowDeleteCircleModal(false);
    }
  }, [selectedCircleId]);

  const detailOpen = !!user && isActive && !!selectedCircleId;
  const connectionsEnabled = !!user && isActive;

  const trustedConnection = useConnectionUsers('trusted', user?.id, connectionsEnabled);

  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ['circleMembers', selectedCircleId],
    queryFn: () => fetchCircleMembers(selectedCircleId!),
    enabled: detailOpen && !!selectedCircleId,
  });

  const followerConnection = useConnectionUsers('followers', user?.id, connectionsEnabled);

  const followingConnection = useConnectionUsers('following', user?.id, connectionsEnabled);
  const trustedRows = trustedConnection.rows;
  const followerRows = followerConnection.rows;
  const followingAll = followingConnection.rows;

  const memberIdSet = useMemo(() => new Set(members.map((m) => m.user_id)), [members]);

  const followingOneWay = useMemo(() => filterOneWayFollowing(followingAll), [followingAll]);

  const addMemberMutation = useMutation({
    mutationFn: async (vars: { circleId: string; userId: string }) => {
      setAddingMemberId(vars.userId);
      await addCircleMember(vars.circleId, vars.userId);
    },
    onSuccess: (_, v) => {
      queryClient.invalidateQueries({ queryKey: ['circleMembers', v.circleId] });
      queryClient.invalidateQueries({ queryKey: ['myCircles'] });
      toastSuccess('Added to circle');
    },
    onError: (e: unknown) => {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Could not add to circle', unknownErrorMessage(e, 'Try again.'));
    },
    onSettled: () => setAddingMemberId(null),
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (vars: { circleId: string; userId: string }) => {
      setRemovingMemberId(vars.userId);
      await removeCircleMember(vars.circleId, vars.userId);
    },
    onSuccess: (_, v) => {
      queryClient.invalidateQueries({ queryKey: ['circleMembers', v.circleId] });
      queryClient.invalidateQueries({ queryKey: ['myCircles'] });
      toastSuccess('Removed from circle');
    },
    onError: (e: unknown) => {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Could not remove from circle', unknownErrorMessage(e, 'Try again.'));
    },
    onSettled: () => setRemovingMemberId(null),
  });

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
      setSelectedColor(PRESET_DEFAULT);
    },
    onError: (e: unknown) => {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Could not create circle', unknownErrorMessage(e, 'Try again.'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!selectedCircle) throw new Error('No circle');
      return updateCircle({
        input_circle_id: selectedCircle.id,
        input_name: editName.trim(),
        input_description: editDesc.trim(),
        input_color: editColor,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCircles'] });
      setShowEditModal(false);
      toastSuccess('Circle updated');
    },
    onError: (e: unknown) => {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Could not update circle', unknownErrorMessage(e, 'Try again.'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!selectedCircle) throw new Error('No circle');
      return deleteCircle(selectedCircle.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCircles'] });
      setShowDeleteCircleModal(false);
      setSelectedCircleId(null);
      toastSuccess('Circle deleted');
    },
    onError: (e: unknown) => {
      if (didAccountFrozenMutationToast(e)) return;
      setShowDeleteCircleModal(false);
      toastError('Could not delete circle', unknownErrorMessage(e, 'Try again.'));
    },
  });

  const openEditSheet = useCallback(() => {
    if (!selectedCircle) return;
    setEditName(selectedCircle.name);
    setEditDesc(selectedCircle.description ?? '');
    setEditColor(parseCircleAccentHex(selectedCircle) ?? PRESET_DEFAULT);
    setShowEditModal(true);
  }, [selectedCircle]);

  const requestDeleteCircle = useCallback(() => {
    setShowDeleteCircleModal(true);
  }, []);

  const dismissDeleteCircleModal = useCallback(() => {
    if (!deleteMutation.isPending) setShowDeleteCircleModal(false);
  }, [deleteMutation.isPending]);

  const commitDeleteCircle = useCallback(() => {
    deleteMutation.mutate();
  }, [deleteMutation]);

  const addToSelectedCircle = useCallback(
    (userId: string) => {
      if (!selectedCircleId) return;
      addMemberMutation.mutate({ circleId: selectedCircleId, userId });
    },
    [addMemberMutation, selectedCircleId],
  );

  const removeFromSelectedCircle = useCallback(
    (userId: string) => {
      if (!selectedCircleId) return;
      removeMemberMutation.mutate({ circleId: selectedCircleId, userId });
    },
    [removeMemberMutation, selectedCircleId],
  );

  return {
    user,
    isActive,
    circles,
    tabRows,
    isLoading,
    isError,
    selectedCircleId,
    setSelectedCircleId,
    selectedCircle,
    selectedTab,
    showCreate,
    setShowCreate,
    newName,
    setNewName,
    newDesc,
    setNewDesc,
    selectedColor,
    setSelectedColor,
    showEditModal,
    setShowEditModal,
    editName,
    setEditName,
    editDesc,
    setEditDesc,
    editColor,
    setEditColor,
    members,
    membersLoading,
    memberIdSet,
    trustedRows,
    trustedLoading: trustedConnection.isInitialLoading,
    trustedHasNextPage: trustedConnection.hasNextPage,
    trustedFetchingNextPage: trustedConnection.isFetchingNextPage,
    fetchNextTrustedPage: trustedConnection.fetchNextPage,
    followerRows,
    followersLoading: followerConnection.isInitialLoading,
    followersHasNextPage: followerConnection.hasNextPage,
    followersFetchingNextPage: followerConnection.isFetchingNextPage,
    fetchNextFollowersPage: followerConnection.fetchNextPage,
    followingRows: followingAll,
    followingOneWay,
    followingLoading: followingConnection.isInitialLoading,
    followingHasNextPage: followingConnection.hasNextPage,
    followingFetchingNextPage: followingConnection.isFetchingNextPage,
    fetchNextFollowingPage: followingConnection.fetchNextPage,
    addingMemberId,
    removingMemberId,
    createMutation,
    updateMutation,
    deleteMutation,
    addMemberMutation,
    openEditSheet,
    showDeleteCircleModal,
    requestDeleteCircle,
    dismissDeleteCircleModal,
    commitDeleteCircle,
    addToSelectedCircle,
    removeFromSelectedCircle,
    colorPresets: CIRCLE_COLOR_PRESETS,
  };
}

export type CirclesViewModel = ReturnType<typeof useCirclesViewModel>;
