import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { Recommendation } from '~/shared/types/recommendation';
import { isWeb } from '~/utils';

const WEB_SUGGESTION_ROW_HANDLERS = isWeb
  ? { onMouseDown: (e: { preventDefault: () => void }) => e.preventDefault() }
  : {};

type Props = {
  suggestions: Recommendation[];
  onSelect: (rec: Recommendation) => void;
};

const MapSearchSuggestions = ({ suggestions, onSelect }: Props) => {
  if (suggestions.length === 0) return null;

  return (
    <View className="mt-1.5 w-full overflow-hidden rounded-xl border border-border bg-card/95 shadow-md">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        className="max-h-48"
      >
        {suggestions.map((rec) => (
          <Pressable
            key={rec.id}
            onPress={() => onSelect(rec)}
            {...WEB_SUGGESTION_ROW_HANDLERS}
            className="border-b border-border/60 px-4 py-2.5 active:bg-muted/30"
          >
            <Text className="text-sm text-foreground" numberOfLines={1}>
              {rec.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default MapSearchSuggestions;
