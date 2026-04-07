import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Platform } from 'react-native';
import { Star } from 'lucide-react-native';
import { getRexCategoryById } from '~/constants/recommendation/rexCategories';
import {
  CREATE_REC_SCORE_CHIPS,
  CREATE_REC_REVIEW_MAX,
  CREATE_REC_SCORE_COUNT,
  CREATE_REC_SCORE_ROWS,
} from '~/constants/recommendation/createScorecard';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import { CreateStepTitle } from '../CreateStepTitle';
import { Theme, textFieldCaretStyle } from '~/theme/Theme';

const webNoOutline = Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : undefined;

type Props = {
  selectedCategoryId: string | null;
  starRatings: number[];
  onStarChange: (index: number, value: number) => void;
  appliesSelected: Record<string, boolean>;
  onToggleApplies: (label: string) => void;
  quickTip: string;
  onQuickTipChange: (v: string) => void;
  reviewText: string;
  onReviewChange: (v: string) => void;
};

/** Step: rate the experience (stars, chips, tip, review). */
export const Scorecard: React.FC<Props> = ({
  selectedCategoryId,
  starRatings,
  onStarChange,
  appliesSelected,
  onToggleApplies,
  quickTip,
  onQuickTipChange,
  reviewText,
  onReviewChange,
}) => {
  const categoryEmoji = getRexCategoryById(selectedCategoryId ?? '')?.emoji ?? '📍';

  const filledCount = useMemo(() => starRatings.filter((n) => n > 0).length, [starRatings]);

  const reviewLen = reviewText.length;

  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center pb-36"
    >
      <View className={`${CREATE_REC_STEP_INNER} gap-6`}>
        <View>
          <CreateStepTitle>{categoryEmoji} Rate your experience</CreateStepTitle>
          <Text className="mt-1.5 px-1 text-center text-sm font-normal text-foreground leading-5">
            All fields are optional — share as much or as little as you like
          </Text>

          <View className="mt-4 items-center">
            <View className="rounded-full bg-secondary px-3 py-1.5">
              <Text className="text-xs font-normal text-secondary-foreground">
                {filledCount} of {CREATE_REC_SCORE_COUNT} ratings filled
              </Text>
            </View>
          </View>
        </View>

        <View className="overflow-hidden rounded-[12px] border border-border bg-card">
          <View className="border-b border-border px-4 py-3">
            <Text className="text-[10px] font-normal uppercase tracking-wide text-foreground">
              Star ratings
            </Text>
          </View>
          {CREATE_REC_SCORE_ROWS.map((label, index) => {
            const value = starRatings[index] ?? 0;
            const isLast = index === CREATE_REC_SCORE_ROWS.length - 1;
            return (
              <View
                key={label}
                className={`flex-row items-center justify-between px-4 py-3.5 ${
                  !isLast ? 'border-b border-border' : ''
                }`}
              >
                <Text className="min-w-0 flex-1 pr-3 text-sm font-normal text-foreground">
                  {label}
                </Text>
                <View className="flex-row items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = star <= value;
                    return (
                      <Pressable
                        key={star}
                        hitSlop={6}
                        onPress={() => onStarChange(index, star === value ? 0 : star)}
                        accessibilityRole="button"
                        accessibilityLabel={`${label}: ${active ? star : 'zero'} of 5 stars`}
                      >
                        <Star
                          size={20}
                          color={active ? Theme.colors.primary : Theme.colors.border}
                          fill={active ? Theme.colors.primary : 'transparent'}
                        />
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>

        <View>
          <Text className="text-[10px] font-normal uppercase tracking-wide text-foreground">
            What applies?
          </Text>
          <View className="mt-2 flex-row flex-wrap gap-2">
            {CREATE_REC_SCORE_CHIPS.map((chip) => {
              const on = appliesSelected[chip] === true;
              return (
                <Pressable
                  key={chip}
                  onPress={() => onToggleApplies(chip)}
                  className={`rounded-[12px] border px-3 py-2 active:opacity-90 ${
                    on ? 'border-primary bg-primary' : 'border-border bg-muted/50'
                  }`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                >
                  <Text
                    className={`text-xs font-normal ${
                      on ? 'text-primary-foreground' : 'text-foreground'
                    }`}
                  >
                    {chip}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View>
          <View className="mb-2 flex-row flex-wrap items-baseline gap-x-1.5">
            <Text className="text-[10px] font-normal uppercase tracking-wide text-foreground">
              Quick tip
            </Text>
            <Text className="text-xs font-normal italic text-muted">optional</Text>
          </View>
          <TextInput
            value={quickTip}
            onChangeText={onQuickTipChange}
            placeholder="What's their must-order?"
            placeholderTextColor={Theme.colors.secondaryText}
            className="w-full rounded-[12px] border border-border bg-muted/50 px-4 py-3 text-sm font-normal text-foreground focus:outline-none focus:border-primary"
            style={[webNoOutline, textFieldCaretStyle]}
            underlineColorAndroid="transparent"
            selectionColor={Theme.colors.foreground}
          />
        </View>

        <View>
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-[10px] font-normal uppercase tracking-wide text-foreground">
              Your review
            </Text>
            <Text className="text-xs font-normal text-muted">
              {reviewLen}/{CREATE_REC_REVIEW_MAX}
            </Text>
          </View>
          <TextInput
            value={reviewText}
            onChangeText={onReviewChange}
            placeholder="Share your experience in your own words..."
            placeholderTextColor={Theme.colors.secondaryText}
            className="flex w-full min-h-[90px] resize-none rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            style={[webNoOutline, textFieldCaretStyle]}
            multiline
            textAlignVertical="top"
            maxLength={CREATE_REC_REVIEW_MAX}
            underlineColorAndroid="transparent"
            selectionColor={Theme.colors.foreground}
          />
        </View>
      </View>
    </ScrollView>
  );
};
