import React from 'react';
import { View } from 'react-native';
import { Store } from 'lucide-react-native';
import { cn } from '~/shared/lib/ui/styles';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  size?: number;
  className?: string;
};

function BusinessAuthorTag({ size = 12, className }: Props) {
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Posted as business"
      className={cn('shrink-0', className)}
    >
      <Store size={size} color={Theme.colors.secondaryText} />
    </View>
  );
}

export default BusinessAuthorTag;
