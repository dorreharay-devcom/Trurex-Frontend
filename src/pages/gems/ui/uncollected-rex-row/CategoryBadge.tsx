import React from 'react';
import { Text, View } from 'react-native';

function CategoryBadge({ label }: { label: string }) {
  return (
    <View className="mt-1 items-start">
      <View className="rounded-full border border-[#d4d4d4cc] bg-[#d4d4d466] px-2 py-0.5">
        <Text className="text-[10px] font-medium capitalize text-foreground">{label}</Text>
      </View>
    </View>
  );
}

export default CategoryBadge;
