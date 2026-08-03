import { useQuery } from '@tanstack/react-query';
import { ProfileApi } from '~/features/profile/api/profileApi';

export function useHeaderAvatar(userId: string | undefined, refreshKey: number) {
  return (
    useQuery({
      queryKey: ['shell-avatar', userId, refreshKey],
      queryFn: async () => {
        const profile = await ProfileApi.getProfile({ userId: userId! });
        return profile.avatarUrl ?? null;
      },
      enabled: Boolean(userId),
      staleTime: 60_000,
    }).data ?? null
  );
}
