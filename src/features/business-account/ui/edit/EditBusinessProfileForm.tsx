import React from 'react';
import { Text, View } from 'react-native';
import { TriangleAlert } from 'lucide-react-native';
import { BUSINESS_ADDRESS_CHANGE_WARNING } from '~/features/business-account/config/copy';
import { BUSINESS_DESCRIPTION_MAX_LENGTH } from '~/features/business-account/config/edit';
import { useEditBusinessProfileForm } from '~/features/business-account/hooks/useEditBusinessProfileForm';
import type { BusinessProfile } from '~/features/business-account/types/businessProfile';
import BusinessInfoSheet from '~/features/business-account/ui/common/BusinessInfoSheet';
import BusinessPremiumFieldsSection from '~/features/business-account/ui/edit/BusinessPremiumFieldsSection';
import EditBusinessHeader from '~/features/business-account/ui/edit/EditBusinessHeader';
import EditBusinessPhoto from '~/features/business-account/ui/edit/EditBusinessPhoto';
import LockedBusinessField from '~/features/business-account/ui/edit/LockedBusinessField';
import { Theme } from '~/shared/theme/Theme';
import { Input } from '~/shared/ui/primitives/Input';

type Props = {
  userId: string;
  initial: BusinessProfile;
  businessName: string | null;
  address: string | null;
  onClose: () => void;
};

function EditBusinessProfileForm({ userId, initial, businessName, address, onClose }: Props) {
  const form = useEditBusinessProfileForm({ userId, initial, onClose });

  return (
    <>
      <EditBusinessHeader
        onClose={onClose}
        onSave={form.save}
        saving={form.saving}
        canSave={form.canSave}
      />
      <View className="gap-6 px-4 py-6">
        <EditBusinessPhoto
          pendingPhoto={form.pendingPhoto}
          currentPhotoPath={form.currentPhotoPath}
          busy={form.picking || form.saving}
          onPick={form.pickPhoto}
        />
        <LockedBusinessField
          label="Business name"
          value={businessName}
          hint="Your business name can’t be changed."
        />
        <LockedBusinessField
          label="Address"
          value={address}
          hint="Tap to learn why the address is locked."
          onPress={form.openAddressWarning}
        />
        <Input
          label="Description"
          labelRight={
            <Text className="text-xs text-muted-foreground">
              {`${form.description.length}/${BUSINESS_DESCRIPTION_MAX_LENGTH}`}
            </Text>
          }
          value={form.description}
          onChangeText={form.setDescription}
          placeholder="Tell people what your business offers"
          maxLength={BUSINESS_DESCRIPTION_MAX_LENGTH}
          multiline
          editable={!form.saving}
        />
        <BusinessPremiumFieldsSection />
      </View>
      <BusinessInfoSheet
        open={form.addressWarningOpen}
        icon={<TriangleAlert size={22} color={Theme.colors.warning} />}
        iconTone="warning"
        title="Address can’t be edited"
        message={BUSINESS_ADDRESS_CHANGE_WARNING}
        onClose={form.closeAddressWarning}
      />
    </>
  );
}

export default EditBusinessProfileForm;
