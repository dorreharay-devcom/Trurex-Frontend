import React from 'react';
import { Text } from 'react-native';
import { useRouter } from 'expo-router';
import { getLegalDocumentRoute } from '~/features/auth/lib/openLegalDocument';

const INTRO = {
  signup: 'By creating an account, you agree to our',
  login: 'By continuing, you agree to our',
} as const;

type Props = {
  variant?: keyof typeof INTRO;
};

const AuthTermsAcceptanceField = ({ variant = 'signup' }: Props) => {
  const router = useRouter();

  return (
    <Text className="text-xs leading-5 text-muted-foreground">
      {INTRO[variant]}
      {'\u00A0'}
      <Text
        className="font-semibold text-blue-600"
        onPress={() => router.push(getLegalDocumentRoute('terms'))}
        accessibilityRole="link"
      >
        Terms of Use
      </Text>
      {'\u00A0'}and{'\u00A0'}
      <Text
        className="font-semibold text-blue-600"
        onPress={() => router.push(getLegalDocumentRoute('communityGuidelines'))}
        accessibilityRole="link"
      >
        Community Guidelines
      </Text>
      .
    </Text>
  );
};

export default AuthTermsAcceptanceField;
