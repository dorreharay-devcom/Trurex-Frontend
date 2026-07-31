import React, { forwardRef } from 'react';
import {
  Pressable,
  TextInput,
  View,
  type TextInputProps,
  type TextStyle,
  type StyleProp,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { cn } from '~/utils/general';

type ClearableSearchInputProps = Omit<TextInputProps, 'value' | 'onChangeText' | 'style'> & {
  value: string;
  onChangeText: (value: string) => void;
  containerClassName?: string;
  inputClassName?: string;
  inputStyle?: StyleProp<TextStyle>;
  iconClassName?: string;
  clearButtonClassName?: string;
  iconColor?: string;
  clearIconColor?: string;
  iconSize?: number;
  clearIconSize?: number;
  onClear?: () => void;
};

export const ClearableSearchInput = forwardRef<TextInput, ClearableSearchInputProps>(
  (
    {
      value,
      onChangeText,
      containerClassName,
      inputClassName,
      inputStyle,
      iconClassName,
      clearButtonClassName,
      iconColor = Theme.colors.muted,
      clearIconColor = Theme.colors.muted,
      iconSize = 16,
      clearIconSize = 16,
      onClear,
      returnKeyType = 'search',
      multiline = false,
      numberOfLines = 1,
      scrollEnabled = false,
      ...inputProps
    },
    ref,
  ) => {
    const showClear = value.length > 0;

    return (
      <View className={cn('relative w-full', containerClassName)}>
        <View
          pointerEvents="none"
          className={cn('absolute bottom-0 left-3 top-0 z-10 justify-center', iconClassName)}
        >
          <Search size={iconSize} color={iconColor} />
        </View>

        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          returnKeyType={returnKeyType}
          {...inputProps}
          multiline={multiline}
          numberOfLines={numberOfLines}
          scrollEnabled={scrollEnabled}
          clearButtonMode="never"
          className={inputClassName}
          style={inputStyle}
        />

        {showClear ? (
          <Pressable
            onPress={() => {
              onChangeText('');
              onClear?.();
            }}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            className={cn(
              'absolute bottom-0 right-3 top-0 z-10 justify-center',
              clearButtonClassName,
            )}
          >
            <X size={clearIconSize} color={clearIconColor} />
          </Pressable>
        ) : null}
      </View>
    );
  },
);

ClearableSearchInput.displayName = 'ClearableSearchInput';
