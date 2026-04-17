import React, { useMemo } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import type { CreateRecCircle } from '~/constants/recommendation/createCircles';
import { Theme } from '~/theme/Theme';
import { CreateStepTitle } from '../../CreateStepTitle';
import { cn } from '~/utils/general';
import { CircleRow } from './common';

type Props = {
  circles: CreateRecCircle[];
  showFetchSpinner: boolean;
  loadError: boolean;
  onRetry: () => void;
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  showSensitiveNudge?: boolean;
};

export const Circles: React.FC<Props> = ({
  circles,
  showFetchSpinner,
  loadError,
  onRetry,
  selectedIds,
  onToggle,
  showSensitiveNudge = false,
}) => {
  const visibleCircles = loadError ? circles.slice(0, 1) : circles;

  const { publicRow, userCircles } = useMemo(() => {
    const pub = visibleCircles.find((c) => c.id === 'public');
    const rest = visibleCircles.filter((c) => c.id !== 'public');
    return { publicRow: pub, userCircles: rest };
  }, [visibleCircles]);

  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center pb-36"
    >
      <View className={cn(CREATE_REC_STEP_INNER, 'gap-6')}>
        <View className="items-center gap-2">
          <CreateStepTitle>Choose your circles</CreateStepTitle>
          <Text className="text-center text-sm text-muted-foreground">
            Pick who sees this recommendation
          </Text>
        </View>

        {showSensitiveNudge ? (
          <View className="flex-row items-start gap-3 rounded-xl border border-accent-foreground/20 bg-accent/60 p-4">
            <Text className="shrink-0 text-lg">👀</Text>
            <Text className="flex-1 text-sm text-foreground">
              <Text className="font-semibold">Heads up</Text>
              {' — you might want to think about who sees this one'}
            </Text>
          </View>
        ) : null}

        {loadError ? (
          <View className="items-center gap-3 py-4">
            <Text className="text-center text-sm text-destructive">
              Couldn&apos;t load your circles. Check your connection and try again.
            </Text>
            <Pressable
              onPress={onRetry}
              accessibilityRole="button"
              className="rounded-xl border border-border bg-card px-4 py-2 active:opacity-90"
            >
              <Text className="text-sm font-medium text-foreground">Retry</Text>
            </Pressable>
          </View>
        ) : null}

        {showFetchSpinner ? (
          <View className="items-center py-8">
            <ActivityIndicator color={Theme.colors.primary} />
            <Text className="mt-3 text-sm text-muted-foreground">Loading circles…</Text>
          </View>
        ) : null}

        {publicRow ? (
          <CircleRow
            circle={publicRow}
            selected={selectedIds.has(publicRow.id)}
            onToggle={() => onToggle(publicRow.id)}
          />
        ) : null}

        <View className="gap-2">
          {userCircles.map((c) => (
            <CircleRow
              key={c.id}
              circle={c}
              selected={selectedIds.has(c.id)}
              onToggle={() => onToggle(c.id)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
