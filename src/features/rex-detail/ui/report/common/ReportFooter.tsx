import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Theme } from '~/shared/theme/Theme';
import { cn } from '~/shared/lib/ui/styles';

type Props = {
  canSubmit: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

function ReportFooter({ canSubmit, isSubmitting, onCancel, onSubmit }: Props) {
  return (
    <View className="mt-1 flex-row justify-end gap-2 border-t border-border px-4 pb-3 pt-3">
      <Pressable
        onPress={onCancel}
        className="rounded-lg px-4 py-2.5 active:opacity-80"
        accessibilityLabel="Cancel"
      >
        <Text className="text-sm font-medium text-muted-foreground">Cancel</Text>
      </Pressable>
      <View className={cn(!canSubmit && 'cursor-not-allowed')}>
        <Pressable
          onPress={onSubmit}
          disabled={!canSubmit}
          className={cn(
            'rounded-lg px-4 py-2.5',
            canSubmit
              ? 'cursor-pointer bg-primary active:opacity-90'
              : 'cursor-not-allowed bg-primary/40 opacity-50',
          )}
          accessibilityLabel="Submit report"
          accessibilityState={{ disabled: !canSubmit }}
        >
          {isSubmitting ? (
            <ActivityIndicator color={Theme.colors.primaryForeground} />
          ) : (
            <Text
              className={cn(
                'text-sm font-semibold',
                canSubmit ? 'text-primary-foreground' : 'text-primary-foreground/60',
              )}
            >
              Submit report
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

export default ReportFooter;
