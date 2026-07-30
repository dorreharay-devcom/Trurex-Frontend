import React from 'react';
import { Platform, View, Text, Pressable, TextInput } from 'react-native';
import type { CategoryQuestion } from '~/types/recommendation/rexCategoryCreateConfig';
import { CREATE_REC_MUST_KNOW_MAX } from '~/constants/recommendation/createScorecard';
import { INPUT_FOCUS_RING_CLASS } from '~/constants/inputFocus';
import {
  Theme,
  textFieldCaretStyle,
  textFieldSingleLineDefaultHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';
import { cn } from '~/utils/general';
import { webNoOutline } from '../../search/common/webInputOutline';

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

function textMaxLength(q: CategoryQuestion): number {
  if (typeof q.max_length === 'number' && q.max_length > 0) return q.max_length;
  return CREATE_REC_MUST_KNOW_MAX;
}

type Props = {
  sectionTitle?: string | null;
  questionStyle?: 'standard' | 'emphasized';
  questions: CategoryQuestion[];
  answers: Record<string, string>;
  onAnswerChange: (questionCode: string, value: string, mode: 'select' | 'text') => void;
};

export function ScorecardQuestions({
  sectionTitle,
  questionStyle = 'standard',
  questions,
  answers,
  onAnswerChange,
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
        const isText = q.type === 'text';
        const maxLength = textMaxLength(q);
        const textValue = answers[q.code] ?? '';

        return (
          <View key={q.code} className="space-y-2">
            <View>
              <View className="flex-row flex-wrap items-center gap-x-2 gap-y-1">
                <Text
                  className={cn(
                    emphasized
                      ? 'text-xs font-medium uppercase tracking-wider text-black'
                      : 'text-sm font-medium text-foreground',
                  )}
                >
                  {q.display_label}
                </Text>
                <Text
                  className={cn(
                    'text-[10px] italic',
                    q.is_required ? 'text-destructive' : 'text-black opacity-80',
                  )}
                >
                  {q.is_required ? 'required' : 'optional'}
                </Text>
              </View>
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
            </View>

            {isText ? (
              <View style={isNative ? { marginTop: 8 } : undefined}>
                <TextInput
                  value={textValue}
                  onChangeText={(next) => onAnswerChange(q.code, next, 'text')}
                  placeholder="Type your answer..."
                  placeholderTextColor={Theme.colors.secondaryText}
                  maxLength={maxLength}
                  className={`w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground ${INPUT_FOCUS_RING_CLASS}`}
                  style={[
                    webNoOutline,
                    textFieldCaretStyle,
                    textFieldSingleLineStyle,
                    textFieldSingleLineDefaultHeightStyle,
                  ]}
                  underlineColorAndroid="transparent"
                  selectionColor={Theme.colors.foreground}
                />
                <Text className="mt-2 text-right text-[10px] text-black opacity-70">
                  {textValue.length}/{maxLength}
                </Text>
              </View>
            ) : (
              <View
                className="flex-row flex-wrap gap-2"
                style={isNative ? { marginTop: 8 } : undefined}
              >
                {q.options.map((opt) => {
                  const selected = answers[q.code] === opt.code;
                  return (
                    <Pressable
                      key={opt.code}
                      onPress={() => onAnswerChange(q.code, opt.code, 'select')}
                      className={cn(
                        'rounded-full border px-3 active:opacity-90',
                        emphasized ? 'py-2' : 'py-1.5',
                        selected ? 'border-primary bg-primary' : 'border-border bg-muted/50',
                      )}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                    >
                      <Text
                        className={cn(
                          'text-sm',
                          selected ? 'text-primary-foreground' : 'text-black',
                        )}
                      >
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
