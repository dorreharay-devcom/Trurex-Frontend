import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { CREATE_REC_MUST_KNOW_MAX } from '~/constants/recommendation/createScorecard';
import { INPUT_FOCUS_RING_CLASS } from '~/constants/inputFocus';
import {
  Theme,
  textFieldCaretStyle,
  textFieldSingleLineDefaultHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';
import { webNoOutline } from '../../search/common/webInputOutline';

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  categoryCode: string | null;
  categoryDisplayName?: string | null;
};

type QuickTipCopy = {
  label: string;
  helper: string;
};

const MUST_ORDER_CODES = new Set(['restaurants', 'restaurant', 'cafes', 'cafes_coffee_shops']);
const MUST_TRY_CODES = new Set([
  'bars',
  'bars_nightlife',
  'personal_beauty',
  'beauty_personal_care',
  'spiritual',
  'spiritual_holistic',
  'retail',
  'retail_shopping',
  'fitness',
  'fitness_movement',
  'growth_learning',
  'events_entertainment',
  'entertainment',
]);
const MUST_KNOW_CODES = new Set([
  'hotels',
  'hotels_accommodation',
  'medical',
  'home_and_trade',
  'home_trades',
  'creative_services',
  'creative_professional_services',
  'professional_services',
  'business_legal_services',
  'pets',
  'childcare',
  'childcare_family',
  'automotive',
]);
const MUST_SEE_CODES = new Set(['arts_culture', 'sightseeing']);
const MUST_DO_CODES = new Set(['activities', 'wellness', 'outdoors_nature']);

function normalizeForMatch(value: string | null | undefined): string {
  return (value ?? '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function copyForCategory(
  categoryCode: string | null,
  categoryDisplayName?: string | null,
): QuickTipCopy {
  const candidates = [
    normalizeForMatch(categoryCode),
    normalizeForMatch(categoryDisplayName),
  ].filter(Boolean);
  const matches = (codes: Set<string>, labels: RegExp[]) =>
    candidates.some((c) => codes.has(c) || labels.some((r) => r.test(c)));

  if (matches(MUST_ORDER_CODES, [/restaurant/, /cafe/, /coffee/])) {
    return {
      label: 'MUST ORDER',
      helper: "What's the one dish or drink not to miss?",
    };
  }
  if (
    matches(MUST_TRY_CODES, [
      /bar/,
      /beauty/,
      /personal_care/,
      /spiritual/,
      /holistic/,
      /retail/,
      /shopping/,
      /fitness/,
      /movement/,
      /growth/,
      /learning/,
      /event/,
      /entertainment/,
    ])
  ) {
    return {
      label: 'MUST TRY',
      helper: "What's the one thing people should try?",
    };
  }
  if (
    matches(MUST_KNOW_CODES, [
      /hotel/,
      /medical/,
      /home/,
      /trade/,
      /creative/,
      /professional/,
      /business/,
      /legal/,
      /pet/,
      /childcare/,
      /family/,
      /automotive/,
    ])
  ) {
    return {
      label: 'MUST KNOW',
      helper: "What's the one thing every guest should know before they arrive?",
    };
  }
  if (matches(MUST_SEE_CODES, [/art/, /culture/, /sightseeing/])) {
    return {
      label: 'MUST SEE',
      helper: "What's the one thing not to miss — a piece, a room, a moment?",
    };
  }
  if (matches(MUST_DO_CODES, [/activit/, /wellness/, /outdoor/, /nature/])) {
    return {
      label: 'MUST DO',
      helper: "What's the one thing not to miss or know before you go?",
    };
  }
  return {
    label: 'MUST KNOW',
    helper: "What's the one thing every guest should know before they arrive?",
  };
}

export function ScorecardQuickTip({
  value,
  onChangeText,
  categoryCode,
  categoryDisplayName,
}: Props) {
  const copy = copyForCategory(categoryCode, categoryDisplayName);
  const count = value.length;

  return (
    <View>
      <View className="mb-2 flex-row flex-wrap items-center gap-2">
        <Text className="text-xs font-medium uppercase tracking-wider text-black">
          {copy.label}
        </Text>
        <Text className="text-[10px] italic text-black opacity-70">optional</Text>
      </View>
      <Text className="mb-3 text-sm italic text-black opacity-85">{copy.helper}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={copy.helper}
        placeholderTextColor={Theme.colors.secondaryText}
        maxLength={CREATE_REC_MUST_KNOW_MAX}
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
        {count}/{CREATE_REC_MUST_KNOW_MAX}
      </Text>
    </View>
  );
}
