import React from 'react';
import { View, type ViewStyle } from 'react-native';

const GRID_GAP = 12;
const NARROW_BREAKPOINT = 700;

export function profileGridLayout(contentWidth: number) {
  const width = Math.max(Math.floor(contentWidth), 1);
  const numColumns = width < NARROW_BREAKPOINT ? 2 : 4;
  const cellWidth = Math.max(Math.floor(width / numColumns - GRID_GAP), 1);
  return { numColumns, cellWidth, gap: GRID_GAP };
}

type Props = {
  numColumns: number;
  gap: number;
  children: React.ReactNode;
};

function ProfileGridCell({ numColumns, gap, children }: Props) {
  const halfGap = gap / 2;
  const style: ViewStyle = {
    width: `${100 / numColumns}%`,
    paddingHorizontal: halfGap,
    marginBottom: gap,
  };
  return <View style={style}>{children}</View>;
}

export default ProfileGridCell;
