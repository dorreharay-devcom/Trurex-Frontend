import React from 'react';
import { Text, View } from 'react-native';
import { CONNECTION_PHASE, CONNECTION_TAB } from '~/features/circles/config/connections';
import { useScopedConnections } from '~/features/circles/hooks/useScopedConnections';
import type { ConnectionScopeTab } from '~/features/circles/types/connections';
import RowSkeletonList from '~/features/circles/ui/common/RowSkeletonList';
import NetworkConnectionRow from '~/features/circles/ui/common/rows/NetworkConnectionRow';
import ConnectionEmptyState from '~/features/circles/ui/connections/ConnectionEmptyState';
import ConnectionScopeTabs from '~/features/circles/ui/connections/ConnectionScopeTabs';
import ConnectionSearchField from '~/features/circles/ui/connections/ConnectionSearchField';
import PeopleYouMayKnowSection from '~/features/circles/ui/people/PeopleYouMayKnowSection';
import { LoadMoreButton } from '~/shared/ui/LoadMoreButton';
import type { NetworkUserRow } from '~/types/network';

const TAB_ORDER: readonly ConnectionScopeTab[] = [
  CONNECTION_TAB.trusted,
  CONNECTION_TAB.followers,
  CONNECTION_TAB.following,
];

type Props = {
  userId: string;
  onUserPress?: (userId: string) => void;
  onAddToCircle: (row: NetworkUserRow) => void;
};

const ConnectionsSection = ({ userId, onUserPress, onAddToCircle }: Props) => {
  const scoped = useScopedConnections({ userId, enabled: true });
  const allowAddToCircle = scoped.tab !== CONNECTION_TAB.following;

  return (
    <View className="mt-10">
      <Text className="mb-3 text-base font-semibold text-foreground">Connections</Text>

      <ConnectionScopeTabs
        tabs={TAB_ORDER}
        active={scoped.tab}
        onChange={scoped.setTab}
        byTab={scoped.byTab}
      />
      <ConnectionSearchField {...scoped.search} />

      {scoped.phase === CONNECTION_PHASE.loading && <RowSkeletonList count={4} className="gap-2" />}

      {scoped.phase === CONNECTION_PHASE.rows && (
        <View className="gap-2">
          {scoped.rows.map((row) => (
            <NetworkConnectionRow
              key={row.user_id}
              row={row}
              onAddToCircle={allowAddToCircle ? () => onAddToCircle(row) : undefined}
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

      <ConnectionEmptyState phase={scoped.phase} />

      <PeopleYouMayKnowSection enabled onUserPress={onUserPress} />
    </View>
  );
};

export default ConnectionsSection;
