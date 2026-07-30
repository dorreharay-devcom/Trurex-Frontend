import React from 'react';
import { Text, Linking } from 'react-native';
import { LEGAL_CONTACT_EMAIL } from '~/constants/legal';

type Props = {
  body: string;
};

const SupportEmailLink = () => (
  <Text
    className="text-sm leading-6 font-medium text-blue-600"
    onPress={() => void Linking.openURL(`mailto:${LEGAL_CONTACT_EMAIL}`)}
    accessibilityRole="link"
    accessibilityLabel={`Email ${LEGAL_CONTACT_EMAIL}`}
  >
    {LEGAL_CONTACT_EMAIL}
  </Text>
);

const LegalSectionBody = ({ body }: Props) => {
  const parts = body.split(LEGAL_CONTACT_EMAIL);

  if (parts.length === 1) {
    return <Text className="text-sm leading-6 text-foreground">{body}</Text>;
  }

  return (
    <Text className="text-sm leading-6 text-foreground">
      {parts.map((part, index) => (
        <React.Fragment key={`${part}-${index}`}>
          {part}
          {index < parts.length - 1 && <SupportEmailLink />}
        </React.Fragment>
      ))}
    </Text>
  );
};

export default LegalSectionBody;
