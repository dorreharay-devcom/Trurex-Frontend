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
import { fetchTrustedUsers, fetchUserFollowers, fetchUserFollowing } from '~/api/usersApi';
import { useAuth } from '~/services/AuthContext';
import {
  mapApiCirclesToTabRows,
  parseCircleAccentHex,
  sortCirclesForTabList,
} from '~/utils/recommendation/recCircles';
import {
  CIRCLE_COLOR_PRESETS,
  type CirclePresetColor,
  confirmDeleteCircle,
  selectFollowersNotFollowedBack,
} from '~/utils/circleTabUtils';
import { toastError, toastSuccess } from '~/utils/appToast';
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

  const { data: circles = [], isLoading, isError } = useMyCircles(!!user && isActive);
  const sortedCircles = useMemo(() => sortCirclesForTabList(circles), [circles]);
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
    if (!selectedCircleId) setShowEditModal(false);
  }, [selectedCircleId]);

  const detailOpen = !!user && isActive && !!selectedCircleId;
  const connectionsEnabled = !!user && isActive;

  const { data: members = [] } = useQuery({
    queryKey: ['circleMembers', selectedCircleId],
    queryFn: () => fetchCircleMembers(selectedCircleId!),
    enabled: detailOpen,
  });

  const memberIdSet = useMemo(() => new Set(members.map((m) => m.user_id)), [members]);

  const { data: trustedRows = [], isLoading: trustedLoading } = useQuery({
    queryKey: ['circleConnections', 'trusted', user?.id],
    queryFn: () => fetchTrustedUsers(user!.id),
    enabled: connectionsEnabled && !!user?.id,
  });

  const { data: followingAll = [], isLoading: followingLoading } = useQuery({
    queryKey: ['circleConnections', 'following', user?.id],
    queryFn: () => fetchUserFollowing(user!.id),
    enabled: connectionsEnabled && !!user?.id,
  });

  const { data: followerRows = [], isLoading: followersLoading } = useQuery({
    queryKey: ['circleConnections', 'followers', user?.id],
    queryFn: () => fetchUserFollowers(user!.id),
    enabled: connectionsEnabled && !!user?.id,
  });

  const followersNotFollowedBack = useMemo(
    () => selectFollowersNotFollowedBack(followerRows, followingAll),
    [followerRows, followingAll],
  );

  const loadingFollowBackLists = followingLoading || followersLoading;

  const addMemberMutation = useMutation({
    mutationFn: async (vars: { circleId: string; userId: string }) => {
      setAddingMemberId(vars.userId);
      await addCircleMember(vars.circleId, vars.userId);
    },
    onSuccess: (_, v) => {
      queryClient.invalidateQueries({ queryKey: ['circleMembers', v.circleId] });
      toastSuccess('Added to circle');
    },
    onError: (e: Error) => toastError('Could not add to circle', e.message),
    onSettled: () => setAddingMemberId(null),
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (vars: { circleId: string; userId: string }) => {
      setRemovingMemberId(vars.userId);
      await removeCircleMember(vars.circleId, vars.userId);
    },
    onSuccess: (_, v) => {
      queryClient.invalidateQueries({ queryKey: ['circleMembers', v.circleId] });
      toastSuccess('Removed from circle');
    },
    onError: (e: Error) => toastError('Could not remove from circle', e.message),
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
    onError: (e: Error) => toastError('Could not create circle', e.message),
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

  const openEditSheet = useCallback(() => {
    if (!selectedCircle) return;
    setEditName(selectedCircle.name);
    setEditDesc(selectedCircle.description ?? '');
    setEditColor(parseCircleAccentHex(selectedCircle) ?? PRESET_DEFAULT);
    setShowEditModal(true);
  }, [selectedCircle]);

  const requestDeleteCircle = useCallback(() => {
    confirmDeleteCircle(() => deleteMutation.mutate());
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
    memberIdSet,
    trustedRows,
    trustedLoading,
    followerRows,
    followersLoading,
    followersNotFollowedBack,
    loadingFollowBackLists,
    addingMemberId,
    removingMemberId,
    createMutation,
    updateMutation,
    deleteMutation,
    addMemberMutation,
    openEditSheet,
    requestDeleteCircle,
    addToSelectedCircle,
    removeFromSelectedCircle,
    colorPresets: CIRCLE_COLOR_PRESETS,
  };
}

export type CirclesViewModel = ReturnType<typeof useCirclesViewModel>;
