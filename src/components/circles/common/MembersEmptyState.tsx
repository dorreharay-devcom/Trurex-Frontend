import React from 'react';
import { Text } from 'react-native';

export function MembersEmptyState() {
  return (
    <Text className="py-8 text-center text-sm text-muted-foreground">
      No members yet. Add people from your network below.
    </Text>
  );
}
