import type { ReactNode } from 'react';
import React from 'react';
import { View } from 'react-native';
import { isWeb } from '~/shared/lib/ui/platform';

type Props = {
  field: ReactNode;
  trailing?: ReactNode;
  preserveTrailingWidth?: boolean;
};

const spacerA11yProps = isWeb
  ? ({ 'aria-hidden': true } as const)
  : ({ accessibilityElementsHidden: true } as const);

const TrailingWidthSpacer = () => (
  <View className="shrink-0 items-end gap-2">
    <View className="h-10 w-10 shrink-0" pointerEvents="none" {...spacerA11yProps} />
  </View>
);

const MapSearchRow = ({ field, trailing, preserveTrailingWidth }: Props) => (
  <View className="flex-row items-center gap-2">
    <View className="min-w-0 flex-1">{field}</View>
    {trailing != null && <View className="shrink-0 items-end gap-2">{trailing}</View>}
    {preserveTrailingWidth && <TrailingWidthSpacer />}
  </View>
);

export default MapSearchRow;
