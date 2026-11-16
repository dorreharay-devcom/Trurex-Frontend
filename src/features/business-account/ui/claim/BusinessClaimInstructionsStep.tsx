import React from 'react';
import { Text, View } from 'react-native';
import { Mail } from 'lucide-react-native';
import { CLAIM_VERIFICATION_STEPS } from '~/features/business-account/config/claim';
import BusinessSheetDialog from '~/features/business-account/ui/common/BusinessSheetDialog';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  submitting: boolean;
  onProceed: () => void;
  onBack: () => void;
};

function BusinessClaimInstructionsStep({ submitting, onProceed, onBack }: Props) {
  return (
    <BusinessSheetDialog
      icon={<Mail size={22} color={Theme.colors.primary} />}
      title="How verification works"
      primaryLabel="Proceed"
      onPrimary={onProceed}
      primaryLoading={submitting}
      secondaryLabel="Back"
      onSecondary={onBack}
    >
      <View className="mb-4 gap-3">
        {CLAIM_VERIFICATION_STEPS.map((step, index) => (
          <View key={step} className="flex-row gap-3">
            <View className="h-6 w-6 items-center justify-center rounded-full bg-accent">
              <Text className="text-xs font-semibold text-foreground">{index + 1}</Text>
            </View>
            <Text className="min-w-0 flex-1 text-sm leading-relaxed text-foreground">{step}</Text>
          </View>
        ))}
      </View>
    </BusinessSheetDialog>
  );
}

export default BusinessClaimInstructionsStep;
