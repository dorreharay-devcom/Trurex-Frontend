import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { CategoryQuestion } from '~/types/recommendation/rexCategoryCreateConfig';
import { cn } from '~/utils/general';

type Props = {
  sectionTitle?: string;
  questions: CategoryQuestion[];
  answers: Record<string, string>;
  onSelectOption: (questionCode: string, optionCode: string) => void;
};

export function ScorecardQuestions({
  sectionTitle = 'Questions',
  questions,
  answers,
  onSelectOption,
}: Props) {
  if (questions.length === 0) return null;

  return (
    <View className="space-y-4">
      <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {sectionTitle}
      </Text>
      {questions.map((q) => (
        <View key={q.code} className="space-y-2">
          <View>
            <Text className="text-sm font-medium text-foreground">{q.display_label}</Text>
            {q.description ? (
              <Text className="mt-0.5 text-xs text-muted-foreground">{q.description}</Text>
            ) : null}
            {q.is_required ? (
              <Text className="mt-0.5 text-[10px] text-destructive">Required</Text>
            ) : null}
          </View>
          <View className="flex-row flex-wrap gap-2">
            {q.options.map((opt) => {
              const selected = answers[q.code] === opt.code;
              return (
                <Pressable
                  key={opt.code}
                  onPress={() => onSelectOption(q.code, opt.code)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 active:opacity-90',
                    selected ? 'border-primary bg-primary' : 'border-border bg-muted/50',
                  )}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text
                    className={cn(
                      'text-sm font-medium',
                      selected ? 'text-primary-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}
