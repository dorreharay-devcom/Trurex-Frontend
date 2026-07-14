import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';
import type { AuthTermsAcceptanceState } from '~/hooks/auth/useAuthTermsAcceptance';
import { getLegalDocumentRoute } from '~/utils/openLegalDocument';

type Props = {
  terms: AuthTermsAcceptanceState;
};

function LegalLink({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="link" hitSlop={4}>
      <Text className="text-xs font-semibold text-primary underline">{label}</Text>
    </Pressable>
  );
}

export function AuthTermsAcceptanceField({ terms }: Props) {
  const router = useRouter();

  return (
    <View className="gap-1.5">
      <View className="flex-row items-start gap-2.5">
        <Pressable
          onPress={() => terms.onChange(!terms.accepted)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: terms.accepted }}
          accessibilityLabel="Agree to Terms of Use and Community Guidelines"
          hitSlop={4}
        >
          <View
            className={`mt-0.5 h-5 w-5 items-center justify-center rounded border ${
              terms.error
                ? 'border-destructive bg-card'
                : terms.accepted
                  ? 'border-primary bg-primary'
                  : 'border-border bg-card'
            }`}
          >
            {terms.accepted ? <Check size={14} color={Theme.colors.primaryForeground} /> : null}
          </View>
        </Pressable>

        <View className="flex-1 flex-row flex-wrap items-center gap-x-1">
          <Text className="text-xs leading-5 text-foreground">I agree to the</Text>
          <LegalLink
            label="Terms of Use"
            onPress={() => router.push(getLegalDocumentRoute('terms'))}
          />
          <Text className="text-xs leading-5 text-foreground">and</Text>
          <LegalLink
            label="Community Guidelines"
            onPress={() => router.push(getLegalDocumentRoute('communityGuidelines'))}
          />
          <Text className="text-xs leading-5 text-foreground">.</Text>
        </View>
      </View>

      {terms.error ? (
        <Text className="text-xs text-destructive" accessibilityLiveRegion="polite">
          {terms.error}
        </Text>
      ) : null}
    </View>
  );
}
