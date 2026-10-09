import { View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { cn } from '~/shared/lib/ui/styles';

type Props = {
  size?: number;
  onDarkBackground?: boolean;
  className?: string;
};

export const VerifiedBadge = ({ size = 16, onDarkBackground = false, className }: Props) => (
  <View
    className={cn('items-center justify-center rounded-full', className)}
    style={{
      width: size,
      height: size,
      backgroundColor: Theme.brand.color,
      borderWidth: 1.5,
      borderColor: Theme.colors.card,
    }}
    accessibilityLabel="Verified account"
  >
    <Check
      size={size * 0.6}
      color={onDarkBackground ? Theme.brand.colorVerifiedAccent : Theme.brand.colorOnBrand}
      strokeWidth={3}
    />
  </View>
);
