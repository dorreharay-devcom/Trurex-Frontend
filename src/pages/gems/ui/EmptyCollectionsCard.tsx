import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { cn } from '~/shared/lib/ui/styles';

const STACK_CARDS = [
  { emoji: '🍜', bg: 'bg-purple-500' },
  { emoji: '🏕️', bg: 'bg-sky-500' },
  { emoji: '📚', bg: 'bg-primary' },
];

const IDEA_LABELS = ['Best eats in Tokyo 🍜', 'Weekend escapes 🏕️', 'Hidden bars 🍸'];

function EmptyCollectionsCard({ onCreate }: { onCreate: () => void }) {
  return (
    <View className="items-center mb-6 py-6 px-4 rounded-2xl border border-dashed border-border bg-muted/30">
      <View className="flex-row mb-5">
        {STACK_CARDS.map((item, idx) => (
          <View
            key={item.emoji}
            className={cn('w-12 h-16 rounded-xl items-center justify-center', item.bg)}
            style={{
              marginLeft: idx === 0 ? 0 : -8,
              zIndex: idx,
              transform: [{ rotate: `${(idx - 1) * 6}deg` }],
            }}
          >
            <Text className="text-2xl">{item.emoji}</Text>
          </View>
        ))}
      </View>
      <Text className="text-base font-display font-bold text-foreground mb-1">
        No collections yet
      </Text>
      <Text className="text-sm text-muted-foreground text-center mb-4">
        Group your saved Rex into collections — by vibe, city, or whoever you'd share them with.
      </Text>
      <View className="flex-row flex-wrap justify-center gap-2 mb-5">
        {IDEA_LABELS.map((label) => (
          <TouchableOpacity
            key={label}
            activeOpacity={0.7}
            onPress={onCreate}
            className="px-3 py-1.5 rounded-full border border-border bg-card"
          >
            <Text className="text-xs text-foreground">{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        onPress={onCreate}
        activeOpacity={0.8}
        className="flex-row items-center gap-2 px-5 py-2.5 rounded-xl bg-primary"
      >
        <Plus size={16} color={Theme.colors.primaryForeground} />
        <Text className="text-sm font-semibold text-primary-foreground">
          Create first collection
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default EmptyCollectionsCard;
