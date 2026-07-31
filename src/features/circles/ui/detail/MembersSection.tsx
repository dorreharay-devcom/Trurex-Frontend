import React from 'react';
import { Text, View } from 'react-native';
import type { CircleMemberProfile } from '~/shared/api/circlesApi';
import SectionSpinner from '~/features/circles/ui/common/SectionSpinner';
import CircleMemberRow from '~/features/circles/ui/common/rows/CircleMemberRow';

type Props = {
  members: CircleMemberProfile[];
  loading: boolean;
  canRemove: boolean;
  removingMemberId: string | null;
  onRemove: (userId: string) => void;
  onUserPress?: (userId: string) => void;
};

const MembersSection = ({
  members,
  loading,
  canRemove,
  removingMemberId,
  onRemove,
  onUserPress,
}: Props) => {
  return (
    <>
      <Text className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Members
      </Text>

      {loading && <SectionSpinner className="mb-6 items-center py-6" />}

      {!loading && members.length === 0 && (
        <Text className="py-8 text-center text-sm text-muted-foreground">
          No members yet. Add people from your network below.
        </Text>
      )}

      {!loading && members.length > 0 && (
        <View className="mb-6 gap-2">
          {members.map((member) => (
            <CircleMemberRow
              key={member.user_id}
              member={member}
              onUserPress={onUserPress}
              onRemove={canRemove ? () => onRemove(member.user_id) : undefined}
              removing={removingMemberId === member.user_id}
            />
          ))}
        </View>
      )}
    </>
  );
};

export default MembersSection;
