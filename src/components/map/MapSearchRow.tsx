import type { ReactNode } from 'react';
import { View } from 'react-native';
import { isWeb } from '~/utils';

type Props = {
  field: ReactNode;
  trailingSlot?: ReactNode | 'preserve-width';
};

const spacerA11yProps = isWeb
  ? ({ 'aria-hidden': true } as const)
  : ({ accessibilityElementsHidden: true } as const);

export function MapSearchRow({ field, trailingSlot }: Props) {
  const showTrailing = trailingSlot !== undefined;

  return (
    <View className="flex-row items-center gap-2">
      <View className="min-w-0 flex-1">{field}</View>
      {showTrailing ? (
        <View className="shrink-0 items-end gap-2">
          {trailingSlot === 'preserve-width' ? (
            <View className="h-10 w-10 shrink-0" pointerEvents="none" {...spacerA11yProps} />
          ) : (
            trailingSlot
          )}
        </View>
      ) : null}
    </View>
  );
}
