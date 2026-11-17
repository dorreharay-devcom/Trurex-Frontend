import React from 'react';
import { Text, View } from 'react-native';
import { Store } from 'lucide-react-native';
import type { BusinessProfile } from '~/features/business-account/types/businessProfile';
import { USER_AVATARS_BUCKET } from '~/shared/config/app';
import { Theme } from '~/shared/theme/Theme';
import { avatarImageTransform } from '~/shared/lib/media/imageTransform';
import SignedStorageImage from '~/shared/ui/media/SignedStorageImage';
import { Button, ButtonVariant } from '~/shared/ui/primitives/Button';
import { VerifiedBadge } from '~/shared/ui/primitives/VerifiedBadge';

const PHOTO_TRANSFORM = avatarImageTransform(64);

type Props = {
  profile: BusinessProfile | null;
  onEdit: () => void;
};

function MyBusinessProfileCard({ profile, onEdit }: Props) {
  const photoPath = profile?.photoPath ?? null;

  return (
    <View className="gap-3 rounded-xl border border-border bg-background p-4">
      <View className="flex-row items-center gap-3">
        <View className="h-16 w-16 overflow-hidden rounded-xl border border-border bg-accent">
          {photoPath ? (
            <SignedStorageImage
              bucket={USER_AVATARS_BUCKET}
              storagePath={photoPath}
              className="absolute inset-0"
              imageTransform={PHOTO_TRANSFORM}
              recyclingKey={photoPath}
              accessibilityLabel="Business photo"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Store size={24} color={Theme.colors.accentForeground} />
            </View>
          )}
        </View>
        <View className="min-w-0 flex-1 gap-1">
          {profile?.businessName ? (
            <Text
              className="font-display text-base font-semibold text-foreground"
              numberOfLines={1}
            >
              {profile.businessName}
            </Text>
          ) : null}
          <View className="flex-row items-center gap-1.5">
            <VerifiedBadge size={16} business />
            <Text className="text-xs font-medium text-muted-foreground">Verified business</Text>
          </View>
        </View>
      </View>
      <Text className="text-sm leading-relaxed text-foreground">
        {profile?.description ?? 'Add a description so people know what your business offers.'}
      </Text>
      <Button title="Edit business profile" variant={ButtonVariant.Secondary} onPress={onEdit} />
    </View>
  );
}

export default MyBusinessProfileCard;
