import { View } from 'react-native';
import { cn } from '~/shared/lib/ui/styles';

export const Skeleton = ({ className }: { className?: string }) => (
  <View className={cn('rounded-md bg-muted/30', className)} />
);
