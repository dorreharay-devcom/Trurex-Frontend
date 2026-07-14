import React from 'react';
import { LegalDocumentScreen } from '~/components/auth/LegalDocumentScreen';
import { TERMS_OF_USE } from '~/constants/legalDocuments';

export default function TermsScreen() {
  return <LegalDocumentScreen document={TERMS_OF_USE} />;
}
