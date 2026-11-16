import React, { type ReactNode } from 'react';
import BusinessSheetDialog, {
  type BusinessDialogTone,
} from '~/features/business-account/ui/common/BusinessSheetDialog';
import BottomSheet from '~/shared/ui/overlay/BottomSheet';

type Props = {
  open: boolean;
  icon: ReactNode;
  iconTone?: BusinessDialogTone;
  title: string;
  message: string;
  onClose: () => void;
};

function BusinessInfoSheet({ open, icon, iconTone, title, message, onClose }: Props) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <BusinessSheetDialog
        icon={icon}
        iconTone={iconTone}
        title={title}
        message={message}
        primaryLabel="Got it"
        onPrimary={onClose}
      />
    </BottomSheet>
  );
}

export default BusinessInfoSheet;
