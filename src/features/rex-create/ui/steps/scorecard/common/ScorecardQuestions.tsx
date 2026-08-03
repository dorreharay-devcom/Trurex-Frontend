import React from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import type { CategoryQuestion } from '~/features/rex-create/types/categoryCreateConfig';
import { CREATE_REC_MUST_KNOW_MAX } from '~/features/rex-create/config/scorecard';
import { INPUT_FOCUS_RING_CLASS } from '~/shared/config/inputFocus';
import {
  Theme,
  textFieldCaretStyle,
  textFieldSingleLineDefaultHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';
import { isWeb, webNoOutline } from '~/utils';
import { cn } from '~/utils/general';

const OFF_MARKET_HELPER = 'Did they provide access to off-market opportunities?';
const NATIVE_MT_4 = isWeb ? undefined : { marginTop: 4 };
const NATIVE_MT_8 = isWeb ? undefined : { marginTop: 8 };

type QuestionStyle = 'standard' | 'emphasized';
type AnswerChange = (questionCode: string, value: string, mode: 'select' | 'text') => void;

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

function QuestionHeader({ q, emphasized }: { q: CategoryQuestion; emphasized: boolean }) {
  const helper = questionHelperText(q);
  return (
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
          style={NATIVE_MT_4}
        >
          {helper}
        </Text>
      ) : null}
    </View>
  );
}

function TextAnswer({
  q,
  value,
  onAnswerChange,
}: {
  q: CategoryQuestion;
  value: string;
  onAnswerChange: AnswerChange;
}) {
  const maxLength = textMaxLength(q);
  return (
    <View style={NATIVE_MT_8}>
      <TextInput
        value={value}
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
        {value.length}/{maxLength}
      </Text>
    </View>
  );
}

function SelectAnswer({
  q,
  value,
  emphasized,
  onAnswerChange,
}: {
  q: CategoryQuestion;
  value: string;
  emphasized: boolean;
  onAnswerChange: AnswerChange;
}) {
  return (
    <View className="flex-row flex-wrap gap-2" style={NATIVE_MT_8}>
      {q.options.map((opt) => {
        const selected = value === opt.code;
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
            <Text className={cn('text-sm', selected ? 'text-primary-foreground' : 'text-black')}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function QuestionField({
  q,
  value,
  emphasized,
  onAnswerChange,
}: {
  q: CategoryQuestion;
  value: string;
  emphasized: boolean;
  onAnswerChange: AnswerChange;
}) {
  return (
    <View className="space-y-2">
      <QuestionHeader q={q} emphasized={emphasized} />
      {q.type === 'text' ? (
        <TextAnswer q={q} value={value} onAnswerChange={onAnswerChange} />
      ) : (
        <SelectAnswer q={q} value={value} emphasized={emphasized} onAnswerChange={onAnswerChange} />
      )}
    </View>
  );
}

type Props = {
  sectionTitle?: string | null;
  questionStyle?: QuestionStyle;
  questions: CategoryQuestion[];
  answers: Record<string, string>;
  onAnswerChange: AnswerChange;
};

function ScorecardQuestions({
  sectionTitle,
  questionStyle = 'standard',
  questions,
  answers,
  onAnswerChange,
}: Props) {
  if (questions.length === 0) return null;

  const emphasized = questionStyle === 'emphasized';
  const heading = sectionTitle?.trim();

  return (
    <View className="space-y-4" style={emphasized ? NATIVE_MT_8 : undefined}>
      {heading ? (
        <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {heading}
        </Text>
      ) : null}
      {questions.map((q) => (
        <QuestionField
          key={q.code}
          q={q}
          value={answers[q.code] ?? ''}
          emphasized={emphasized}
          onAnswerChange={onAnswerChange}
        />
      ))}
    </View>
  );
}

export default ScorecardQuestions;
