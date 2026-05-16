import React from 'react';
import { View, ScrollView } from 'react-native';

export function ProfileCollectionsSkeleton() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-3 px-4 py-4"
    >
      {[1, 2, 3].map((i) => (
        <View key={i} style={{ width: 140, height: 178 }} className="rounded-xl bg-border/40" />
      ))}
    </ScrollView>
  );
}
