import React from 'react';
import { CircleAlert } from 'lucide-react-native';
import BusinessSheetDialog from '~/features/business-account/ui/common/BusinessSheetDialog';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  businessName: string | null;
  targetLoading: boolean;
  canContinue: boolean;
  returnsToSearch: boolean;
  onStart: () => void;
  onBack: () => void;
};

function BusinessClaimPromptStep({
  businessName,
  targetLoading,
  canContinue,
  returnsToSearch,
  onStart,
  onBack,
}: Props) {
  return (
    <BusinessSheetDialog
      icon={<CircleAlert size={24} color={Theme.colors.warning} />}
      iconTone="warning"
      title={businessName ? `Is ${businessName} your business?` : 'Is this your business?'}
      message="Verify your business to manage its page, reply as your business, and get a verified badge."
      primaryLabel="Start verification"
      onPrimary={onStart}
      primaryLoading={targetLoading}
      primaryDisabled={!canContinue}
      secondaryLabel={returnsToSearch ? 'Back' : 'Not now'}
      onSecondary={onBack}
    />
  );
}

export default BusinessClaimPromptStep;
