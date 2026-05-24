import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  type TextInputProps,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import {
  Theme,
  textFieldCaretStyle,
  textFieldSingleLineDefaultHeightStyle,
  textFieldSingleLineStyle,
} from '~/theme/Theme';
import { INPUT_FOCUS_RING_CLASS } from '~/constants/inputFocus';

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

  const inputStyle: StyleProp<TextStyle> = props.multiline
    ? [style, textFieldCaretStyle]
    : [
        style,
        textFieldCaretStyle,
        Platform.OS === 'web'
          ? null
          : [textFieldSingleLineStyle, textFieldSingleLineDefaultHeightStyle],
      ];

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
          className={`flex-row items-center rounded-lg border bg-card ${error ? 'border-destructive' : 'border-border'} ${inputClassName ?? ''}`}
        >
          <TextInput
            className={`flex-1 px-3 py-2.5 text-sm text-foreground ${INPUT_FOCUS_RING_CLASS}`}
            style={inputStyle}
            secureTextEntry={!showPassword}
            placeholderTextColor={Theme.colors.muted}
            autoCapitalize="none"
            selectionColor={Theme.colors.foreground}
            {...props}
          />
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)} className="px-3">
            {showPassword ? (
              <Eye size={16} color={Theme.colors.muted} />
            ) : (
              <EyeOff size={16} color={Theme.colors.muted} />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <TextInput
          className={`w-full rounded-lg border bg-card px-3 py-2.5 text-sm text-foreground ${error ? 'border-destructive' : 'border-border'} ${inputClassName ?? ''}`}
          style={inputStyle}
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
