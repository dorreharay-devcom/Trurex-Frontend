import React from 'react';
import { Text, View } from 'react-native';
import { Clock } from 'lucide-react-native';
import { BUSINESS_CLAIM_PENDING_MESSAGE } from '~/features/business-account/config/copy';
import { Theme } from '~/shared/theme/Theme';
import { liveRegionA11y } from '~/shared/lib/a11y';

function BusinessClaimPendingNotice() {
  return (
    <View
      className="flex-row gap-3 rounded-xl border border-border bg-accent px-4 py-3.5"
      {...liveRegionA11y(`Verification pending. ${BUSINESS_CLAIM_PENDING_MESSAGE}`)}
    >
      <Clock size={20} color={Theme.colors.accentForeground} />
      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="text-sm font-medium text-foreground">Verification pending</Text>
        <Text className="text-xs leading-relaxed text-muted-foreground">
          {BUSINESS_CLAIM_PENDING_MESSAGE}
        </Text>
      </View>
    </View>
  );
}

export default BusinessClaimPendingNotice;
