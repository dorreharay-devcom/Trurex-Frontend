import React from 'react';
import { View } from 'react-native';
import { isWeb } from '~/utils';

function SheetHandle() {
  if (isWeb) return null;

  return (
    <View className="mb-4 items-center">
      <View className="h-1 w-10 rounded-full bg-muted-foreground/30" />
    </View>
  );
}

export default SheetHandle;
