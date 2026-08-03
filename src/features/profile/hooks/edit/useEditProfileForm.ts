import { useCallback, useEffect, useState } from 'react';
import { normalizeHandleInput } from '~/features/profile/lib/handle';
import type { CurrentlyData } from '~/features/profile/types/profile';
import { ProfileApi } from '~/features/profile/api/profileApi';

type Params = {
  userId?: string | null;
};

export function useEditProfileForm({ userId }: Params) {
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [handle, setHandleState] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [currently, setCurrently] = useState<CurrentlyData>({});
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void ProfileApi.getCurrentUser(userId)
      .then((data) => {
        if (cancelled) return;
        setDisplayName(data.display_name || '');
        setHandleState(normalizeHandleInput(data.handle));
        setBio(data.bio || '');
        setLocation(data.location || '');
        setCurrentAvatarUrl(data.avatar_url);
        setCurrently({
          binging: data.currently_binging || '',
          listening: data.currently_listening_to || '',
          reading: data.currently_reading || '',
        });
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const setHandle = useCallback((value: string) => {
    setHandleState(normalizeHandleInput(value));
  }, []);

  const setCurrentlyField = useCallback((key: keyof CurrentlyData, value: string) => {
    setCurrently((prev) => ({ ...prev, [key]: value }));
  }, []);

  return {
    loading,
    displayName,
    setDisplayName,
    handle,
    setHandle,
    bio,
    setBio,
    location,
    setLocation,
    currently,
    setCurrentlyField,
    currentAvatarUrl,
    setCurrentAvatarUrl,
  };
}
