import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { UserMinus } from 'lucide-react-native';
import type { CircleMemberProfile } from '~/shared/api/circlesApi';
import { Theme } from '~/shared/theme/Theme';
import ConnectionRowShell from '~/features/circles/ui/common/rows/ConnectionRowShell';

type Props = {
  member: CircleMemberProfile;
  onUserPress?: (userId: string) => void;
  onRemove?: () => void;
  removing?: boolean;
};

const CircleMemberRow = ({ member, onUserPress, onRemove, removing }: Props) => {
  return (
    <ConnectionRowShell
      userId={member.user_id}
      name={member.display_name ?? 'Unknown'}
      avatarName={member.display_name ?? '?'}
      handle={member.handle}
      avatarUrl={member.avatar_url}
      onUserPress={onUserPress}
    >
      {onRemove && (
        <Pressable
          onPress={onRemove}
          disabled={removing}
          className="flex-row items-center gap-1 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 active:opacity-90"
        >
          {removing ? (
            <ActivityIndicator size="small" color={Theme.colors.destructive} />
          ) : (
            <>
              <UserMinus size={14} color={Theme.colors.destructive} />
              <Text className="text-xs font-medium text-destructive">
                Remove
              </Text>
            </>
          )}
        </Pressable>
      )}
    </ConnectionRowShell>
  );
};

export default CircleMemberRow;
