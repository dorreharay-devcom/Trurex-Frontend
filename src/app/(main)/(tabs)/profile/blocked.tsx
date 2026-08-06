import React, { useCallback } from 'react';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import BlockedUsersPanel from '~/features/profile/ui/BlockedUsersPanel';
import { KEYBOARD_BEHAVIOR_PADDING_OR_HEIGHT } from '~/shared/config/keyboard';
import { Routes } from '~/shared/config/routes';
import { webContainerStyle } from '~/shared/lib/ui/styles';

export default function BlockedUsersScreen() {
  const router = useRouter();

  const onBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(Routes.ProfileEdit);
  }, [router]);

  return (
    <KeyboardAvoidingView behavior={KEYBOARD_BEHAVIOR_PADDING_OR_HEIGHT} className="min-h-0 flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={webContainerStyle}
        contentContainerClassName="p-4 pb-40"
      >
        <BlockedUsersPanel onBack={onBack} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
