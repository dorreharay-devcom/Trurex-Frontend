import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

type ShowAllToggleProps = {
  showAll: boolean;
  total: number;
  onToggle: () => void;
};

const ShowAllToggle = ({ showAll, total, onToggle }: ShowAllToggleProps) => {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      className="flex-row items-center gap-1"
    >
      <Text className="text-xs text-muted-foreground">
        {showAll ? 'Show less' : `Show all ${total}`}
      </Text>
      {showAll ? (
        <ChevronUp size={14} color={Theme.colors.muted} />
      ) : (
        <ChevronDown size={14} color={Theme.colors.muted} />
      )}
    </TouchableOpacity>
  );
};

export default ShowAllToggle;
