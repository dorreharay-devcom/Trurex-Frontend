import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, type TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  labelRight?: React.ReactNode;
  secure?: boolean;
}

const Input = ({ label, labelRight, secure, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      <View className="flex-row items-center justify-between mb-1.5">
        <Text className="text-sm font-medium text-foreground">{label}</Text>
        {labelRight}
      </View>

      {secure ? (
        <View className="flex-row bg-card border border-border rounded-lg items-center">
          <TextInput
            className="flex-1 px-3 py-2.5 text-sm text-foreground"
            secureTextEntry={!showPassword}
            placeholderTextColor={Theme.colors.muted}
            autoCapitalize="none"
            {...props}
          />
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)} className="px-3">
            {showPassword ? (
              <EyeOff size={16} color={Theme.colors.muted} />
            ) : (
              <Eye size={16} color={Theme.colors.muted} />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <TextInput
          className="w-full px-3 py-2.5 rounded-lg bg-card border border-border text-foreground text-sm"
          placeholderTextColor={Theme.colors.muted}
          autoCapitalize="none"
          {...props}
        />
      )}
    </View>
  );
};

export default Input;
