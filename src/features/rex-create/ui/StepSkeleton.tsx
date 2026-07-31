import React from 'react';
import { View } from 'react-native';
import { CREATE_REC_STEP_INNER } from '~/features/rex-create/config/layout';
import { Skeleton } from '~/shared/ui/Skeleton';

const StepSkeleton = () => {
  return (
    <View className="flex-1 items-center">
      <View className={CREATE_REC_STEP_INNER}>
        <View className="items-center space-y-3 px-1 pb-6 pt-8">
          <Skeleton className="h-7 w-56 rounded-full bg-border/40" />
          <Skeleton className="h-4 w-64 rounded-full bg-border/40" />
        </View>
        <View className="gap-4">
          <Skeleton className="h-12 w-full rounded-xl bg-border/40" />
          <Skeleton className="h-20 w-full rounded-xl bg-border/40" />
          <Skeleton className="h-20 w-full rounded-xl bg-border/40" />
        </View>
      </View>
    </View>
  );
};

export default StepSkeleton;
