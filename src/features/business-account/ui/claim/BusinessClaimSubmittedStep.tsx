import React from 'react';
import { MailCheck } from 'lucide-react-native';
import BusinessSheetDialog from '~/features/business-account/ui/common/BusinessSheetDialog';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  onDone: () => void;
};

function BusinessClaimSubmittedStep({ onDone }: Props) {
  return (
    <BusinessSheetDialog
      icon={<MailCheck size={22} color={Theme.colors.primary} />}
      title="Check your email"
      message="We’ve sent you instructions on where and how to submit your verification documents. We’ll let you know once your business is verified."
      primaryLabel="Done"
      onPrimary={onDone}
    />
  );
}

export default BusinessClaimSubmittedStep;
