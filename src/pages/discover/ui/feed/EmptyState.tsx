import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PlusCircle } from 'lucide-react-native';

type EmptyStateProps = {
  onCreateRex?: () => void;
};

const EmptyState = ({ onCreateRex }: EmptyStateProps) => {
  return (
    <View className="items-center py-16 px-4 gap-4">
      <Text className="text-4xl">🔍</Text>
      <Text className="font-display font-semibold text-foreground text-center">
        No recommendations here yet.
      </Text>
      <Text className="text-sm text-muted-foreground text-center">Know a great one? Add it.</Text>
      {onCreateRex && (
        <TouchableOpacity
          onPress={onCreateRex}
          activeOpacity={0.8}
          className="flex-row items-center gap-2 px-5 py-2.5 rounded-xl bg-primary"
        >
          <PlusCircle size={16} color="white" />
          <Text className="text-sm font-semibold text-white">Add Recommendation</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyState;
