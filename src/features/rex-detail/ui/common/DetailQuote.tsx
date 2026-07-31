import React from 'react';
import { View, Text } from 'react-native';
import { Quote } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

function DetailQuote({ text }: { text: string | undefined | null }) {
  if (!text) return null;
  return (
    <View className="rounded-xl border-l-4 border-primary bg-accent p-4">
      <View className="flex-row items-start gap-2">
        <Quote size={20} color={Theme.brand.colorDark} style={{ marginTop: 2 }} />
        <Text className="flex-1 text-base italic leading-relaxed text-foreground">
          &quot;{text}&quot;
        </Text>
      </View>
    </View>
  );
}

export default DetailQuote;
