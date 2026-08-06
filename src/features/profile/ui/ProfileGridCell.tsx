import React from 'react';
import { View, type ViewStyle } from 'react-native';

const GRID_GAP = 12;
const OUTER_PAD = 16;
const INNER_PAD = 16;

export function profileGridLayout(windowWidth: number) {
  const gridWidth = Math.min(windowWidth, 1280) - OUTER_PAD * 2 - INNER_PAD * 2;
  const numColumns = gridWidth < 700 ? 2 : 4;
  const cellWidth = Math.floor((gridWidth - GRID_GAP * (numColumns - 1)) / numColumns);
  return { numColumns, cellWidth, gap: GRID_GAP };
}

type Props = {
  index: number;
  numColumns: number;
  cellWidth: number;
  gap: number;
  children: React.ReactNode;
};

function ProfileGridCell({ index, numColumns, cellWidth, gap, children }: Props) {
  const lastInRow = (index + 1) % numColumns === 0;
  const style: ViewStyle = {
    width: cellWidth,
    marginBottom: gap,
    marginRight: lastInRow ? 0 : gap,
  };
  return <View style={style}>{children}</View>;
}

export default ProfileGridCell;
