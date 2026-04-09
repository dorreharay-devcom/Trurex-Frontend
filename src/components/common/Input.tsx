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
  error?: string;
}

const Input = ({
  label,
  labelRight,
  labelClassName,
  inputClassName,
  secure,
  error,
  style,
  ...props
}: InputProps) => {
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
        <View
          className={`flex-row items-center rounded-lg border bg-card transition-all ${error ? 'border-destructive' : 'border-border focus-within:border-primary'} ${inputClassName ?? ''}`}
        >
          <TextInput
            className="flex-1 px-3 py-2.5 text-sm text-foreground focus:outline-none"
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
          className={`w-full rounded-lg border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none transition-all ${error ? 'border-destructive' : 'border-border focus:border-primary'} ${inputClassName ?? ''}`}
          style={caretStyle}
          placeholderTextColor={Theme.colors.muted}
          autoCapitalize="none"
          selectionColor={Theme.colors.foreground}
          {...props}
        />
      )}
      {error ? <Text className="mt-1 text-xs text-destructive">{error}</Text> : null}
    </View>
  );
};

export default Input;
