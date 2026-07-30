import React from 'react';
import { Text, TouchableOpacity, type ViewStyle } from 'react-native';

const tapTargetStyle: ViewStyle = {
  minHeight: 32,
  paddingLeft: 12,
  justifyContent: 'center',
};

type Props = {
  onPress: () => void;
};

const ForgotPasswordLink = ({ onPress }: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
      style={tapTargetStyle}
      accessibilityRole="button"
      accessibilityLabel="Forgot password"
    >
      <Text pointerEvents="none" className="text-xs font-medium text-muted-foreground">
        Forgot password?
      </Text>
    </TouchableOpacity>
  );
};

export default ForgotPasswordLink;
