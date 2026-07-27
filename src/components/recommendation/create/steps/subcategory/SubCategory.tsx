import React from 'react';
import { Platform, View, Text, Pressable, ScrollView } from 'react-native';
import type { RexSubcategoryOption } from '~/data/rexSubcategoryCatalog';
import { resolveSubcategoryIcon } from '~/data/rexSubcategoryCatalog';
import { CreateStepTitle } from '../../CreateStepTitle';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import { cn } from '~/utils/general';

const TYPE_FALLBACK_ICON = '📍';

type Props = {
  subCategories: RexSubcategoryOption[];
  selected: string | null;
  onSelect: (code: string) => void;
};

export function SubCategory({ subCategories, selected, onSelect }: Props) {
  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center pb-36"
    >
      <View className={`${CREATE_REC_STEP_INNER} gap-6`}>
        <View className="items-center gap-2">
          <CreateStepTitle>What type of recommendation?</CreateStepTitle>
          <Text className="text-center text-sm text-muted-foreground">
            Select the sub-category that best describes your experience
          </Text>
        </View>

        <View className="gap-2.5">
          {subCategories.map((sc) => {
            const isSelected = selected === sc.code;
            const icon = resolveSubcategoryIcon(sc.code, sc.label, sc.icon).trim();
            const ratingLabel = `${sc.ratingCount} specific rating${sc.ratingCount !== 1 ? 's' : ''}`;
            const q =
              sc.questionCount > 0
                ? ` + ${sc.questionCount} question${sc.questionCount !== 1 ? 's' : ''}`
                : '';
            return (
              <Pressable
                key={sc.code}
                onPress={() => onSelect(sc.code)}
                className={cn(
                  'w-full flex-row items-center gap-3 rounded-xl border-2 p-4 active:opacity-95',
                  isSelected
                    ? 'border-primary bg-primary/15'
                    : 'border-border bg-card active:border-primary/30',
                )}
              >
                <View className="h-8 w-7 shrink-0 items-center justify-center">
                  <Text
                    className="text-2xl leading-none"
                    style={Platform.OS === 'web' ? undefined : { lineHeight: 30 }}
                  >
                    {icon.length > 0 ? icon : TYPE_FALLBACK_ICON}
                  </Text>
                </View>
                <View className="min-w-0 flex-1">
                  <Text
                    className={cn(
                      'text-sm font-semibold',
                      isSelected ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {sc.label}
                  </Text>
                  <Text className="mt-0.5 text-xs text-muted-foreground">
                    {ratingLabel}
                    {q}
                  </Text>
                </View>
                <View
                  className={cn(
                    'h-5 w-5 items-center justify-center rounded-full border-2',
                    isSelected ? 'border-primary bg-primary' : 'border-border bg-transparent',
                  )}
                >
                  {isSelected ? (
                    <View className="h-2 w-2 rounded-full bg-primary-foreground" />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
