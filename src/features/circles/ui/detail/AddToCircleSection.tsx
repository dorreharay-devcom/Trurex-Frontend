import React from 'react';
import { Text, View } from 'react-native';
import { CONNECTION_PHASE, CONNECTION_TAB } from '~/features/circles/config/connections';
import { useScopedConnections } from '~/features/circles/hooks/useScopedConnections';
import type { ConnectionScopeTab } from '~/features/circles/types/connections';
import SectionSpinner from '~/features/circles/ui/common/SectionSpinner';
import CircleConnectionRow from '~/features/circles/ui/common/rows/CircleConnectionRow';
import ConnectionEmptyState from '~/features/circles/ui/connections/ConnectionEmptyState';
import ConnectionScopeTabs from '~/features/circles/ui/connections/ConnectionScopeTabs';
import ConnectionSearchField from '~/features/circles/ui/connections/ConnectionSearchField';
import { LoadMoreButton } from '~/shared/ui/LoadMoreButton';

const TAB_ORDER: readonly ConnectionScopeTab[] = [
  CONNECTION_TAB.trusted,
  CONNECTION_TAB.following,
  CONNECTION_TAB.followers,
];

type Props = {
  userId: string | undefined;
  memberIds: Set<string>;
  addingMemberId: string | null;
  onAddMember: (userId: string) => void;
  onUserPress?: (userId: string) => void;
};

const AddToCircleSection = ({ userId, memberIds, addingMemberId, onAddMember, onUserPress }: Props) => {
  const scoped = useScopedConnections({ userId, enabled: Boolean(userId) });

  return (
    <>
      <Text className="mb-3 mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Add to this circle
      </Text>

      <ConnectionScopeTabs
        tabs={TAB_ORDER}
        active={scoped.tab}
        onChange={scoped.setTab}
        byTab={scoped.byTab}
      />
      <ConnectionSearchField {...scoped.search} />

      {scoped.phase === CONNECTION_PHASE.loading && (
        <SectionSpinner className="mb-8 items-center py-4" />
      )}

      {scoped.phase === CONNECTION_PHASE.rows && (
        <View className="mb-8 gap-2">
          {scoped.rows.map((row) => (
            <CircleConnectionRow
              key={row.user_id}
              row={row}
              isMember={memberIds.has(row.user_id)}
              isAdding={addingMemberId === row.user_id}
              onAdd={() => onAddMember(row.user_id)}
              onUserPress={onUserPress}
            />
          ))}
          <LoadMoreButton
            visible={scoped.hasNextPage}
            loading={scoped.isFetchingNextPage}
            onPress={scoped.fetchNextPage}
          />
        </View>
      )}

      <ConnectionEmptyState phase={scoped.phase} className="mb-8 items-center py-8" />
    </>
  );
};

export default AddToCircleSection;
