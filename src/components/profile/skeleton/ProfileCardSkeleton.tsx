import React from 'react';
import { View, ScrollView } from 'react-native';
import { webContainerStyle } from '~/utils';
import { ProfileRexGridSkeleton } from './ProfileRexGridSkeleton';

type Props = {
  windowWidth: number;
  showBack?: boolean;
};

export function ProfileCardSkeleton({ windowWidth, showBack }: Props) {
  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={webContainerStyle}
      contentContainerClassName="p-4 pb-24"
    >
      {showBack ? <View className="mb-3 h-4 w-14 rounded-md bg-border/40" /> : null}
      <View className="overflow-hidden rounded-xl border border-border bg-card">
        <View className="h-28 bg-border/40" />
        <View className="gap-3 p-4">
          <View className="h-16 w-16 rounded-2xl bg-border/40" />
          <View className="h-4 w-36 rounded-md bg-border/40" />
          <View className="h-3 w-24 rounded-md bg-border/40" />
        </View>
        <View className="h-11 border-t border-border bg-border/25" />
        <View className="p-4">
          <ProfileRexGridSkeleton windowWidth={windowWidth} />
        </View>
      </View>
    </ScrollView>
  );
}
