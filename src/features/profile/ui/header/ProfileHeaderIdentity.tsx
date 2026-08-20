import React from 'react';
import { Text, View } from 'react-native';
import { CATEGORY_ICON_FALLBACK } from '~/shared/api/categories';
import type { RelationshipStatus } from '~/features/profile/types/profile';
import { RELATIONSHIP_STATUS } from '~/shared/config/relationshipStatus';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  displayName: string;
  handle: string;
  bio?: string | null;
  location?: string | null;
  relationshipStatus: RelationshipStatus;
  tierBadge?: React.ReactNode;
};

function RelationshipBadge({ status }: { status: RelationshipStatus }) {
  if (!status || status === RELATIONSHIP_STATUS.blocking) return null;
  const trusted = status === RELATIONSHIP_STATUS.trusted;
  return (
    <View
      className="rounded-full px-1.5 py-0.5"
      style={{
        backgroundColor: trusted ? Theme.colors.primary : Theme.colors.secondary,
      }}
    >
      <Text
        className="text-[10px] font-bold uppercase"
        style={{
          color: trusted ? Theme.colors.primaryForeground : Theme.colors.secondaryForeground,
        }}
      >
        {status.replace('_', ' ')}
      </Text>
    </View>
  );
}

const ProfileHeaderIdentity = ({
  displayName,
  handle,
  bio,
  location,
  relationshipStatus,
  tierBadge,
}: Props) => (
  <View className="mt-3">
    <View className="flex-row flex-wrap items-center gap-2">
      <Text className="text-xl font-bold text-foreground">{displayName}</Text>
      <RelationshipBadge status={relationshipStatus} />
    </View>
    <Text className="text-sm text-muted-foreground">{handle}</Text>
    {tierBadge ? <View className="mt-2 self-start">{tierBadge}</View> : null}
    {bio ? <Text className="mt-2 text-sm leading-relaxed text-foreground/80">{bio}</Text> : null}
    {location ? (
      <Text className="mt-1.5 text-xs text-muted-foreground">
        {CATEGORY_ICON_FALLBACK} {location}
      </Text>
    ) : null}
  </View>
);

export default ProfileHeaderIdentity;
