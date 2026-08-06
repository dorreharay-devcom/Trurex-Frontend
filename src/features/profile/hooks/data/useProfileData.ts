import { useCallback, useEffect, useState } from 'react';
import { ProfileApi } from '~/features/profile/api/profileApi';
import type { ProfileData } from '~/features/profile/types/profile';
import { resolveIsOwnProfile, resolveProfileContentUserId } from '~/features/profile/lib/identity';

type Params = {
  propUserId?: string;
  propHandle?: string;
  authUserId?: string | null;
};

function isNotFoundError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '');
  return /not found/i.test(message);
}

export function useProfileData({ propUserId, propHandle, authUserId }: Params) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isError, setIsError] = useState(false);

  const viewingByHandle = Boolean(propHandle);
  const viewingByUserId = Boolean(propUserId);

  const fetchProfile = useCallback(async () => {
    const targetId = propUserId || authUserId;
    if (!targetId && !propHandle) {
      setLoading(false);
      return;
    }
    setIsError(false);
    try {
      const data = await ProfileApi.getProfile(
        propHandle ? { handle: propHandle } : { userId: targetId! },
      );
      if (!data.userId) {
        setNotFound(true);
        setProfile(null);
        return;
      }
      setProfile(data);
      setNotFound(false);
    } catch (error) {
      setProfile(null);
      if (isNotFoundError(error)) {
        setNotFound(true);
        setIsError(false);
      } else {
        setNotFound(false);
        setIsError(true);
      }
    } finally {
      setLoading(false);
    }
  }, [propUserId, propHandle, authUserId]);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setIsError(false);
    setProfile(null);
  }, [propUserId, propHandle]);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const isOwnProfile = resolveIsOwnProfile({
    profile,
    propUserId,
    propHandle,
    authUserId,
  });

  const profileContentUserId = resolveProfileContentUserId({
    profile,
    propUserId,
    propHandle,
    authUserId,
  });

  const awaitingHandleProfile = viewingByHandle && profile == null && !notFound && !isError;

  return {
    profile,
    loading,
    notFound,
    isError,
    awaitingHandleProfile,
    isOwnProfile,
    profileContentUserId,
    viewingByUserId,
    fetchProfile,
    beginLoading: () => setLoading(true),
    followTargetId: profile?.userId ?? propUserId ?? '',
  };
}
