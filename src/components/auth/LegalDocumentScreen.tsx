import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import AuthLayout from '~/components/common/AuthLayout';
import { Theme } from '~/theme/Theme';

type Props = {
  title: string;
  body: string;
};

export function LegalDocumentScreen({ title, body }: Props) {
  const router = useRouter();

  return (
    <AuthLayout>
      <View className="w-full gap-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-1 self-start"
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={20} color={Theme.colors.foreground} />
          <Text className="text-sm font-medium text-foreground">Back</Text>
        </TouchableOpacity>

        <Text className="text-xl font-display font-bold text-foreground">{title}</Text>

        <ScrollView
          className="max-h-[70vh] rounded-xl border border-border bg-card"
          contentContainerClassName="p-4"
          showsVerticalScrollIndicator
        >
          <Text className="text-sm leading-6 text-foreground whitespace-pre-line">{body}</Text>
        </ScrollView>
      </View>
    </AuthLayout>
  );
}
