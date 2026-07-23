import React from 'react';
import { LegalDocumentScreen } from '~/components/auth/LegalDocumentScreen';
import { PRIVACY_POLICY } from '~/constants/legalDocuments';

export default function PrivacyScreen() {
  return <LegalDocumentScreen document={PRIVACY_POLICY} />;
}
