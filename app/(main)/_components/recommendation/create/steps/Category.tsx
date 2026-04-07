import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import {
  CREATE_REC_MODAL_MAX_W,
  CREATE_REC_STEP_INNER,
} from '~/constants/recommendation/createLayout';
import { REX_CATEGORIES } from '~/constants/recommendation/rexCategories';
import { CreateStepTitle } from '../CreateStepTitle';
import { Theme } from '~/theme/Theme';

/** Horizontal inset from step `p-6` (24px × 2) for tile width math */
const H_PAD = 24;
const GAP = 12;

/** Narrow phones get 2 cols (readable labels + ~44pt+ tap targets); phablet 3; wide 4 */
function columnCountForInnerWidth(inner: number): number {
  if (inner < 400) return 2;
  if (inner < 560) return 3;
  return 4;
}

type Props = {
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
  /** From selected search place; drives pill + primary highlight when still selected */
  autoSuggestedCategoryId: string | null;
};

/** Step: choose the category for this recommendation. */
export const Category: React.FC<Props> = ({
  selectedCategoryId,
  onSelectCategory,
  autoSuggestedCategoryId,
}) => {
  const { width: windowWidth } = useWindowDimensions();

  const { cols, tileW, minTileH, emojiClass, labelClass } = useMemo(() => {
    const maxW = Math.min(windowWidth, CREATE_REC_MODAL_MAX_W);
    const inner = Math.max(0, maxW - H_PAD * 2);
    const c = columnCountForInnerWidth(inner);
    const w = inner > 0 ? Math.floor((inner - GAP * (c - 1)) / c) : 0;
    const twoCol = c === 2;
    const threeCol = c === 3;
    return {
      cols: c,
      tileW: w,
      minTileH: twoCol ? 118 : threeCol ? 108 : 96,
      emojiClass: twoCol ? 'text-3xl' : 'text-2xl',
      labelClass: c >= 4 ? 'text-[10px] leading-tight' : 'text-xs leading-snug',
    };
  }, [windowWidth]);

  const autoSuggestedCat = useMemo(
    () =>
      autoSuggestedCategoryId
        ? REX_CATEGORIES.find((c) => c.id === autoSuggestedCategoryId)
        : undefined,
    [autoSuggestedCategoryId],
  );

  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center pb-36"
    >
      <View className={CREATE_REC_STEP_INNER}>
        <View className="items-center mb-5">
          <CreateStepTitle className="px-1">Confirm the category</CreateStepTitle>
          <Text className="mt-1.5 px-2 text-center text-sm font-normal text-foreground leading-5">
            {autoSuggestedCategoryId
              ? "We've suggested one — feel free to change it"
              : 'Choose the category that best fits your recommendation'}
          </Text>
        </View>

        {autoSuggestedCat ? (
          <View className="items-center mb-4">
            <Text className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 text-center max-w-full">
              {`✨ Auto-suggested: ${autoSuggestedCat.emoji} ${autoSuggestedCat.label}`}
            </Text>
          </View>
        ) : null}

        <View className="w-full flex-row flex-wrap justify-center" style={{ gap: GAP }}>
          {REX_CATEGORIES.map((cat) => {
            const selected = selectedCategoryId === cat.id;
            const primaryAuto =
              selected && autoSuggestedCategoryId !== null && cat.id === autoSuggestedCategoryId;
            const accent = primaryAuto ? Theme.colors.primary : cat.color;
            return (
              <Pressable
                key={cat.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={cat.label}
                onPress={() => onSelectCategory(cat.id)}
                android_ripple={{ color: `${Theme.colors.primary}26` }}
                className={`rounded-xl items-center justify-center transition-transform duration-150 active:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${selected ? '' : 'bg-muted/50'} ${cols <= 2 ? 'px-2 py-3' : 'p-2'}`}
                style={{
                  width: tileW,
                  minHeight: minTileH,
                  borderWidth: selected ? 2 : 1,
                  borderColor: selected ? accent : Theme.colors.border,
                  backgroundColor: selected ? `${accent}26` : undefined,
                  ...(selected
                    ? {
                        shadowColor: accent,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: primaryAuto ? 0.28 : 0.22,
                        shadowRadius: primaryAuto ? 5 : 4,
                        elevation: 3,
                      }
                    : {}),
                }}
              >
                <Text className={`${emojiClass} leading-none mb-1.5`}>{cat.emoji}</Text>
                <Text
                  className={`font-medium text-foreground text-center ${labelClass}`}
                  numberOfLines={cols >= 4 ? 5 : 4}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};
