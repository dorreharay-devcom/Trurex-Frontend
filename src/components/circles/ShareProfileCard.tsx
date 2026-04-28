import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Check, Copy, Share2 } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { fetchPublicUserById } from '~/api/usersApi';
import { useAuth } from '~/services/AuthContext';
import { Theme } from '~/theme/Theme';
import { toastSuccess } from '~/utils/appToast';

const PUBLIC_APP_ORIGIN = 'https://trurex.netlify.app';

type Props = { isActive: boolean };

export function ShareProfileCard({ isActive }: Props) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const { data: publicUser } = useQuery({
    queryKey: ['shareProfile', 'publicUser', user?.id],
    queryFn: () => fetchPublicUserById(user!.id),
    enabled: !!user?.id && isActive,
  });

  const shareUrl = user?.id ? `${PUBLIC_APP_ORIGIN}/user/${user.id}` : '';
  const hasHandle = Boolean(publicUser?.handle?.trim());

  const copyLink = async () => {
    if (!shareUrl) return;
    await Clipboard.setStringAsync(shareUrl);
    toastSuccess('Profile link copied!');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          {!hasHandle ? (
            <Text className="mt-0.5 text-xs text-muted-foreground">
              Set a username to get your link
            </Text>
          ) : (
            <Text className="mt-0.5 text-xs text-muted-foreground" numberOfLines={1}>
              @{publicUser!.handle}
            </Text>
          )}
        </View>
        <Pressable
          onPress={() => void copyLink()}
          disabled={!shareUrl}
          className={`flex-row items-center gap-1.5 rounded-lg border px-3 py-2 active:opacity-90 ${
            shareUrl ? 'border-border bg-background' : 'border-border opacity-50'
          }`}
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
}
