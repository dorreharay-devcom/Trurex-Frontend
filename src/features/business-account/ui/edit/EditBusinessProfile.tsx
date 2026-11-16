import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Lock } from 'lucide-react-native';
import { EDIT_BUSINESS_STATUS } from '~/features/business-account/config/myBusinessPage';
import { useEditBusinessProfile } from '~/features/business-account/hooks/useEditBusinessProfile';
import BusinessPlaceholder from '~/features/business-account/ui/common/BusinessPlaceholder';
import EditBusinessHeader from '~/features/business-account/ui/edit/EditBusinessHeader';
import EditBusinessProfileForm from '~/features/business-account/ui/edit/EditBusinessProfileForm';
import { Theme } from '~/shared/theme/Theme';
import QueryErrorState from '~/shared/ui/query/QueryErrorState';

type Props = {
  onClose: () => void;
};

type Screen = ReturnType<typeof useEditBusinessProfile>;

function EditBusinessBody({ screen, onClose }: { screen: Screen } & Props) {
  if (screen.status === EDIT_BUSINESS_STATUS.loading) {
    return (
      <View className="h-96 items-center justify-center">
        <ActivityIndicator color={Theme.colors.primary} />
      </View>
    );
  }
  if (screen.status === EDIT_BUSINESS_STATUS.locked) {
    return (
      <>
        <EditBusinessHeader onClose={onClose} />
        <BusinessPlaceholder
          icon={<Lock size={22} color={Theme.colors.accentForeground} />}
          title="Editing unlocks after verification"
          message="Claim your business and complete verification to edit your business profile."
        />
      </>
    );
  }
  if (screen.status === EDIT_BUSINESS_STATUS.error || !screen.profile || !screen.userId) {
    return (
      <>
        <EditBusinessHeader onClose={onClose} />
        <QueryErrorState title="Couldn't load your business profile" onRetry={screen.retry} />
      </>
    );
  }
  return (
    <EditBusinessProfileForm
      key={screen.userId}
      userId={screen.userId}
      initial={screen.profile}
      businessName={screen.businessName}
      address={screen.address}
      onClose={onClose}
    />
  );
}

function EditBusinessProfile({ onClose }: Props) {
  const screen = useEditBusinessProfile();

  return (
    <View className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <EditBusinessBody screen={screen} onClose={onClose} />
    </View>
  );
}

export default EditBusinessProfile;
