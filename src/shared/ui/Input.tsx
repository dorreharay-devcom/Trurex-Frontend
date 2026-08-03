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
import {
  Theme,
  textFieldCaretStyle,
  textFieldMultilineStyle,
  textFieldSingleLineDefaultHeightStyle,
  textFieldSingleLineStyle,
} from '~/shared/theme/Theme';
import { INPUT_FOCUS_RING_CLASS } from '~/shared/config/inputFocus';
import { cn, isWeb } from '~/utils';

type InputProps = TextInputProps & {
  label: string;
  labelRight?: React.ReactNode;
  labelClassName?: string;
  inputClassName?: string;
  secure?: boolean;
  error?: string;
};

const Input = ({
  label,
  labelRight,
  labelClassName,
  inputClassName,
  secure = false,
  error,
  style,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const borderClass = error ? 'border-destructive' : 'border-border';
  const inputStyle: StyleProp<TextStyle> = props.multiline
    ? [style, textFieldCaretStyle, textFieldMultilineStyle]
    : [
        style,
        textFieldCaretStyle,
        isWeb ? null : [textFieldSingleLineStyle, textFieldSingleLineDefaultHeightStyle],
      ];

  const textInput = (
    <TextInput
      {...props}
      className={cn(
        'px-3 py-2.5 text-sm text-foreground',
        INPUT_FOCUS_RING_CLASS,
        secure ? 'flex-1' : cn('w-full rounded-lg border bg-card', borderClass, inputClassName),
      )}
      style={inputStyle}
      secureTextEntry={secure ? !showPassword : props.secureTextEntry}
      placeholderTextColor={Theme.colors.muted}
      autoCapitalize={props.autoCapitalize ?? 'none'}
      selectionColor={Theme.colors.foreground}
    />
  );

  return (
    <View>
      <View className="mb-1.5 flex-row items-center justify-between">
        <Text className={cn('text-sm font-medium text-foreground', labelClassName)}>{label}</Text>
        {labelRight}
      </View>

      {secure ? (
        <View
          className={cn(
            'flex-row items-center rounded-lg border bg-card',
            borderClass,
            inputClassName,
          )}
        >
          {textInput}
          <TouchableOpacity
            onPress={() => setShowPassword((visible) => !visible)}
            className="px-3"
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <Eye size={16} color={Theme.colors.muted} />
            ) : (
              <EyeOff size={16} color={Theme.colors.muted} />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        textInput
      )}

      {error ? <Text className="mt-1 text-xs text-destructive">{error}</Text> : null}
    </View>
  );
};

export default Input;
