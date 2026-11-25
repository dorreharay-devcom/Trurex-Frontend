import React, { useCallback } from 'react';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import EditProfile from '~/features/profile/ui/EditProfile';
import { KEYBOARD_BEHAVIOR_PADDING_OR_HEIGHT } from '~/shared/config/keyboard';
import { Routes } from '~/shared/config/routes';
import { webContainerStyle } from '~/shared/lib/ui/styles';
import { MY_PROFILES_QUERY_KEY_ROOT } from '~/shared/config/queryKeys';

export default function EditProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const onClose = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: MY_PROFILES_QUERY_KEY_ROOT });
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(Routes.Profile);
  }, [queryClient, router]);

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
        <EditProfile
          onClose={onClose}
          onOpenBlockedUsers={() => router.push(Routes.ProfileBlocked)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
