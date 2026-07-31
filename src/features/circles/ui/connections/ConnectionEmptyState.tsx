import React from 'react';
import { Text, View } from 'react-native';
import { CONNECTION_PHASE } from '~/features/circles/config/connections';
import type { ConnectionListPhase } from '~/features/circles/types/connections';
import TrustedEmptyState from '~/features/circles/ui/common/TrustedEmptyState';

const EMPTY_MESSAGE: Partial<Record<ConnectionListPhase, string>> = {
  [CONNECTION_PHASE.noMatch]: 'No one matches your search.',
  [CONNECTION_PHASE.followersEmpty]: 'No followers yet.',
  [CONNECTION_PHASE.followingEmpty]: 'Not following anyone yet.',
};

type Props = {
  phase: ConnectionListPhase;
  className?: string;
  trustedClassName?: string;
};

const ConnectionEmptyState = ({
  phase,
  className = 'items-center py-10',
  trustedClassName = '',
}: Props) => {
  if (phase === CONNECTION_PHASE.trustedEmpty) {
    return <TrustedEmptyState containerClassName={trustedClassName} />;
  }

  const message = EMPTY_MESSAGE[phase];
  if (!message) return null;

  return (
    <View className={className}>
      <Text className="text-center text-sm text-muted-foreground">{message}</Text>
    </View>
  );
};

export default ConnectionEmptyState;
