import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Globe } from 'lucide-react-native';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import { CREATE_REC_CIRCLES } from '~/constants/recommendation/createCircles';
import { CreateStepTitle } from '../CreateStepTitle';
import { Theme } from '~/theme/Theme';

type Props = {
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
};

const RadioIndicator = ({ selected }: { selected: boolean }) => (
  <View
    className="h-5 w-5 items-center justify-center rounded-full border-2"
    style={{
      borderColor: selected ? Theme.colors.primary : Theme.colors.border,
    }}
  >
    {selected ? (
      <View
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: Theme.colors.primary }}
      />
    ) : null}
  </View>
);

export const Circles: React.FC<Props> = ({ selectedIds, onToggle }) => {
  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center pb-36"
    >
      <View className={`${CREATE_REC_STEP_INNER} gap-6`}>
        <View>
          <CreateStepTitle>Choose your circles</CreateStepTitle>
          <Text className="mt-1.5 text-center text-sm font-normal text-foreground leading-5">
            Pick who sees this recommendation
          </Text>
        </View>

        <View className="gap-6">
          {CREATE_REC_CIRCLES.map((c) => {
            const selected = selectedIds.has(c.id);
            return (
              <Pressable
                key={c.id}
                onPress={() => onToggle(c.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={`${c.title}, ${c.subtitle}`}
                className={`flex-row items-center gap-3 rounded-[12px] border p-4 active:opacity-90 ${
                  selected ? 'border-primary bg-primary/5' : 'border-border bg-card'
                }`}
              >
                <View
                  className="h-11 w-11 items-center justify-center rounded-full"
                  style={{ backgroundColor: c.iconBg }}
                >
                  {c.variant === 'globe' ? (
                    <Globe size={22} color={c.accent} />
                  ) : (
                    <View
                      className="h-4 w-4 rounded-full"
                      style={{
                        backgroundColor: c.accent,
                        shadowColor: c.accent,
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.35,
                        shadowRadius: 2,
                        elevation: 2,
                      }}
                    />
                  )}
                </View>

                <View className="min-w-0 flex-1">
                  <Text className="text-base font-medium text-foreground">{c.title}</Text>
                  <Text className="mt-0.5 text-sm font-normal text-foreground">{c.subtitle}</Text>
                </View>

                <RadioIndicator selected={selected} />
              </Pressable>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};
