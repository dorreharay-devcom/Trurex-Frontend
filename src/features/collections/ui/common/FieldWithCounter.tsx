import React, { type ReactNode } from 'react';
import { Text, View } from 'react-native';

type Props = {
  label: string;
  count: number;
  max: number;
  children: ReactNode;
};

function FieldWithCounter({ label, count, max, children }: Props) {
  return (
    <View>
      <Text className="text-xs font-semibold text-muted-foreground mb-1.5">{label}</Text>
      {children}
      <Text className="text-[10px] text-muted-foreground mt-1 text-right">
        {count}/{max}
      </Text>
    </View>
  );
}

export default FieldWithCounter;
