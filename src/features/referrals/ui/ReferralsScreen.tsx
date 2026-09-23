import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { webContainerStyle } from '~/shared/lib/ui/styles';
import QueryErrorState from '~/shared/ui/query/QueryErrorState';
import { useReferralInfo } from '~/features/referrals/hooks/useReferralInfo';
import { useReferralShare } from '~/features/referrals/hooks/useReferralShare';
import ReferralCodeCard from '~/features/referrals/ui/ReferralCodeCard';
import ReferredUsersList from '~/features/referrals/ui/ReferredUsersList';

type Props = {
  onBack: () => void;
  onUserPress: (userId: string) => void;
};

function ReferralsScreen({ onBack, onUserPress }: Props) {
  const info = useReferralInfo();
  const { shareReferralCode } = useReferralShare();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={webContainerStyle}
      contentContainerClassName="p-4 pb-40"
    >
      <View className="mb-4 flex-row items-center gap-3">
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft size={20} color={Theme.colors.foreground} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-foreground">Referrals</Text>
      </View>

      {info.isError ? (
        <QueryErrorState title="Couldn't load referrals" onRetry={() => void info.refetch()} />
      ) : (
        <View className="gap-4">
          <ReferralCodeCard
            code={info.referralCode}
            loading={info.isLoading}
            totalReferrals={info.totalReferrals}
            onShare={() => {
              if (info.referralCode) void shareReferralCode(info.referralCode);
            }}
          />
          <ReferredUsersList
            users={info.referredUsers}
            loading={info.isLoading}
            onUserPress={onUserPress}
          />
        </View>
      )}
    </ScrollView>
  );
}

export default ReferralsScreen;
