import React, { useCallback } from 'react';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import EditBusinessProfile from '~/features/business-account/ui/edit/EditBusinessProfile';
import { KEYBOARD_BEHAVIOR_PADDING_OR_HEIGHT } from '~/shared/config/keyboard';
import { TEMPORARY_ENABLE_BUSINESS_PROFILE_CLAIM } from '~/shared/config/featureFlags';
import { Routes } from '~/shared/config/routes';
import { webContainerStyle } from '~/shared/lib/ui/styles';

export default function EditBusinessProfileScreen() {
  const router = useRouter();

  const onClose = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(Routes.MyBusinessPage);
  }, [router]);

  if (!TEMPORARY_ENABLE_BUSINESS_PROFILE_CLAIM) return <Redirect href={Routes.Main} />;

  return (
    <KeyboardAvoidingView behavior={KEYBOARD_BEHAVIOR_PADDING_OR_HEIGHT} className="min-h-0 flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={webContainerStyle}
        contentContainerClassName="p-4 pb-40"
      >
        <EditBusinessProfile onClose={onClose} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
