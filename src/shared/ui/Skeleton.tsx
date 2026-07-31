import { View } from 'react-native';
import { cn } from '~/utils/general';

export const Skeleton = ({ className }: { className?: string }) => (
  <View className={cn('rounded-md bg-muted/30', className)} />
);
