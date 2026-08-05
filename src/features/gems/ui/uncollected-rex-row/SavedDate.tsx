import React from 'react';
import { Text, View } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

function SavedDate({ savedAt }: { savedAt: string | null | undefined }) {
  if (!savedAt) return null;

  return (
    <View className="flex-row items-center gap-0.5">
      <Calendar size={10} color={Theme.colors.muted} />
      <Text className="text-[10px] text-muted-foreground">
        {new Date(savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </Text>
    </View>
  );
}

export default SavedDate;
