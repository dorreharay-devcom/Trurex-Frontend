import React from 'react';
import { Platform, View, Text, Pressable } from 'react-native';
import type { CategoryQuestion } from '~/types/recommendation/rexCategoryCreateConfig';
import { cn } from '~/utils/general';

const OFF_MARKET_HELPER = 'Did they provide access to off-market opportunities?';

function questionHelperText(q: CategoryQuestion): string | null {
  const fromApi = q.description?.trim();
  if (fromApi) return fromApi;
  const label = q.display_label.toLowerCase();
  if (label.includes('off-market') || label.includes('off market')) {
    return OFF_MARKET_HELPER;
  }
  return null;
}

type Props = {
  sectionTitle?: string | null;
  /** Subcategory-style block: VFM-like headings and helper text */
  questionStyle?: 'standard' | 'emphasized';
  questions: CategoryQuestion[];
  answers: Record<string, string>;
  onSelectOption: (questionCode: string, optionCode: string) => void;
};

export function ScorecardQuestions({
  sectionTitle,
  questionStyle = 'standard',
  questions,
  answers,
  onSelectOption,
}: Props) {
  if (questions.length === 0) return null;

  const isNative = Platform.OS !== 'web';
  const showSectionHeading = sectionTitle != null && String(sectionTitle).trim().length > 0;
  const nativeEmphasizedSpacing =
    questionStyle === 'emphasized' && isNative ? { marginTop: 8 } : undefined;

  return (
    <View className="space-y-4" style={nativeEmphasizedSpacing}>
      {showSectionHeading ? (
        <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {sectionTitle}
        </Text>
      ) : null}
      {questions.map((q) => {
        const helper = questionHelperText(q);
        const emphasized = questionStyle === 'emphasized';

        return (
          <View key={q.code} className="space-y-2">
            <View>
              <Text
                className={cn(
                  emphasized
                    ? 'text-xs font-medium uppercase tracking-wider text-black'
                    : 'text-sm font-medium text-foreground',
                )}
              >
                {q.display_label}
              </Text>
              {helper ? (
                <Text
                  className={cn(
                    'mt-0.5',
                    emphasized
                      ? 'text-[10px] italic text-black opacity-80'
                      : 'text-xs text-muted-foreground',
                  )}
                  style={isNative ? { marginTop: 4 } : undefined}
                >
                  {helper}
                </Text>
              ) : null}
              {q.is_required ? (
                <Text className="mt-0.5 text-[10px] text-destructive">Required</Text>
              ) : null}
            </View>
            <View
              className="flex-row flex-wrap gap-2"
              style={isNative ? { marginTop: 8 } : undefined}
            >
              {q.options.map((opt) => {
                const selected = answers[q.code] === opt.code;
                return (
                  <Pressable
                    key={opt.code}
                    onPress={() => onSelectOption(q.code, opt.code)}
                    className={cn(
                      'rounded-full border px-3 active:opacity-90',
                      emphasized ? 'py-2' : 'py-1.5',
                      selected ? 'border-primary bg-primary' : 'border-border bg-muted/50',
                    )}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                  >
                    <Text
                      className={cn('text-sm', selected ? 'text-primary-foreground' : 'text-black')}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
}
