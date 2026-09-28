import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Check, Copy, Share2 } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Button } from '~/shared/ui/primitives/Button';
import { Theme } from '~/shared/theme/Theme';
import { toastSuccess } from '~/shared/lib/appToast';

const COPIED_RESET_MS = 2000;

type Props = {
  code: string | null;
  loading: boolean;
  onShare: () => void;
};

function ReferralCodeCard({ code, loading, onShare }: Props) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    if (!code) return;
    await Clipboard.setStringAsync(code);
    toastSuccess('Code copied!');
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_RESET_MS);
  };

  return (
    <View className="gap-3">
      <View className="gap-1 rounded-2xl bg-border/40 p-4">
        <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Your referral code
        </Text>
        {code ? (
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold tracking-widest text-foreground">{code}</Text>
            <Pressable
              onPress={() => void copyCode()}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Copy referral code"
              className="flex-row items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 active:opacity-70"
            >
              {copied ? (
                <Check size={14} color={Theme.colors.primary} />
              ) : (
                <Copy size={14} color={Theme.colors.foreground} />
              )}
              <Text className="text-sm font-medium text-foreground">
                {copied ? 'Copied' : 'Copy'}
              </Text>
            </Pressable>
          </View>
        ) : !loading ? (
          <Text className="text-sm text-muted-foreground">
            Your code is being set up — check back soon.
          </Text>
        ) : null}
      </View>

      <Button
        title="Invite friends"
        onPress={onShare}
        disabled={!code}
        icon={<Share2 size={16} color={Theme.colors.primaryForeground} />}
        className="w-full"
      />
    </View>
  );
}

export default ReferralCodeCard;
