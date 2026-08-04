import React from 'react';
import { View } from 'react-native';
import { isWeb } from '~/shared/lib/ui/platform';
import { cn } from '~/shared/lib/ui/styles';

type Props = {
  className?: string;
  barClassName?: string;
  hideOnWeb?: boolean;
};

const SheetHandle = ({ className, barClassName, hideOnWeb = true }: Props) => {
  if (hideOnWeb && isWeb) return null;

  return (
    <View className={cn('items-center', className)}>
      <View className={cn('h-1 w-10 rounded-full bg-muted-foreground/30', barClassName)} />
    </View>
  );
};

export default SheetHandle;
export { SheetHandle };
