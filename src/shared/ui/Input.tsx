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
import { isWeb } from '~/shared/lib/ui/platform';
import { cn } from '~/shared/lib/ui/styles';

type Props = TextInputProps & {
  label: string;
  labelRight?: React.ReactNode;
  labelClassName?: string;
  inputClassName?: string;
  prefix?: string;
  secure?: boolean;
  error?: string;
};

const WEB_FOCUS_WITHIN =
  'focus-within:outline-none focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/40';

function fieldInputStyle(
  multiline: boolean | undefined,
  style: StyleProp<TextStyle>,
): StyleProp<TextStyle> {
  if (multiline) return [style, textFieldCaretStyle, textFieldMultilineStyle];
  if (isWeb) return [style, textFieldCaretStyle];
  return [
    style,
    textFieldCaretStyle,
    textFieldSingleLineStyle,
    textFieldSingleLineDefaultHeightStyle,
  ];
}

export function Input({
  label,
  labelRight,
  labelClassName,
  inputClassName,
  prefix,
  secure = false,
  error,
  style,
  multiline,
  autoCapitalize,
  secureTextEntry,
  ...props
}: Props) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const hasError = Boolean(error);

  return (
    <View>
      <View className="mb-1.5 flex-row items-center justify-between">
        <Text className={cn('text-sm font-medium text-foreground', labelClassName)}>{label}</Text>
        {labelRight}
      </View>

      <View
        className={cn(
          'flex-row items-center rounded-lg border bg-card',
          hasError ? 'border-destructive' : 'border-border',
          isWeb && WEB_FOCUS_WITHIN,
          inputClassName,
        )}
      >
        {prefix ? (
          <Text className="pl-3 text-sm text-muted-foreground" pointerEvents="none">
            {prefix}
          </Text>
        ) : null}

        <TextInput
          {...props}
          multiline={multiline}
          className={cn(
            'min-w-0 flex-1 px-3 py-2.5 text-sm text-foreground',
            isWeb && 'outline-none',
            prefix && 'pl-2',
          )}
          style={fieldInputStyle(multiline, style)}
          secureTextEntry={secure ? !passwordVisible : secureTextEntry}
          placeholderTextColor={Theme.colors.muted}
          autoCapitalize={autoCapitalize ?? 'none'}
          selectionColor={Theme.colors.foreground}
        />

        {secure ? (
          <TouchableOpacity
            onPress={() => setPasswordVisible((visible) => !visible)}
            className="px-3"
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
          >
            {passwordVisible ? (
              <Eye size={16} color={Theme.colors.muted} />
            ) : (
              <EyeOff size={16} color={Theme.colors.muted} />
            )}
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? <Text className="mt-1 text-xs text-destructive">{error}</Text> : null}
    </View>
  );
}
