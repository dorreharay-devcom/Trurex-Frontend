import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { UserPlus } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import type { NetworkUserRow } from '~/features/circles/types/networkUser';
import { cn } from '~/shared/lib/ui/styles';
import ConnectionRowShell from '~/features/circles/ui/common/rows/ConnectionRowShell';

type Props = {
  row: NetworkUserRow;
  onAdd: () => void;
  isMember: boolean;
  isAdding: boolean;
  onUserPress?: (userId: string) => void;
};

const AddButtonContent = ({ isMember, isAdding }: { isMember: boolean; isAdding: boolean }) => {
  if (isAdding) return <ActivityIndicator size="small" color={Theme.colors.primary} />;
  if (isMember) {
    return <Text className="text-xs font-medium text-foreground">In circle</Text>;
  }
  return (
    <>
      <UserPlus size={14} color={Theme.colors.foreground} />
      <Text className="text-xs font-medium text-foreground">Add to circle</Text>
    </>
  );
};

const CircleConnectionRow = ({ row, onAdd, isMember, isAdding, onUserPress }: Props) => {
  return (
    <ConnectionRowShell
      userId={row.user_id}
      name={row.display_name || 'Member'}
      handle={row.handle}
      avatarUrl={row.avatar_url}
      onUserPress={onUserPress}
    >
      <Pressable
        onPress={onAdd}
        disabled={isMember || isAdding}
        className={cn(
          'flex-row items-center gap-1 rounded-lg border px-3 py-2',
          isMember
            ? 'border-[#d4d4d4cc] bg-[#d4d4d466]'
            : 'border-border bg-background active:opacity-90',
        )}
      >
        <AddButtonContent isMember={isMember} isAdding={isAdding} />
      </Pressable>
    </ConnectionRowShell>
  );
};

export default CircleConnectionRow;
