import { View } from 'react-native';

export const Slider = ({ min, max, step, value, onValueChange, className }: any) => (
  // Simplified version of a slider for the sake of the 1:1 code import
  <View className={`h-6 w-full justify-center ${className}`}>
    <View className="h-1 bg-border rounded-full w-full" />
    <View
      className="absolute h-4 w-4 bg-primary rounded-full border border-white shadow-sm"
      style={{ left: `${((value[1] - min) / (max - min)) * 100}%` }}
    />
  </View>
);
