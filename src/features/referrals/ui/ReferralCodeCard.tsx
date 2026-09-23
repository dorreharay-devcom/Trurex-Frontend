import React from 'react';
import { Text, View } from 'react-native';
import { Share2 } from 'lucide-react-native';
import { Button } from '~/shared/ui/primitives/Button';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  code: string | null;
  loading: boolean;
  totalReferrals: number;
  onShare: () => void;
};

function ReferralCodeCard({ code, loading, totalReferrals, onShare }: Props) {
  return (
    <View className="relative items-center gap-3 rounded-xl border border-border bg-card p-5">
      <View className="absolute right-3 top-3 rounded-full border border-border/80 bg-border/40 px-2 py-1">
        <Text className="text-xs font-medium text-muted-foreground">{totalReferrals} joined</Text>
      </View>

      <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Your referral code
      </Text>
      {code ? (
        <Text className="text-2xl font-bold tracking-widest text-foreground">{code}</Text>
      ) : !loading ? (
        <Text className="text-center text-sm text-muted-foreground">
          Your code is being set up — check back soon.
        </Text>
      ) : null}
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
