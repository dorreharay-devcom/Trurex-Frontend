import React from 'react';
import { Pressable, Text } from 'react-native';
import { PlusCircle } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import type { NetworkUserRow } from '~/features/circles/types/networkUser';
import ConnectionRowShell from '~/features/circles/ui/common/rows/ConnectionRowShell';

type Props = {
  row: NetworkUserRow;
  onAddToCircle?: () => void;
  onUserPress?: (userId: string) => void;
};

const NetworkConnectionRow = ({ row, onAddToCircle, onUserPress }: Props) => {
  return (
    <ConnectionRowShell
      userId={row.user_id}
      name={row.display_name || 'Member'}
      handle={row.handle}
      avatarUrl={row.avatar_url}
      onUserPress={onUserPress}
    >
      {onAddToCircle && (
        <Pressable
          onPress={onAddToCircle}
          className="flex-row items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 active:bg-muted/60"
        >
          <PlusCircle size={13} color={Theme.colors.secondaryText} />
          <Text className="text-[11px] font-medium text-muted-foreground">Add to Circle</Text>
        </Pressable>
      )}
    </ConnectionRowShell>
  );
};

export default NetworkConnectionRow;
