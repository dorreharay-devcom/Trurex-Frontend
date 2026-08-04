import React from 'react';
import { View, Text, ScrollView, useWindowDimensions } from 'react-native';
import AuthLayout from '~/features/auth/ui/common/AuthLayout';
import type { LegalDocumentContent } from '~/features/auth/config/legalDocuments';
import { useLeaveLegalDocument } from '~/features/auth/hooks/useLeaveLegalDocument';
import LegalBackButton from '~/features/auth/ui/legal/LegalBackButton';
import LegalSectionBody from '~/features/auth/ui/legal/LegalSectionBody';
import { isAndroid } from '~/shared/lib/ui/platform';

type Props = {
  document: LegalDocumentContent;
};

const DOCUMENT_VIEWPORT_RATIO = 0.7;

const LegalDocumentScreen = ({ document }: Props) => {
  const onBack = useLeaveLegalDocument();
  const { height: windowHeight } = useWindowDimensions();
  const documentMaxHeight = Math.round(windowHeight * DOCUMENT_VIEWPORT_RATIO);

  return (
    <AuthLayout>
      <View className="w-full gap-4">
        <LegalBackButton onPress={onBack} />

        <View className="gap-1">
          <Text className="font-display text-xl font-bold text-foreground">{document.title}</Text>
          <Text className="text-xs text-muted-foreground">Last updated {document.lastUpdated}</Text>
        </View>

        <ScrollView
          className="rounded-xl border border-border bg-card"
          style={{ maxHeight: documentMaxHeight }}
          contentContainerClassName="gap-5 p-4"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={isAndroid}
        >
          {document.preamble.map((paragraph) => (
            <Text key={paragraph} className="text-sm leading-6 text-foreground">
              {paragraph}
            </Text>
          ))}

          {document.sections.map((section) => (
            <View key={section.title} className="gap-1">
              <Text className="text-sm font-bold text-foreground">{section.title}</Text>
              <LegalSectionBody body={section.body} />
            </View>
          ))}
        </ScrollView>
      </View>
    </AuthLayout>
  );
};

export default LegalDocumentScreen;
