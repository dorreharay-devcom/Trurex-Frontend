import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  type TextInputProps,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Theme, textFieldCaretStyle } from '~/theme/Theme';

interface InputProps extends TextInputProps {
  label: string;
  labelRight?: React.ReactNode;
  labelClassName?: string;
  inputClassName?: string;
  secure?: boolean;
}

const Input = ({ label, labelRight, labelClassName, inputClassName, secure, style, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const caretStyle: StyleProp<TextStyle> = [style, textFieldCaretStyle];

  return (
    <View>
      <View className="flex-row items-center justify-between mb-1.5">
        <Text className={`text-sm font-medium text-foreground ${labelClassName ?? ''}`}>
          {label}
        </Text>
        {labelRight}
      </View>

      {secure ? (
        <View className={`flex-row items-center rounded-lg border border-border bg-card focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/20 transition-all ${inputClassName ?? ''}`}>
          <TextInput
            className="flex-1 px-3 py-2.5 text-sm text-foreground"
            style={caretStyle}
            secureTextEntry={!showPassword}
            placeholderTextColor={Theme.colors.muted}
            autoCapitalize="none"
            selectionColor={Theme.colors.foreground}
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
          className={`w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/20 transition-all ${inputClassName ?? ''}`}
          style={caretStyle}
          placeholderTextColor={Theme.colors.muted}
          autoCapitalize="none"
          selectionColor={Theme.colors.foreground}
          {...props}
        />
      )}
    </View>
  );
};

export default Input;
