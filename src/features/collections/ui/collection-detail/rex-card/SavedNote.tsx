import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  note: string | null | undefined;
  hidden: boolean;
};

function SavedNote({ note, hidden }: Props) {
  if (!note || hidden) return null;

  return (
    <View className="mx-3 mb-3 flex-row items-start gap-1.5 bg-muted/50 rounded-lg px-2.5 py-1.5">
      <Text className="text-xs text-muted-foreground">💬</Text>
      <Text className="text-xs text-muted-foreground italic flex-1">{note}</Text>
    </View>
  );
}

export default SavedNote;
