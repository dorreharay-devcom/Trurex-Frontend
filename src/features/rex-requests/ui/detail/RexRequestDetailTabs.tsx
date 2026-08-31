import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { cn } from '~/shared/lib/ui/styles';

export type RexRequestDetailTab = 'responses' | 'comments';

type TabItemProps = {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
};

function TabItem({ label, count, active, onPress }: TabItemProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      className="items-center pb-3"
    >
      <View className="flex-row items-center gap-2">
        <Text
          className={cn(
            'text-base font-semibold',
            active ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {label}
        </Text>
        <View
          className={cn(
            'h-5 min-w-[20px] items-center justify-center rounded-full px-1.5',
            active ? 'bg-primary' : 'bg-border',
          )}
        >
          <Text
            className={cn(
              'text-xs font-semibold',
              active ? 'text-primary-foreground' : 'text-foreground',
            )}
          >
            {count}
          </Text>
        </View>
      </View>
      <View
        className={cn('mt-3 h-0.5 w-full rounded-full', active ? 'bg-primary' : 'bg-transparent')}
      />
    </Pressable>
  );
}

type Props = {
  active: RexRequestDetailTab;
  onChange: (tab: RexRequestDetailTab) => void;
  responseCount: number;
  commentCount: number;
};

function RexRequestDetailTabs({ active, onChange, responseCount, commentCount }: Props) {
  return (
    <View className="flex-row gap-6 border-b border-border">
      <TabItem
        label="Recommended Rex's"
        count={responseCount}
        active={active === 'responses'}
        onPress={() => onChange('responses')}
      />
      <TabItem
        label="Comments"
        count={commentCount}
        active={active === 'comments'}
        onPress={() => onChange('comments')}
      />
    </View>
  );
}

export default RexRequestDetailTabs;
