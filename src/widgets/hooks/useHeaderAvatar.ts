import { useQuery } from '@tanstack/react-query';
import { ProfileApi } from '~/features/profile/api/profileApi';

export function shellAvatarQueryKey(userId: string) {
  return ['shell-avatar', userId] as const;
}

export function useHeaderAvatar(userId: string | undefined) {
  return (
    useQuery({
      queryKey: userId ? shellAvatarQueryKey(userId) : ['shell-avatar', 'anon'],
      queryFn: async () => {
        const profile = await ProfileApi.getProfile({ userId: userId! });
        return profile.avatarUrl ?? null;
      },
      enabled: Boolean(userId),
      staleTime: 60_000,
    }).data ?? null
  );
}
