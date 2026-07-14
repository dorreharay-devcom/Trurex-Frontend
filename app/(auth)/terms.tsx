import React from 'react';
import { LegalDocumentScreen } from '~/components/auth/LegalDocumentScreen';
import { TERMS_OF_USE_BODY, TERMS_OF_USE_TITLE } from '~/constants/legalDocuments';

export default function TermsScreen() {
  return <LegalDocumentScreen title={TERMS_OF_USE_TITLE} body={TERMS_OF_USE_BODY} />;
}
