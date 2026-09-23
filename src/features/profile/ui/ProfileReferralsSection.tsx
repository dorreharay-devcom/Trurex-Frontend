import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { useReferralInfo } from '~/features/referrals/hooks/useReferralInfo';

function referralSubtitle(total: number): string {
  if (total === 0) return 'Share your referral code';
  if (total === 1) return '1 friend joined';
  return `${total} friends joined`;
}

type Props = {
  onPress: () => void;
};

function ProfileReferralsSection({ onPress }: Props) {
  const { totalReferrals } = useReferralInfo();

  return (
    <View className="px-4 pb-1 pt-3">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Referrals"
        className="flex-row items-center justify-between rounded-xl border border-border bg-background px-4 py-3.5"
      >
        <View className="min-w-0 flex-1 gap-0.5">
          <Text className="text-sm font-medium text-foreground">Invite friends, earn rewards</Text>
          <Text className="text-xs text-muted-foreground">{referralSubtitle(totalReferrals)}</Text>
        </View>
        <ChevronRight size={18} color={Theme.colors.muted} />
      </TouchableOpacity>
    </View>
  );
}

export default ProfileReferralsSection;
