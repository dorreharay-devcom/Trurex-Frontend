import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { AUTH_INVITE_CODE_LENGTH, normalizeInviteCode } from '~/features/auth/config/authInvite';
import type { InviteCodeInputRef } from '~/features/auth/types';
import { cn } from '~/shared/lib/ui/styles';

type Props = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export type { InviteCodeInputRef };

const DIGIT_SLOTS = Array.from({ length: AUTH_INVITE_CODE_LENGTH }, (_, index) => index);

function digitBorderClass(hasError: boolean, active: boolean, filled: boolean): string {
  if (hasError) return 'border-destructive';
  if (active || filled) return 'border-primary';
  return 'border-border';
}

const InviteCodeInput = forwardRef<InviteCodeInputRef, Props>(({ value, onChange, error }, ref) => {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);

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
          {DIGIT_SLOTS.map((index) => {
            const active = focused && value.length === index;
            const filled = value.length > index;

            return (
              <View
                key={index}
                className={cn(
                  'h-12 flex-1 items-center justify-center rounded-lg border bg-card',
                  digitBorderClass(hasError, active, filled),
                )}
              >
                <Text className="text-lg font-semibold text-foreground">{value[index] ?? ''}</Text>
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
          maxLength={AUTH_INVITE_CODE_LENGTH}
          caretHidden
          multiline={false}
          scrollEnabled={false}
          className="absolute inset-0 opacity-0"
        />
      </Pressable>

      {error && <Text className="mt-1 text-xs text-destructive">{error}</Text>}
    </View>
  );
});

InviteCodeInput.displayName = 'InviteCodeInput';

export default InviteCodeInput;
