import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const pillClass = 'flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border';

type FilterOptionPillProps = {
  selected: boolean;
  onPress: () => void;
  label: string;
  emoji?: string;
};

const FilterOptionPill = ({ selected, onPress, label, emoji }: FilterOptionPillProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${pillClass} ${selected ? 'bg-primary border-primary' : 'bg-card border-border'}`}
    >
      {emoji ? <Text style={{ fontSize: 12 }}>{emoji}</Text> : null}
      <Text
        className={`text-xs font-medium ${selected ? 'text-primary-foreground' : 'text-foreground'}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default FilterOptionPill;
