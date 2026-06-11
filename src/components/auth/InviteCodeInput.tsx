import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { normalizeInviteCode } from '~/constants/authInvite';

type Props = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export type InviteCodeInputRef = {
  focus: () => void;
};

export const InviteCodeInput = forwardRef<InviteCodeInputRef, Props>(
  ({ value, onChange, error }, ref) => {
    const inputRef = useRef<TextInput>(null);
    const [focused, setFocused] = useState(false);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }));

    return (
      <View>
        <Text className="mb-1.5 text-sm font-medium text-foreground">Invite code</Text>
        <Pressable
          onPress={() => inputRef.current?.focus()}
          accessibilityRole="button"
          accessibilityLabel="Invite code"
          className="relative"
        >
          <View className="flex-row gap-2">
            {Array.from({ length: 6 }).map((_, index) => {
              const active = focused && value.length === index;
              const filled = value.length > index;
              return (
                <View
                  key={index}
                  className={`h-12 flex-1 items-center justify-center rounded-lg border bg-card ${
                    error
                      ? 'border-destructive'
                      : active || filled
                        ? 'border-primary'
                        : 'border-border'
                  }`}
                >
                  <Text className="text-lg font-semibold text-foreground">
                    {value[index] ?? ''}
                  </Text>
                </View>
              );
            })}
          </View>
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={(next) => onChange(normalizeInviteCode(next))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            maxLength={6}
            caretHidden
            className="absolute inset-0 opacity-0"
          />
        </Pressable>
        {error ? <Text className="mt-1 text-xs text-destructive">{error}</Text> : null}
      </View>
    );
  },
);

InviteCodeInput.displayName = 'InviteCodeInput';
