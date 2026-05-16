import React from 'react';
import { View } from 'react-native';

export const RecommendationCardSkeleton: React.FC = () => (
  <View className="mb-4 overflow-hidden rounded-xl border border-border bg-card">
    <View className="flex-row items-center gap-3 p-4 pb-2">
      <View className="h-10 w-10 rounded-full bg-border/40" />
      <View className="min-w-0 flex-1 gap-1.5">
        <View className="h-3.5 rounded bg-border/40" style={{ width: 112 }} />
        <View className="h-3 rounded bg-border/40" style={{ width: 72 }} />
      </View>
      <View className="h-6 w-16 rounded-full bg-border/40" />
    </View>

    <View className="mx-4 rounded-lg bg-border/40" style={{ aspectRatio: 4 / 3 }} />

    <View className="gap-2 px-4 pt-3">
      <View className="h-3 w-full rounded bg-border/40" />
      <View className="h-3 rounded bg-border/40" style={{ width: '88%' }} />
      <View className="h-3 rounded bg-border/40" style={{ width: '62%' }} />
    </View>

    <View className="flex-row gap-1.5 px-4 pt-2">
      <View className="h-5 w-14 rounded-full bg-border/35" />
      <View className="h-5 w-12 rounded-full bg-border/35" />
    </View>

    <View className="mt-1 flex-row items-center justify-between px-4 py-3">
      <View className="flex-row items-center gap-5">
        <View className="h-5 w-10 rounded bg-border/35" />
        <View className="h-5 w-10 rounded bg-border/35" />
        <View className="h-5 w-5 rounded bg-border/35" />
      </View>
      <View className="h-5 w-5 rounded bg-border/35" />
    </View>
  </View>
);
