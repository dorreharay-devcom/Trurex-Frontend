import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Check, Copy, Share2 } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { ProfileApi } from '~/api/ProfileApi';
import { useAuth } from '~/features/auth/providers';
import { CIRCLES_QUERY_KEYS } from '~/features/circles/config/queryKeys';
import { Theme } from '~/shared/theme/Theme';
import { toastSuccess } from '~/utils/appToast';
import { buildProfileShareUrl, profileShareSlug } from '~/utils/profileShareUrl';
import { cn } from '~/utils/general';

const COPIED_RESET_MS = 2000;

type Props = { isActive: boolean };

const ShareProfileCard = ({ isActive }: Props) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const { data: profileData } = useQuery({
    queryKey: [CIRCLES_QUERY_KEYS.profileShare, user?.id],
    queryFn: () => ProfileApi.getProfile({ userId: user!.id }),
    enabled: !!user?.id && isActive,
  });

  const shareUrl = useMemo(() => {
    if (!profileData?.userId) return '';
    return buildProfileShareUrl(profileShareSlug(profileData));
  }, [profileData]);

  const copyLink = async () => {
    if (!shareUrl) return;
    await Clipboard.setStringAsync(shareUrl);
    toastSuccess('Profile link copied!');
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_RESET_MS);
  };

  if (!user) return null;

  return (
    <View className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm">
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
          <Share2 size={20} color={Theme.colors.accentForeground} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-sm font-semibold text-foreground">Share your profile</Text>
          <Text className="mt-0.5 text-xs text-muted-foreground">
            Set a username to get your link
          </Text>
        </View>
        <Pressable
          onPress={() => void copyLink()}
          disabled={!shareUrl}
          className={cn(
            'flex-row items-center gap-1.5 rounded-lg border px-3 py-2 active:opacity-90',
            shareUrl ? 'border-border bg-background' : 'border-border opacity-50',
          )}
        >
          {copied ? (
            <Check size={14} color={Theme.colors.primary} />
          ) : (
            <Copy size={14} color={Theme.colors.foreground} />
          )}
          <Text className="text-xs font-medium text-foreground">
            {copied ? 'Copied' : 'Copy link'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ShareProfileCard;
