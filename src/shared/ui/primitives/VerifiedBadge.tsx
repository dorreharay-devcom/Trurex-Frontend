import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Theme } from '~/shared/theme/Theme';

const SEAL_PATH =
  'M11.26 1.34Q12 0.7 12.74 1.34L13.72 2.19Q14.46 2.82 15.42 2.64L16.69 2.4Q17.65 2.21 17.97 3.13L18.4 4.36Q18.72 5.28 19.64 5.6L20.87 6.03Q21.79 6.35 21.6 7.31L21.36 8.58Q21.18 9.54 21.81 10.28L22.66 11.26Q23.3 12 22.66 12.74L21.81 13.72Q21.18 14.46 21.36 15.42L21.6 16.69Q21.79 17.65 20.87 17.97L19.64 18.4Q18.72 18.72 18.4 19.64L17.97 20.87Q17.65 21.79 16.69 21.6L15.42 21.36Q14.46 21.18 13.72 21.81L12.74 22.66Q12 23.3 11.26 22.66L10.28 21.81Q9.54 21.18 8.58 21.36L7.31 21.6Q6.35 21.79 6.03 20.87L5.6 19.64Q5.28 18.72 4.36 18.4L3.13 17.97Q2.21 17.65 2.4 16.69L2.64 15.42Q2.82 14.46 2.19 13.72L1.34 12.74Q0.7 12 1.34 11.26L2.19 10.28Q2.82 9.54 2.64 8.58L2.4 7.31Q2.21 6.35 3.13 6.03L4.36 5.6Q5.28 5.28 5.6 4.36L6.03 3.13Q6.35 2.21 7.31 2.4L8.58 2.64Q9.54 2.82 10.28 2.19Z';
const CHECK_PATH = 'M8.2 12.3 10.8 14.8 15.8 9.8';

const VERIFIED_COLORS = {
  fill: Theme.brand.colorVerified,
  outline: 'none',
  check: Theme.colors.white,
};

const MUTED_COLORS = {
  fill: Theme.colors.card,
  outline: Theme.colors.border,
  check: Theme.colors.secondaryText,
};

type Props = {
  size?: number;
  muted?: boolean;
  className?: string;
};

export const VerifiedBadge = ({ size = 16, muted = false, className }: Props) => {
  const colors = muted ? MUTED_COLORS : VERIFIED_COLORS;

  return (
    <View className={className} accessibilityLabel={muted ? 'Not verified' : 'Verified account'}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d={SEAL_PATH}
          fill={colors.fill}
          stroke={colors.outline}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <Path
          d={CHECK_PATH}
          fill="none"
          stroke={colors.check}
          strokeWidth={2.3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};
