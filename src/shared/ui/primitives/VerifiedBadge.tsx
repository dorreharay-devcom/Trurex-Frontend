import { View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { cn } from '~/shared/lib/ui/styles';

type Props = {
  size?: number;
  onDarkBackground?: boolean;
  muted?: boolean;
  className?: string;
};

export const VerifiedBadge = ({
  size = 16,
  onDarkBackground = false,
  muted = false,
  className,
}: Props) => (
  <View
    className={cn('items-center justify-center rounded-full', className)}
    style={{
      width: size,
      height: size,
      backgroundColor: muted ? Theme.colors.card : Theme.brand.color,
      borderWidth: 1.5,
      borderColor: muted ? Theme.colors.border : Theme.colors.card,
    }}
    accessibilityLabel={muted ? 'Not verified' : 'Verified account'}
  >
    <Check
      size={size * 0.7}
      color={
        muted
          ? Theme.colors.secondaryText
          : onDarkBackground
            ? Theme.brand.colorVerifiedAccent
            : Theme.brand.colorOnBrand
      }
      strokeWidth={3}
    />
  </View>
);
