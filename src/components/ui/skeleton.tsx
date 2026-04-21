import { View } from 'react-native';

export const Skeleton = ({ className }: { className?: string }) => (
  <View className={`bg-muted/30 rounded-md ${className}`} />
);
