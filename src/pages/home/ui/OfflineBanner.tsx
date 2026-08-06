import React from 'react';
import { Text, View } from 'react-native';
import { useOnline } from '~/shared/hooks/useOnline';
import { liveRegionA11y } from '~/shared/lib/a11y';

function OfflineBanner() {
  const online = useOnline();
  if (online) return null;

  return (
    <View
      className="w-full items-center bg-muted px-4 py-2.5"
      {...liveRegionA11y("You're offline")}
    >
      <Text className="text-sm font-semibold text-foreground">You&apos;re offline</Text>
      <Text className="text-xs text-muted-foreground">
        Cached reads still work. Posting and likes need a connection.
      </Text>
    </View>
  );
}

export default OfflineBanner;
