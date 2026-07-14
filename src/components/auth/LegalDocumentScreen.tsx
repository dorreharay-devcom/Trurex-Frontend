import React, { useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Linking, Platform } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import AuthLayout from '~/components/common/AuthLayout';
import { LEGAL_CONTACT_EMAIL } from '~/constants/legal';
import type { LegalDocumentContent } from '~/constants/legalDocuments';
import { Routes } from '~/constants/routes';
import { Theme } from '~/theme/Theme';

type Props = {
  document: LegalDocumentContent;
};

function openSupportEmail() {
  void Linking.openURL(`mailto:${LEGAL_CONTACT_EMAIL}`);
}

function SectionBody({ body }: { body: string }) {
  if (body === LEGAL_CONTACT_EMAIL || body.trim() === LEGAL_CONTACT_EMAIL) {
    return (
      <Text
        className="text-sm leading-6 text-primary underline"
        onPress={openSupportEmail}
        accessibilityRole="link"
        accessibilityLabel={`Email ${LEGAL_CONTACT_EMAIL}`}
      >
        {LEGAL_CONTACT_EMAIL}
      </Text>
    );
  }

  const emailIndex = body.indexOf(LEGAL_CONTACT_EMAIL);
  if (emailIndex === -1) {
    return <Text className="text-sm leading-6 text-foreground">{body}</Text>;
  }

  const before = body.slice(0, emailIndex);
  const after = body.slice(emailIndex + LEGAL_CONTACT_EMAIL.length);

  return (
    <Text className="text-sm leading-6 text-foreground">
      {before}
      <Text
        className="text-sm leading-6 text-primary underline"
        onPress={openSupportEmail}
        accessibilityRole="link"
        accessibilityLabel={`Email ${LEGAL_CONTACT_EMAIL}`}
      >
        {LEGAL_CONTACT_EMAIL}
      </Text>
      {after}
    </Text>
  );
}

export function LegalDocumentScreen({ document }: Props) {
  const router = useRouter();
  const navigation = useNavigation();

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.history.back();
      return;
    }
    router.replace(Routes.Login);
  }, [navigation, router]);

  return (
    <AuthLayout>
      <View className="w-full gap-4">
        <Pressable
          onPress={handleBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="z-10 flex-row items-center gap-1 self-start py-1"
        >
          <ChevronLeft size={20} color={Theme.colors.foreground} pointerEvents="none" />
          <Text pointerEvents="none" className="text-sm font-medium text-foreground">
            Back
          </Text>
        </Pressable>

        <View className="gap-1">
          <Text className="font-display text-xl font-bold text-foreground">{document.title}</Text>
          <Text className="text-xs text-muted-foreground">Last updated {document.lastUpdated}</Text>
        </View>

        <ScrollView
          className="max-h-[70vh] rounded-xl border border-border bg-card"
          contentContainerClassName="gap-5 p-4"
          showsVerticalScrollIndicator={false}
        >
          {document.preamble.map((paragraph) => (
            <Text key={paragraph} className="text-sm leading-6 text-foreground">
              {paragraph}
            </Text>
          ))}

          {document.sections.map((section) => (
            <View key={section.title} className="gap-1">
              <Text className="text-sm font-bold text-foreground">{section.title}</Text>
              <SectionBody body={section.body} />
            </View>
          ))}
        </ScrollView>
      </View>
    </AuthLayout>
  );
}
